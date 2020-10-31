import { FileSelector } from '@jbrowse/core/ui'
import { JsonEditor } from '@jbrowse/plugin-config'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import React from 'react'

const fromConfigDefault = [
  {
    uniqueId: 'one',
    refName: 'chr1',
    start: 100,
    end: 101,
  },
  {
    uniqueId: 'two',
    refName: 'chr1',
    start: 110,
    end: 111,
  },
  {
    uniqueId: 'three',
    refName: 'chr1',
    start: 120,
    end: 121,
  },
  {
    uniqueId: 'four',
    refName: 'chr1',
    start: 130,
    end: 131,
  },
]

const fromFileDefault = { uri: '' }

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    padding: theme.spacing(1),
  },
}))
function handleChange(event, setTrackSource, setTrackData) {
  setTrackSource(event.target.value)
  switch (event.target.value) {
    case 'fromFile':
      setTrackData(fromFileDefault)
      break
    case 'fromConfig':
      setTrackData({ config: fromConfigDefault })
      break
    default:
      break
  }
}

function TrackSourceSelect({
  trackSource,
  setTrackSource,
  trackData,
  setTrackData,
}) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <FileSelector
          name="URL"
          description=""
          location={trackData}
          setLocation={setTrackData}
        />
        <FileSelector
          name="Index URL (optional)"
          description=""
          location={trackData}
          setLocation={setTrackData}
        />
      </Paper>
    </div>
  )
}

TrackSourceSelect.propTypes = {
  trackSource: PropTypes.string.isRequired,
  setTrackSource: PropTypes.func.isRequired,
  trackData: PropTypes.objectOf(PropTypes.any).isRequired,
  setTrackData: PropTypes.func.isRequired,
}

export default TrackSourceSelect
