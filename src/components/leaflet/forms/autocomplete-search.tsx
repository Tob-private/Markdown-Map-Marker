'use client'

import type React from 'react'
import styles from './autocomplete-search.module.css'

import { useState, useRef, useEffect } from 'react'

interface AutocompleteOption {
  id: string
  filename: string
}

interface AutocompleteSearchProps {
  options: AutocompleteOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  name?: string
}

export function AutocompleteSearch({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  name
}: AutocompleteSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search input
  const filteredOptions = options.filter((option) =>
    option.filename.toLowerCase().includes(searchInput.toLowerCase())
  )

  // Get the display text for the selected value
  const selectedOption = options.find((opt) => opt.id === selectedValue)
  const displayText = selectedOption?.filename || ''

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update search input when dropdown opens
  const handleOpen = () => {
    setIsOpen(true)
    setSearchInput('')
    inputRef.current?.focus()
  }

  // Handle option selection
  const handleSelectOption = (option: AutocompleteOption) => {
    setSelectedValue(option.id)
    onChange?.(option.id)
    setIsOpen(false)
    setSearchInput('')
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    setIsOpen(true)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      handleSelectOption(filteredOptions[0])
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={selectedValue || ''} />}

      {/* Display/Input area */}
      <div onClick={handleOpen} className={styles.trigger}>
        <span
          className={
            selectedValue ? styles.selectedText : styles.placeholderText
          }
        >
          {displayText || placeholder}
        </span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* Search input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={styles.searchInput}
          />

          {/* Options list */}
          <ul className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className={`${styles.option} ${selectedValue === option.id ? styles.optionSelected : ''}`}
                  >
                    {option.filename.split('.md').join('')}
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.noResults}>No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
