/**
 * Based on https://material-ui.com/components/autocomplete/#Virtualize.tsx
 * Asynchronous Requests for autocomplete: https://material-ui.com/components/autocomplete/
 */
import { Region } from '@jbrowse/core/util/types'
import { getSession } from '@jbrowse/core/util'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField, { TextFieldProps as TFP } from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import { InputAdornment } from '@material-ui/core'
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete'
import { observer } from 'mobx-react'
import { getSnapshot } from 'mobx-state-tree'
import React, { useEffect } from 'react'
import { LinearGenomeViewModel } from '..'

// filter for options that were fetched
const filter = createFilterOptions<Option>({ trim: true, limit: 36 })

export interface Option {
  type: string
  value: string
  inputValue?: string
}

function RefNameAutocomplete({
  model,
  onSelect,
  assemblyName,
  style,
  value,
  TextFieldProps = {},
}: {
  model: LinearGenomeViewModel
  onSelect: (region: Region | undefined) => void
  assemblyName?: string
  value?: string
  style?: React.CSSProperties
  TextFieldProps?: TFP
}) {
  const [possibleOptions, setPossibleOptions] = React.useState<Array<Option>>(
    [],
  )
  const session = getSession(model)
  const { assemblyManager } = getSession(model)
  const assembly = assemblyName && assemblyManager.get(assemblyName)
  const regions: Region[] = (assembly && assembly.regions) || []
  const {
    coarseVisibleLocStrings,
    visibleLocStrings: nonCoarseVisibleLocStrings,
  } = model
  const visibleLocStrings =
    coarseVisibleLocStrings || nonCoarseVisibleLocStrings
  const loaded = regions.length !== 0

  useEffect(() => {
    let active = true
    if (loaded && active) {
      const possOptions = regions.map(option => {
        return { type: 'reference sequence', value: option.refName }
      })
      setPossibleOptions(possOptions)
      return undefined
    }
    return () => {
      active = false
    }
  }, [loaded, regions])

  function onChange(newRegionName: Option | string | null) {
    let newRegionValue: string | undefined
    if (newRegionName) {
      if (typeof newRegionName === 'object') {
        newRegionValue = newRegionName.inputValue || newRegionName.value
      }
      if (typeof newRegionName === 'string') {
        newRegionValue = newRegionName
      }
      const newRegion: Region | undefined = regions.find(
        region => newRegionValue === region.refName,
      )
      if (newRegion) {
        // @ts-ignore
        onSelect(getSnapshot(newRegion))
      } else {
        newRegionValue && navTo(newRegionValue)
      }
    }
  }

  function navTo(locString: string) {
    try {
      if (model.displayedRegions.length !== 0) {
        model.navToLocString(locString)
      } else {
        throw new Error(`Unknown reference sequence "${locString}"`)
      }
      // model.navToLocString(locString)
    } catch (e) {
      console.warn(e)
      session.notify(`${e}`, 'warning')
    }
  }

  return (
    <Autocomplete
      id={`refNameAutocomplete-${model.id}`}
      ListboxProps={{ style: { maxHeight: 250 } }}
      data-testid="autocomplete"
      freeSolo
      selectOnFocus
      disableListWrap
      disableClearable
      style={style}
      loading={loaded}
      value={visibleLocStrings || value || ''}
      includeInputInList
      disabled={!assemblyName || !loaded}
      options={possibleOptions} // sort them
      groupBy={option => String(option.type)}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)
        // creates new option if user input does not match options
        if (params.inputValue !== '') {
          const newOption: Option = {
            type: 'Search',
            inputValue: params.inputValue,
            value: params.inputValue,
          }
          filtered.push(newOption)
        }
        return filtered
      }}
      onChange={(e, newRegion) => {
        e.preventDefault()
        onChange(newRegion)
      }}
      renderInput={params => {
        const { helperText, InputProps = {} } = TextFieldProps
        const TextFieldInputProps = {
          ...params.InputProps,
          ...InputProps,
          endAdornment: (
            <>
              {!loaded ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <InputAdornment position="end" style={{ marginRight: 7 }}>
                  <SearchIcon />
                </InputAdornment>
              )}
              {params.InputProps.endAdornment}
            </>
          ),
        }
        return (
          <TextField
            {...params}
            {...TextFieldProps}
            helperText={helperText}
            InputProps={TextFieldInputProps}
            placeholder="Search for location"
          />
        )
      }}
      renderOption={option => <Typography noWrap>{option.value}</Typography>}
      getOptionLabel={option => {
        if (typeof option === 'string') {
          return option
        }
        if (option.inputValue) {
          return option.inputValue
        }
        return option.value
      }}
    />
  )
}

export default observer(RefNameAutocomplete)
