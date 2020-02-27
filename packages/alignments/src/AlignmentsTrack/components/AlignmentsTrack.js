// import { getConf } from '@gmod/jbrowse-core/configuration'
import BlockBasedTrack from '@gmod/jbrowse-plugin-linear-genome-view/src/BasicTrack/components/BlockBasedTrack'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'
import React from 'react'
import { YScaleBar } from '@gmod/jbrowse-plugin-wiggle/src/WiggleTrack/components/WiggleTrackComponent'
import ContextMenu from '@gmod/jbrowse-core/ui/ContextMenu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const initialState = {
  mouseX: null,
  mouseY: null,
}

function AlignmentsTrackComponent(props) {
  const [state, setState] = React.useState(initialState)
  const [coverage, setCoverage] = React.useState(true)
  const [pileup, setPileup] = React.useState(true)

  const { model } = props
  const { PileupTrack, SNPCoverageTrack } = model

  let showScalebar = false
  if (SNPCoverageTrack) {
    const { ready, stats, needsScalebar } = SNPCoverageTrack
    if (ready && stats && needsScalebar) showScalebar = true
  }

  const handleClick = e => {
    e.preventDefault()
    setState(prevState => ({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
      showCoverage: prevState.showCoverage || true,
      showPileup: prevState.showPileup || true,
    }))
  }

  const handleClose = () => {
    setState(initialState)
  }

  const handleCoverage = e => {
    e.preventDefault()
    setCoverage(!coverage)
    handleClose()
  }

  const handlePileup = e => {
    e.preventDefault()
    setPileup(!pileup)
    handleClose()
  }

  return (
    // <BlockBasedTrack {...props} {...PileupTrack} {...SNPCoverageTrack}>
    //   {showScalebar ? <YScaleBar model={SNPCoverageTrack} /> : null}
    // </BlockBasedTrack>

    <div onContextMenu={handleClick}>
      <BlockBasedTrack {...props} {...PileupTrack} {...SNPCoverageTrack}>
        {showScalebar ? <YScaleBar model={SNPCoverageTrack} /> : null}

        <Menu
          keepMounted
          open={state.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            state.mouseY !== null && state.mouseX !== null
              ? { top: state.mouseY, left: state.mouseX }
              : undefined
          }
        >
          <MenuItem
            id="showCoverage"
            onClick={handleCoverage}
            disabled={!pileup}
          >
            {coverage ? 'Hide Coverage Track' : 'Show Coverage Track'}
          </MenuItem>
          <MenuItem id="showPileup" onClick={handlePileup} disabled={!coverage}>
            {pileup ? 'Hide Pileup Track' : 'Show Pileup Track'}
          </MenuItem>
          <MenuItem onClick={handleClose}>Sort</MenuItem>
          <MenuItem onClick={handleClose}>Copy</MenuItem>
        </Menu>
      </BlockBasedTrack>
    </div>
  )
}

AlignmentsTrackComponent.propTypes = {
  model: MobxPropTypes.observableObject.isRequired,
}

export default observer(AlignmentsTrackComponent)
