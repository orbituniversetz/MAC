'use client'

import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface PriceInputProps {
  name: string
  placeholder?: string
  className?: string
  required?: boolean
  defaultValue?: number
}

export function PriceInput({ name, placeholder, className, required, defaultValue }: PriceInputProps) {
  const format = (num: string | number) => {
    if (num === '' || num === undefined || num === null) return ''
    const str = num.toString().replace(/,/g, '')
    const parts = str.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  const [value, setValue] = useState(defaultValue ? format(defaultValue) : '')

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
