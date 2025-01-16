'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    if (isOpen) {
      const handler = (e: KeyboardEvent) => {
        switch (e.code) {
          case 'Enter':
          case 'Space':
            e.preventDefault()
            if (options[highlightedIndex]) {
              onChange?.(options[highlightedIndex].value)
              setIsOpen(false)
            }
            break
          case 'ArrowUp':
          case 'ArrowDown': {
            e.preventDefault()
            if (!isOpen) {
              setIsOpen(true)
              break
            }
            const newIndex = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1)
            if (newIndex >= 0 && newIndex < options.length) {
              setHighlightedIndex(newIndex)
            }
            break
          }
          case 'Escape':
            setIsOpen(false)
            break
        }
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }
  }, [isOpen, highlightedIndex, options, onChange])

  useEffect(() => {
    if (isOpen) {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('click', handler)
      return () => document.removeEventListener('click', handler)
    }
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      onBlur={() => setIsOpen(false)}
    >
      <div
        className={`flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && !disabled && (
        <ul
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-slate-900 py-1 shadow-lg"
          role="listbox"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`px-3 py-2 text-sm ${
                option.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:bg-gray-500'
              } ${highlightedIndex === index ? 'bg-gray-500' : ''} ${
                option.value === value ? 'bg-gray-40 font-medium' : ''
              }`}
              onClick={() => {
                if (!option.disabled) {
                  onChange?.(option.value)
                  setIsOpen(false)
                }
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
