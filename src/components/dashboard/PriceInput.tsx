'use client'

import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

interface PriceInputProps {
  name: string
  placeholder?: string
  className?: string
  required?: boolean
  defaultValue?: string | number
}

export function PriceInput({ name, placeholder, className, required, defaultValue }: PriceInputProps) {
  const format = (num: string | number) => {
    if (num === '' || num === undefined || num === null) return ''
    const str = num.toString().replace(/,/g, '')
    const parts = str.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  const [value, setValue] = useState('')

  // Sync internal state when defaultValue changes (e.g. from Quick Pick)
  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(format(defaultValue))
    }
  }, [defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '')
    // Allow digits and at most one decimal point
    if (/^\d*\.?\d*$/.test(rawValue)) {
      setValue(format(rawValue))
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
