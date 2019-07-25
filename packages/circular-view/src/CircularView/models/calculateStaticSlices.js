import {
  viewportVisibleSection,
  thetaRangesOverlap,
} from './viewportVisibleRegion'

export default ({ jbrequire }) => {
  const { polarToCartesian, assembleLocString } = jbrequire(
    '@gmod/jbrowse-core/util',
  )

  class Slice {
    flipped = false

    constructor(view, region, currentRadianOffset, isVisible) {
      const { bpPerRadian } = view
      this.key = assembleLocString(region)
      this.region = region
      this.offsetRadians = currentRadianOffset
      this.bpPerRadian = bpPerRadian
      this.visible = isVisible

      this.startRadians = this.offsetRadians
      this.endRadians = region.widthBp / this.bpPerRadian + this.offsetRadians
      Object.freeze(this)
    }

    bpToXY(bp, radiusPx) {
      let offsetBp
      if (this.region.elided) {
        offsetBp = this.region.widthBp / 2
      } else if (this.flipped) {
        offsetBp = this.region.end - bp
      } else {
        offsetBp = bp - this.region.start
      }
      const totalRadians = offsetBp / this.bpPerRadian + this.offsetRadians
      return polarToCartesian(radiusPx, totalRadians)
    }
  }

  return function calculateStaticSlices(self) {
    const {
      // rho: visibleRhoRange,
      theta: [visibleThetaMin, visibleThetaMax],
    } = viewportVisibleSection(
      [
        self.scrollX,
        self.scrollX + self.width,
        self.scrollY,
        self.scrollY + self.height,
      ],
      self.centerXY,
      self.radiusPx,
    )

    const slices = []
    let currentRadianOffset = 0
    for (const region of self.elidedRegions) {
      const radianWidth =
        region.widthBp / self.bpPerRadian + self.spacingPx / self.pxPerRadian
      const slice = new Slice(
        self,
        region,
        currentRadianOffset,
        thetaRangesOverlap(
          currentRadianOffset + self.offsetRadians,
          radianWidth,
          visibleThetaMin,
          visibleThetaMax - visibleThetaMin,
        ),
      )
      slices.push(slice)
      currentRadianOffset += radianWidth
    }
    return slices
  }
}
