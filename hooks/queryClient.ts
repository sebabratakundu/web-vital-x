import { useState, useEffect } from 'react'
import { apiClient } from '../services/apiClient'

/**
 * A custom hook to fetch data using the apiClient.
 * It manages loading and error states and returns them along with the data.
 * @param {string} url The URL to fetch data from.
 * @param {RequestInit} [options] Optional request options.
 * @returns {[T | null, boolean, Error | null]} A tuple containing data, loading state, and error state.
 */
export function useQuery<T>(
  url: string,
  options?: RequestInit
): [T | null, boolean, Error | null] {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const method = (options?.method?.toLowerCase() ||
    'get') as keyof typeof apiClient

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError(null)
      const [result, err] = await apiClient[method]<T>(url, options)

      if (err) {
        setError(err)
        setData(null)
      } else {
        setData(result)
      }

      setLoading(false)
    })()
  }, [url, options]) // Re-run the effect if the URL or options change

  return [data, loading, error]
}
