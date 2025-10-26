'use server'

import { apiClient } from '@/services/apiClient'
import { transformPageInsights } from '@/lib/helpers'
import { PageInsightsResponse } from '@/types'
import { AllowedMetrics, Metric, CollectionPeriod } from '@/types'
import { getValidUrls, getValidFormFactor } from '@/lib/helpers'

const apiKey = process.env.GOOGLE_CRUX_API_KEY
const cruxEndpoint = process.env.GOOGLE_CRUX_API_ENDPOINT

export const getPageInsights = async (
  prevState: {
    [key: string]: [
      { metrics: Metric[]; collectionPeriod: CollectionPeriod } | null,
      { message: string } | null,
    ]
  },
  formData: FormData
): Promise<{
  [key: string]: [
    { metrics: Metric[]; collectionPeriod: CollectionPeriod } | null,
    { message: string } | null,
  ]
}> => {
  if (!apiKey || !cruxEndpoint) {
    throw new Error('Google CrUX API key or endpoint not found')
  }

  const cruxEndpointUrl = new URL(cruxEndpoint)
  cruxEndpointUrl.searchParams.set('key', apiKey)

  const urls = getValidUrls(formData.get('urls') as string)
  const formFactor = getValidFormFactor(formData.get('formFactor') as string)

  if (urls.length === 0 || !formFactor) {
    return {
      'Invalid form data': [null, { message: 'Invalid form data' }],
    }
  }

  const requests = urls.map((url) =>
    apiClient.post<PageInsightsResponse>(
      cruxEndpointUrl.toString(),
      {
        origin: url,
        formFactor,
        metrics: Object.values(AllowedMetrics).map((metric) => metric.value),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Referer: 'http://localhost:3000',
        },
      }
    )
  )

  const response = await Promise.allSettled(requests)

  const results = response.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value
    }
    return null
  })

  const pageInsights = results.reduce(
    (acc, result, index) => {
      const url = urls[index]
      if (result === null || result[0] === null) {
        acc[url] = [
          null,
          { message: 'No result received from Google CrUX API' },
        ]
      } else {
        const [metrics, error] = result
        if (error) {
          acc[url] = [null, { message: error.message }]
        } else if (metrics && metrics.record) {
          acc[url] = [transformPageInsights(metrics.record), null]
        } else {
          acc[url] = [null, { message: 'No metrics found in response' }]
        }
      }
      return acc
    },
    {} as {
      [key: string]: [
        { metrics: Metric[]; collectionPeriod: CollectionPeriod } | null,
        { message: string } | null,
      ]
    }
  )

  return pageInsights
}
