import { ActionDispatch } from 'react'
import { FormAction, FormFactor, PageInsightsForm } from '@/types'
import { Button } from './ui/button'

const deviceOptions = Object.values(FormFactor)

export const DeviceFilter = ({
  form,
  dispatch,
  isPending,
}: {
  form: PageInsightsForm
  dispatch: ActionDispatch<[action: FormAction]>
  isPending: boolean
}) =>
  deviceOptions.map((device) => (
    <Button
      key={device}
      onClick={() => dispatch({ formFactor: device })}
      variant={form.formFactor === device ? 'default' : 'outline'}
      disabled={isPending}
    >
      <span className="capitalize">{device.toLowerCase()}</span>
    </Button>
  ))
