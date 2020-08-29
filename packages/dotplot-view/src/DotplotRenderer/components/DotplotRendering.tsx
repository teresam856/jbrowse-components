import { getParent } from 'mobx-state-tree'
import { observer } from 'mobx-react'
import React from 'react'
import Path from 'paths-js/path'
import { Shape, Surface } from 'react-art'
import Rectangle from 'react-art/Rectangle'
import { DotplotRenderProps } from '../DotplotRenderer'
import 'art/modes/canvas'

function DotplotRendering(props: DotplotRenderProps) {
  // console.log(props)
  const { views: propViews, width, height, trackModel } = props
  const views = propViews || getParent(trackModel, 2).views
  const [hview, vview] = views
  const db1 = hview.dynamicBlocks.contentBlocks
  const db2 = vview.dynamicBlocks.contentBlocks
  const rects = []
  ;(hview.features || []).forEach(feature => {
    const start = feature.get('start')
    const end = feature.get('end')
    const refName = feature.get('refName')
    const mate = feature.get('mate')
    // const identity = feature.get('numMatches') / feature.get('blockLen')
    // ctx.fillStyle = `hsl(${identity * 150},50%,50%)`
    const b10 = hview.bpToPx({ refName, coord: start }) || 0
    const b20 = hview.bpToPx({ refName, coord: end }) || 0

    const { refName: mateRef } = mate
    const e10 = vview.bpToPx({ refName: mateRef, coord: mate.start }) || 0
    const e20 = vview.bpToPx({ refName: mateRef, coord: mate.end }) || 0

    const b1 = b10 - db1[0].offsetPx
    const b2 = b20 - db1[0].offsetPx
    const e1 = e10 - db2[0].offsetPx
    const e2 = e20 - db2[0].offsetPx
    if (
      b1 !== undefined &&
      b2 !== undefined &&
      e1 !== undefined &&
      e2 !== undefined
    ) {
      if (Math.abs(b1 - b2) < 3 && Math.abs(e1 - e2) < 3) {
        rects.push(
          <Rectangle
            key={Math.random()}
            x={b1 - 0.5}
            y={height - e1 - 0.5}
            width={1.5}
            height={1.5}
            fill="black"
          />,
        )
      } else {
        let currX = b1
        let currY = e1
        let cigar = feature.get('cg')
        if (cigar) {
          const path = Path().moveTo(currX, currY)
          cigar = (cigar.toUpperCase().match(/\d+\D/g) || [])
            .map((op: string) => {
              // @ts-ignore
              return [op.match(/\D/)[0], parseInt(op, 10)]
            })
            .forEach(([op, val]: [string, number]) => {
              const prevX = currX
              const prevY = currY
              if (op === 'M') {
                currX += val / hview.bpPerPx - 0.01
                currY += val / vview.bpPerPx - 0.01
              } else if (op === 'D') {
                currX += val / hview.bpPerPx
              } else if (op === 'I') {
                currY += val / vview.bpPerPx
              }
              path.lineto(prevX, height - prevY)
              path.lineTo(currX, height - currY)
            })
          rects.push(<Shape d={path.print()} stroke="black" />)
        } else {
          const path = Path()
            .moveto(b1, height - e1)
            .lineto(b2, height - e2)
          rects.push(<Shape d={path.print()} stroke="black" />)
        }
      }
    }
  })

  return (
    <Surface width={width} height={height}>
      {rects}
    </Surface>
  )
}

export default observer(DotplotRendering)
