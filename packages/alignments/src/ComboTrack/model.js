import {
  getConf,
  ConfigurationReference,
} from '@gmod/jbrowse-core/configuration'
import { BaseTrack } from '@gmod/jbrowse-plugin-linear-genome-view'
import { types } from 'mobx-state-tree'
import ComboTrackComponent from './components/ComboTrack'

export default (pluginManager, configSchema) => {
  return types.compose(
    'ComboTrack',
    BaseTrack,
    types
      .model({
        PileupTrack: types.maybe(
          pluginManager.getTrackType('PileupTrack').stateModel,
        ),
        SNPCoverageTrack: types.maybe(
          pluginManager.getTrackType('SNPCoverageTrack').stateModel,
        ),
        type: types.literal('ComboTrack'),
        configuration: ConfigurationReference(configSchema),
        height: 250,
      })
      .volatile(() => ({
        ReactComponent: ComboTrackComponent,
      }))
      .actions(self => ({
        afterAttach() {
          const {
            pileupTrackConfig,
            snpCoverageTrackConfig,
          } = self.configuration

          self.PileupTrack = {
            type: 'PileupTrack',
            configuration: pileupTrackConfig,
          }
          snpCoverageTrackConfig.trackId !== 'placeholderId' // temp conditional while adding snpcoverage to config is necessary
            ? (self.SNPCoverageTrack = {
                type: 'SNPCoverageTrack',
                configuration: snpCoverageTrackConfig,
              })
            : delete self.SNPCoverageTrack

          /* Below is a theoretical version if the configSchema only required generic track info rather
             than specific alignments/snp coverage track info. Issue is config editor options must all be top level */
          // self.PileupTrack = {
          //   type: 'PileupTrack',
          //   configuration: {
          //     ...getConf(self, 'pileupTrackConfig'),
          //     type: 'PileupTrack',
          //     name: `${getConf(self, 'name')} pileup`,
          //     trackId: `${self.configuration.trackId}_pileup`,
          //   },
          // }
          // self.SNPCoverageTrack = {
          //   type: 'SNPCoverageTrack',
          //   configuration: {
          //     ...getConf(self, 'pileupTrackConfig'),
          //     type: 'SNPCoverageTrack',
          //     name: `${getConf(self, 'name')} snpcoverage`,
          //     trackId: `${self.configuration.trackId}_snpcoverage`,
          //     adapter: {
          //       type: 'SNPCoverageAdapter',
          //       subadapter: getConf(self, 'pileupTrackConfig').adapter,
          //     },
          //   },
          // }
        },
      })),
  )
}
