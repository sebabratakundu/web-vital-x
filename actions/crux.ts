'use server'

import { apiClient } from '@/services/apiClient'
import { transformPageInsights } from '@/lib/helpers'
import { PageInsightsResponse } from '@/types'
import { AllowedMetrics, Metric } from '@/types'

const apiKey = process.env.GOOGLE_CRUX_API_KEY
const cruxEndpoint = process.env.GOOGLE_CRUX_API_ENDPOINT

export const getPageInsights = async (
  prevState: [Metric[] | null, Error | null],
  formData: FormData
): Promise<[Metric[] | null, Error | null]> => {
  if (!apiKey || !cruxEndpoint) {
    throw new Error('Google CrUX API key or endpoint not found')
  }

  const cruxEndpointUrl = new URL(cruxEndpoint)
  cruxEndpointUrl.searchParams.set('key', apiKey)

  const [result, error] = await apiClient.post<PageInsightsResponse>(
    cruxEndpointUrl.toString(),
    {
      origin: formData.get('url') as string,
      formFactor: formData.get('formFactor'),
      metrics: Object.values(AllowedMetrics).map((metric) => metric.name),
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: 'http://localhost:3000',
      },
    }
  )

  if (error) {
    return [null, error]
  }

  if (!result) {
    return [null, new Error('No result received from Google CrUX API')]
  }

  return [transformPageInsights(result.record), null]
}
