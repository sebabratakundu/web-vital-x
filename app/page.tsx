'use client'

import { useActionState, useMemo, useReducer, useState } from 'react'
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
  StatusType,
} from '@/types'
import { Search } from 'lucide-react'
import { getPageInsights } from '@/actions/crux'
import { Sort } from '@/components/Sort'

type PageInsightsForm = {
  url: string
  formFactor: FormFactorType
}

type FormAction = Partial<PageInsightsForm>

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

const deviceOptions = Object.values(FormFactor)

export default function Home() {
  const [result, actionState, isPending] = useActionState<
    [Metric[] | null, Error | null],
    FormData
  >(getPageInsights, [null, null])
  const [data, error] = result
  const [selectedMetrics, setSelectedMetrics] = useState<Metric['name'][]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState<string>('')
  const [form, dispatch] = useReducer(formReducer, {
    url: '',
    formFactor: FormFactor.DESKTOP,
  })

  const handleSubmit = (formData: FormData) => {
    actionState(formData)
  }

  const matricFilterOptions = useMemo(
    () =>
      data?.map((metric) => ({
        value: metric.name,
        label: metric.name,
      })) || [],
    [data]
  )

  const filteredData = useMemo(() => {
    if (!data) {
      return []
    }

    let matrics = data.filter(
      (metric) =>
        (selectedMetrics.length === 0 ||
          selectedMetrics.includes(metric.name)) &&
        (selectedStatus.length === 0 || selectedStatus.includes(metric.status))
    )

    if (selectedSort) {
      matrics = matrics.toSorted((a, b) => {
        if (a.status === selectedSort && b.status !== selectedSort) {
          return -1
        }

        if (a.status !== selectedSort && b.status === selectedSort) {
          return 1
        }

        return StatusWeightRank[a.status] - StatusWeightRank[b.status]
      })
    }

    return matrics
  }, [data, selectedMetrics, selectedStatus, selectedSort])

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Web Vitals Report
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter a URL to get the latest Core Web Vitals report from the Chrome
            UX Report (CrUX).
          </p>
        </header>

        <form
          action={handleSubmit}
          className="flex flex-col w-full space-y-4 mb-8"
        >
          <div className="flex items-center space-x-2">
            <Input type="hidden" name="formFactor" value={form.formFactor} />
            <Input
              type="url"
              name="url"
              placeholder="https://example.com"
              required
              value={form.url}
              onChange={(e) => dispatch({ url: e.target.value })}
              className="flex-1"
              disabled={isPending}
            />
            <Button disabled={isPending}>
              {isPending ? (
                'Loading...'
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          <div className="flex justify-center items-center space-x-2">
            {deviceOptions.map((device) => (
              <Button
                key={device}
                onClick={() => dispatch({ formFactor: device })}
                variant={form.formFactor === device ? 'default' : 'outline'}
                disabled={isPending}
              >
                <span className="capitalize">{device.toLowerCase()}</span>
              </Button>
            ))}
          </div>
        </form>

        {error && <p className="text-red-500 text-center">{error.message}</p>}

        <div className="space-y-4">
          <div className="flex md:flex-row flex-col md:justify-between md:items-center items-start md:space-x-2 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-center">Filters</p>
              <Filter
                title="Metrics"
                options={matricFilterOptions}
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
          <DataTable metrics={filteredData} />
        </div>
      </div>
    </main>
  )
}
