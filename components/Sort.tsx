import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'

import { Check, ChevronsUpDown } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { cn } from '@/lib/utils'

type Option = {
  value: string
  label: string
}

type SortProps = {
  title: string
  options: Option[]
  selected: string
  onChange: Dispatch<SetStateAction<string>>
  className?: string
}

export const Sort = ({
  title,
  options,
  selected,
  onChange,
  className,
}: SortProps) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    onChange(value)
    setOpen(false)
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
                  <Check
                    className={cn(
                      selected === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
