
'use client'

import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

interface PriceInputProps {
  name: string
  placeholder?: string
  className?: string
  required?: boolean
  defaultValue?: string | number
  onValueChange?: (value: string) => void
}

export function PriceInput({ name, placeholder, className, required, defaultValue, onValueChange }: PriceInputProps) {
  const format = (num: string | number) => {
    if (num === '' || num === undefined || num === null) return ''
    const str = num.toString().replace(/,/g, '')
    const parts = str.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  const [value, setValue] = useState('')

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(format(defaultValue))
    }
  }, [defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '')
    if (/^\d*\.?\d*$/.test(rawValue)) {
      setValue(format(rawValue))
      if (onValueChange) {
        onValueChange(rawValue)
      }
    }
  }

  return (
    <Input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      autoComplete="off"
    />
  )
}
