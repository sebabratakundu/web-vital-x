'use client'

import { useActionState, useEffect, useMemo, useReducer, useState } from 'react'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/DataTable'
import { Filter } from '@/components/Filter'
import { Input } from '@/components/ui/input'
import {
  FormFactor,
  FormFactorType,
  Status,
  StatusWeightRank,
  Metric,
  AllowedMetrics,
  CollectionPeriod as CollectionPeriodType,
  PageInsightsForm,
  FormAction,
} from '@/types'
import { Loader2, Search } from 'lucide-react'
import { getPageInsights } from '@/actions/crux'
import { Sort } from '@/components/Sort'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { getValidFormFactor, getValidUrls } from '@/lib/helpers'

import { CollectionPeriod } from '@/components/CollectionPeriod'
import { DeviceFilter } from '@/components/DeviceFilter'

const formReducer = (
  state: PageInsightsForm,
  action: FormAction
): PageInsightsForm => {
  return {
    ...state,
    ...action,
  }
}

const statusOptions = Object.values(Status).map((status) => ({
  value: status,
  label: status,
}))

const metricOptions = Object.values(AllowedMetrics).map((metric) => ({
  value: metric.value,
  label: metric.name,
}))

export default function Home() {
  const [result, actionState, isPending] = useActionState<
    {
      [key: string]: [
        { metrics: Metric[]; collectionPeriod: CollectionPeriodType } | null,
        { message: string } | null,
      ]
    },
    FormData
  >(getPageInsights, {})

  const [selectedMetrics, setSelectedMetrics] = useState<Metric['id'][]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState<string>('')
  const [form, dispatch] = useReducer(formReducer, {
    urls: '',
    formFactor: FormFactor.DESKTOP,
  })

  const handleSubmit = (formData: FormData) => {
    const urls = getValidUrls(formData.get('urls') as string)
    const formFactor = getValidFormFactor(formData.get('formFactor') as string)

    if (urls.length === 0 || !formFactor) {
      toast.error('Invalid form data')
      return
    }

    actionState(formData)
  }

  const collectionPeriod = useMemo(() => {
    return Object.entries(result).reduce(
      (acc, [key, [metrics, error]]) => {
        if (metrics) {
          acc[key] = metrics.collectionPeriod
        }
        return acc
      },
      {} as { [key: string]: CollectionPeriodType }
    )
  }, [result])

  const errors = useMemo(
    () =>
      Object.entries(result).reduce(
        (acc, [key, [metrics, error]]) => {
          if (error) {
            acc[key] = error
          }
          return acc
        },
        {} as { [key: string]: { message: string } }
      ),
    [result]
  )

  useEffect(() => {
    if (!!errors) {
      Object.entries(errors).forEach(([key, error]) => {
        toast.error(`${key}: ${error.message}`, {
          id: key,
        })
      })
    }
  }, [errors])

  const filteredData = useMemo(() => {
    return Object.entries(result).reduce(
      (acc, [key, [metrics, error]]) => {
        if (!!metrics) {
          let filteredMetrics = metrics.metrics.filter(
            (metric) =>
              (selectedMetrics.length === 0 ||
                selectedMetrics.includes(metric.id)) &&
              (selectedStatus.length === 0 ||
                selectedStatus.includes(metric.status))
          )

          if (selectedSort) {
            filteredMetrics = filteredMetrics.toSorted((a, b) => {
              if (a.status === selectedSort && b.status !== selectedSort) {
                return -1
              }

              if (a.status !== selectedSort && b.status === selectedSort) {
                return 1
              }

              return StatusWeightRank[a.status] - StatusWeightRank[b.status]
            })
          }

          acc[key] = filteredMetrics
        }

        return acc
      },
      {} as { [key: string]: Metric[] }
    )
  }, [result, selectedMetrics, selectedStatus, selectedSort])

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className="max-w-4xl w-full mx-auto">
        <header className="text-center mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Check your Core Web Vitals
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Enter a URL to get the latest Core Web Vitals report from the Chrome
            UX Report (CrUX).
          </p>
        </header>

        <form action={handleSubmit} className="w-full space-y-4 mb-4">
          <div className="grid w-full gap-2">
            <Textarea
              name="urls"
              placeholder="https://example.com, https://google.com"
              required
              value={form.urls}
              onChange={(e) => dispatch({ urls: e.target.value })}
              className="flex-1 min-h-[100px]"
              disabled={isPending}
            />
            <Input type="hidden" name="formFactor" value={form.formFactor} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <DeviceFilter
                form={form}
                dispatch={dispatch}
                isPending={isPending}
              />
            </div>
            <Button disabled={isPending} size={'lg'}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </form>

        <CollectionPeriod collectionPeriod={collectionPeriod} />

        <div className="space-y-4">
          <div className="flex md:flex-row flex-col md:justify-between md:items-center items-start md:space-x-2 space-y-2 md:space-y-0 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <p className="text-center">Filters</p>
              <Filter
                title="Metrics"
                options={metricOptions}
                selected={selectedMetrics}
                onChange={setSelectedMetrics}
              />
              <Filter
                title="Status"
                options={statusOptions}
                selected={selectedStatus}
                onChange={setSelectedStatus}
              />
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-center">Sort by</p>
              <Sort
                title="Status"
                options={statusOptions}
                selected={selectedSort}
                onChange={setSelectedSort}
              />
            </div>
          </div>
          <DataTable insights={filteredData} />
        </div>
      </div>
    </main>
  )
}
