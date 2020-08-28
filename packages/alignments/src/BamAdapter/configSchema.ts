import PluginManager from '@gmod/jbrowse-core/PluginManager'
import { ConfigurationSchema } from '@gmod/jbrowse-core/configuration'

export default (pluginManager: PluginManager) => {
  const { types } = pluginManager.lib['mobx-state-tree']
  return types.late(() =>
    ConfigurationSchema(
      'BamAdapter',
      {
        bamLocation: {
          type: 'fileLocation',
          defaultValue: { uri: '/path/to/my.bam' },
        },
        index: ConfigurationSchema('BamIndex', {
          indexType: {
            model: types.enumeration('IndexType', ['BAI', 'CSI']),
            type: 'stringEnum',
            defaultValue: 'BAI',
          },
          location: {
            type: 'fileLocation',
            defaultValue: { uri: '/path/to/my.bam.bai' },
          },
        }),
        chunkSizeLimit: {
          type: 'number',
          defaultValue: 100000000,
        },
        fetchSizeLimit: {
          type: 'number',
          defaultValue: 500000000,
        },

        sequenceAdapter: pluginManager.pluggableConfigSchemaType('adapter'),
      },
      { explicitlyTyped: true },
    ),
  )
}
