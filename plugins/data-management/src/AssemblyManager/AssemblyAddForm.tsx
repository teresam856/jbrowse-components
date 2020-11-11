import React, { useState } from 'react'
import { observer } from 'mobx-react'
import TextField from '@material-ui/core/TextField'
import { Grid, MenuItem, Paper } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflow: 'hidden',
      padding: theme.spacing(0, 3),
    },
    paper: {
      maxWidth: 400,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
    },
    createButton: {
      margin: `5px 0px 5px 200px`,
    },
  }),
)

const useSlotEditorStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    position: 'relative',
    overflow: 'visible',
  },
  paperContent: {
    flex: 'auto',
    padding: theme.spacing(1),
    overflow: 'auto',
  },
  slotModeSwitch: {
    width: 24,
    background: theme.palette.secondary.light,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const AdapterSelector = observer(
  ({
    adapterSelection,
    setAdapterSelection,
    adapterTypes,
  }: {
    adapterSelection: string
    setAdapterSelection: Function
    adapterTypes: Array<string>
  }) => {
    const classes = useSlotEditorStyles()

    return (
      <Paper className={classes.paper}>
        <div className={classes.paperContent}>
          <TextField
            value={adapterSelection}
            label="Type"
            select
            helperText="Type of adapter to use"
            fullWidth
            onChange={event => {
              setAdapterSelection(event.target.value)
            }}
          >
            {adapterTypes.map(str => (
              <MenuItem key={str} value={str}>
                {str}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Paper>
    )
  },
)

const AdapterInput = observer(
  ({
    adapterSelection,
    fastaLocation,
    setFastaLocation,
    faiLocation,
    setFaiLocation,
    gziLocation,
    setGziLocation,
    twoBitLocation,
    setTwoBitLocation,
  }: {
    adapterSelection: string
    fastaLocation: string
    setFastaLocation: Function
    faiLocation: string
    setFaiLocation: Function
    gziLocation: string
    setGziLocation: Function
    twoBitLocation: string
    setTwoBitLocation: Function
  }) => {
    if (
      adapterSelection === 'IndexedFastaAdapter' ||
      adapterSelection === 'BgzipFastaAdapter'
    ) {
      return (
        <>
          <TextField
            id="fasta-location"
            label="fastaLocation"
            variant="outlined"
            value={fastaLocation}
            onChange={event => setFastaLocation(event.target.value)}
          />
          <TextField
            id="fai-location"
            label="faiLocation"
            variant="outlined"
            value={faiLocation}
            onChange={event => setFaiLocation(event.target.value)}
          />
          {adapterSelection === 'BgzipFastaAdapter' ? (
            <TextField
              id="gzi-location"
              label="gziLocation"
              variant="outlined"
              value={gziLocation}
              onChange={event => setGziLocation(event.target.value)}
            />
          ) : null}
        </>
      )
    }

    if (adapterSelection === 'TwoBitAdapter') {
      return (
        <TextField
          id="twobit-location"
          label="twoBitLocation"
          variant="outlined"
          value={twoBitLocation}
          onChange={event => setTwoBitLocation(event.target.value)}
        />
      )
    }

    return null
  },
)

const AssemblyAddForm = observer(
  ({
    rootModel,
    setFormOpen,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rootModel: any
    setFormOpen: Function
  }) => {
    const classes = useStyles()

    const adapterTypes = [
      'IndexedFastaAdapter',
      'BgzipFastaAdapter',
      'TwoBitAdapter',
    ]

    const [assemblyName, setAssemblyName] = useState('')
    const [adapterSelection, setAdapterSelection] = useState(adapterTypes[0])
    const [fastaLocation, setFastaLocation] = useState('/path/to/seq.fa.gz')
    const [faiLocation, setFaiLocation] = useState('/path/to/seq.fa.gz.fai')
    const [gziLocation, setGziLocation] = useState('/path/to/seq.fa.gz.gzi')
    const [twoBitLocation, setTwoBitLocation] = useState('/path/to/my.2bit')

    function createAssembly() {
      if (assemblyName === '') {
        rootModel.session.notify("Can't create an assembly without a name")
      } else {
        setFormOpen(false)
        // setIsAssemblyBeingEdited(true)
        let newAssembly
        if (adapterSelection === 'IndexedFastaAdapter') {
          newAssembly = {
            name: assemblyName,
            sequence: {
              adapter: {
                type: 'IndexedFastaAdapter',
                fastaLocation: {
                  uri: fastaLocation,
                },
                faiLocation: {
                  uri: faiLocation,
                },
              },
            },
          }
        } else if (adapterSelection === 'BgzipFastaAdapter') {
          newAssembly = {
            name: assemblyName,
            sequence: {
              adapter: {
                type: 'BgzipFastaAdapter',
                fastaLocation: {
                  uri: fastaLocation,
                },
                faiLocation: {
                  uri: faiLocation,
                },
                gziLocation: {
                  uri: gziLocation,
                },
              },
            },
          }
        } else if (adapterSelection === 'TwoBitAdapter') {
          newAssembly = {
            name: assemblyName,
            sequence: {
              adapter: {
                type: 'TwoBitAdapter',
                twoBitLocation: {
                  uri: twoBitLocation,
                },
              },
            },
          }
        }
        rootModel.jbrowse.addAssemblyConf(newAssembly)
        rootModel.session.notify(
          `Successfully added ${assemblyName} assembly to JBrowse 2`,
          'success',
        )
      }
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <TextField
                id="assembly-name"
                label="Assembly Name"
                variant="outlined"
                value={assemblyName}
                onChange={event => setAssemblyName(event.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <AdapterSelector
                adapterSelection={adapterSelection}
                setAdapterSelection={setAdapterSelection}
                adapterTypes={adapterTypes}
              />
            </Grid>
            <Grid item>
              <AdapterInput
                adapterSelection={adapterSelection}
                fastaLocation={fastaLocation}
                setFastaLocation={setFastaLocation}
                faiLocation={faiLocation}
                setFaiLocation={setFaiLocation}
                gziLocation={gziLocation}
                setGziLocation={setGziLocation}
                twoBitLocation={twoBitLocation}
                setTwoBitLocation={setTwoBitLocation}
              />
            </Grid>
          </Grid>
        </Paper>
        <Button
          className={classes.createButton}
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={createAssembly}
        >
          Create New Assembly
        </Button>
      </div>
    )
  },
)

export default AssemblyAddForm
