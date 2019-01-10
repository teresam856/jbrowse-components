import { ConfigurationSchema } from '../../configuration'
import { BaseTrackConfig as LinearGenomeTrackConfig } from '../LinearGenomeView/models'

export default pluginManager => {
  const SequenceRendererConfigSchema = pluginManager.getRendererType(
    'DivSequenceRenderer',
  ).configSchema

  return ConfigurationSchema(
    'SequenceTrack',
    {
      adapter: pluginManager.pluggableConfigSchemaType('adapter'),
      defaultRendering: {
        type: 'string',
        defaultValue: 'div',
      },
      category: {
        type: 'stringArray',
        defaultValue: [],
      },

      renderers: ConfigurationSchema('RenderersConfiguration', {
        PileupRenderer: SequenceRendererConfigSchema,
      }),
    },
    { baseConfiguration: LinearGenomeTrackConfig, explicitlyTyped: true },
  )
}
