'use client'

import { useActionState, useReducer, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MetricCard from '@/components/MetricCard'
import { FormFactor, FormFactorType } from '@/actions/types'
import { Search } from 'lucide-react'
import { getPageInsights } from '@/actions/crux'
import { Metric } from '@/lib/helpers'

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

export default function Home() {
  const [result, actionState, isPending] = useActionState<
    [Metric[] | null, Error | null],
    FormData
  >(getPageInsights, [null, null])
  const [data, error] = result
  const [form, dispatch] = useReducer(formReducer, {
    url: '',
    formFactor: FormFactor.DESKTOP,
  })

  const handleSubmit = (formData: FormData) => {
    actionState(formData)
  }

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
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <Button
              onClick={() => dispatch({ formFactor: FormFactor.DESKTOP })}
              variant={
                form.formFactor === FormFactor.DESKTOP ? 'default' : 'outline'
              }
              disabled={isPending}
            >
              Desktop
            </Button>
            <Button
              onClick={() => dispatch({ formFactor: FormFactor.PHONE })}
              variant={
                form.formFactor === FormFactor.PHONE ? 'default' : 'outline'
              }
              disabled={isPending}
            >
              Phone
            </Button>
            <Button
              onClick={() => dispatch({ formFactor: FormFactor.TABLET })}
              variant={
                form.formFactor === FormFactor.TABLET ? 'default' : 'outline'
              }
              disabled={isPending}
            >
              Tablet
            </Button>
          </div>
        </form>

        {error && <p className="text-red-500 text-center">{error.message}</p>}

        {data && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Core Web Vitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
