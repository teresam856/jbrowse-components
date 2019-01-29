import { withStyles } from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import { assembleLocString } from '../../../util'

import Ruler from './Ruler'

const styles = (/* theme */) => ({
  scaleBar: {
    whiteSpace: 'nowrap',
    textAlign: 'left',
    width: '100%',
    position: 'relative',
    background: '#555',
    // background: theme.palette.background.default,
    overflow: 'hidden',
    height: '100%',
  },
  refLabel: {
    fontSize: '16px',
    position: 'absolute',
    left: '2px',
    top: '-1px',
    fontWeight: 'bold',
    background: 'white',
    // color: theme.palette.text.primary,
  },
})

function findBlockContainingLeftSideOfView(offsetPx, blocks) {
  const pxSoFar = 0
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (block.widthPx + pxSoFar > offsetPx && pxSoFar <= offsetPx) return block
  }
  return undefined
}

function ScaleBar({
  classes,
  style,
  height,
  blocks,
  offsetPx,
  bpPerPx,
  width,
  horizontallyFlipped,
}) {
  const finalStyle = Object.assign({}, style, {
    height: `${height}px`,
    width: `${width}px`,
  })

  const blockContainingLeftEndOfView = findBlockContainingLeftSideOfView(
    offsetPx,
    blocks,
  )

  return (
    <div style={finalStyle} className={classes.scaleBar}>
      {blocks.map(block => {
        const locString = assembleLocString(block)
        return (
          <Block
            leftBorder={block.isLeftEndOfDisplayedRegion}
            rightBorder={block.isRightEndOfDisplayedRegion}
            refName={block.refName}
            start={block.start}
            end={block.end}
            width={block.widthPx}
            key={locString}
            offset={offsetPx}
            bpPerPx={bpPerPx}
          >
            <svg height={height} width={block.widthPx}>
              <Ruler
                region={block}
                showRefSeqLabel={
                  !!block.isLeftEndOfDisplayedRegion &&
                  block !== blockContainingLeftEndOfView
                }
                bpPerPx={bpPerPx}
                flipped={horizontallyFlipped}
              />
            </svg>
          </Block>
        )
      })}
      {// put in a floating ref label
      blockContainingLeftEndOfView ? (
        <div className={classes.refLabel}>
          {blockContainingLeftEndOfView.refName}
        </div>
      ) : null}
    </div>
  )
}
ScaleBar.defaultProps = { style: {}, blocks: [], horizontallyFlipped: false }
ScaleBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.object),
  bpPerPx: PropTypes.number.isRequired,
  offsetPx: PropTypes.number.isRequired,
  horizontallyFlipped: PropTypes.bool,
}

export default withStyles(styles)(ScaleBar)
