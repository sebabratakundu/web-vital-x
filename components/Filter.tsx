'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'

import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

export type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  title: string
  options: Option[]
  selected: string[]
  onChange: Dispatch<SetStateAction<string[]>>
  className?: string
}

export function Filter({
  title,
  options,
  selected,
  onChange,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {title}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No {title} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Checkbox
                    id={option.value}
                    checked={selected.includes(option.value)}
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
