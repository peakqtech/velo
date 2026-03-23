import { z } from 'zod'

const ChannelCadence = z.object({
  max: z.number().int().positive(),
  period: z.enum(['week', 'month']),
})

export const CadenceSchema = z.record(
  z.enum(['blog', 'gbp', 'social', 'email']),
  ChannelCadence,
)

export type Cadence = z.infer<typeof CadenceSchema>
export type ChannelCadenceConfig = z.infer<typeof ChannelCadence>
