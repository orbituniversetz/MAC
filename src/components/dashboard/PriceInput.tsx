
'use client'

import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

interface PriceInputProps {
  name?: string
  placeholder?: string
  className?: string
  required?: boolean
  defaultValue?: string | number
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void
}

export function PriceInput({ name, placeholder, className, required, defaultValue, value: controlledValue, onChange, onValueChange }: PriceInputProps) {
  const format = (num: string | number) => {
    if (num === '' || num === undefined || num === null) return ''
    const str = num.toString().replace(/,/g, '')
    const parts = str.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  const [internalValue, setInternalValue] = useState('')

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(format(controlledValue))
    } else if (defaultValue !== undefined) {
      setInternalValue(format(defaultValue))
    }
  }, [defaultValue, controlledValue])

  const displayValue = controlledValue !== undefined ? format(controlledValue) : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '')
    if (/^\d*\.?\d*$/.test(rawValue)) {
      setInternalValue(format(rawValue))
      if (onChange) {
        onChange(e)
      }
      if (onValueChange) {
        onValueChange(rawValue)
      }
    }
  }

  return (
    <Input
      type="text"
      name={name}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      autoComplete="off"
    />
  )
}
