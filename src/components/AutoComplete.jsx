import { ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const Autocomplete = ({
  value,
  onChange,
  options,
  placeholder = 'Escribe algo...',
  noOptionsText = 'No hay opciones disponibles',
  className = '',
  selectedClassName = '',
  hoverClassName = '',
  multiSelect = false,
  isClearable = false,
  error = false,
  name = '',
  onBlur = () => {},
}) => {
  const [inputValue, setInputValue] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options || [])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState(
    multiSelect ? (Array.isArray(value) ? value : []) : value ? [value] : []
  )
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Actualizar filteredOptions cuando cambian las opciones
  useEffect(() => {
    setFilteredOptions(options || [])
  }, [options])

  // Inicializar selectedOptions e inputValue con la prop value
  useEffect(() => {
    if (multiSelect) {
      setSelectedOptions(Array.isArray(value) ? value : [])
    } else {
      if (value) {
        setSelectedOptions([value])
        setInputValue(value.label || value.value || '') // Mostrar el label o value
      } else {
        setSelectedOptions([])
        setInputValue('')
      }
    }
  }, [value, multiSelect])

  // Manejar clics fuera del componente para cerrar el dropdown
  useEffect(() => {
    function handleClickOutside (event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false)
        onBlur()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setFilteredOptions(
      value.trim() === ''
        ? options || []
        : (options || []).filter((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          )
    )
    setShowDropdown(true)
  }

  const handleSelectOption = (option) => {
    if (multiSelect) {
      const isAlreadySelected = selectedOptions.some(
        (selected) => selected.value === option.value
      )
      let newSelection
      if (isAlreadySelected) {
        newSelection = selectedOptions.filter(
          (selected) => selected.value !== option.value
        )
      } else {
        newSelection = [...selectedOptions, option]
      }
      setSelectedOptions(newSelection)
      if (typeof onChange === 'function') {
        onChange(newSelection)
      }
    } else {
      setInputValue(option.label || option.value)
      setSelectedOptions([option])
      setShowDropdown(false)
      if (typeof onChange === 'function') {
        onChange(option)
      }
    }
  }

  const handleRemoveOption = (option, e) => {
    e.stopPropagation()
    const newSelection = selectedOptions.filter(
      (selected) => selected.value !== option.value
    )
    setSelectedOptions(newSelection)
    if (typeof onChange === 'function') {
      onChange(multiSelect ? newSelection : null)
    }
    inputRef.current.focus()
    if (!multiSelect) setInputValue('')
  }

  const handleClear = () => {
    setSelectedOptions([])
    setInputValue('')
    if (typeof onChange === 'function') {
      onChange(multiSelect ? [] : null)
    }
  }

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div
        className={`relative flex items-center border rounded-lg px-2 overflow-hidden bg-white transition-all duration-200 min-h-[42px] ${
          multiSelect && selectedOptions.length > 0 ? 'h-auto' : 'h-[42px]'
        } ${
          error
            ? 'border-red-500 shadow-sm shadow-red-100'
            : 'border-gray-300 hover:border-gray-400 focus-within:border-emerald-500 focus-within:shadow-sm'
        }`}
      >
        <div className='flex flex-wrap items-center gap-2 flex-1 overflow-y-auto max-h-24 w-full py-0.5'>
          {multiSelect && selectedOptions.length > 0
            ? (
              <>
                {selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium flex-shrink-0 transition-all duration-150 shadow-sm ${
                    selectedClassName ||
                    'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                  >
                    <span className='truncate max-w-[150px]'>
                      {option.label || option.value}
                    </span>
                    <button
                      type='button'
                      onClick={(e) => handleRemoveOption(option, e)}
                      className='group flex items-center justify-center rounded-full w-4 h-4 hover:bg-emerald-200 transition-colors'
                    >
                      <X
                        className={`w-3 h-3 transition-colors ${
                        selectedClassName
                          ? 'group-hover:text-red-500'
                          : 'group-hover:text-red-500'
                      }`}
                      />
                    </button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  type='text'
                  value={inputValue}
                  onChange={handleInputChange}
                  onClick={() => setShowDropdown(true)}
                  onBlur={onBlur}
                  name={name}
                  className='flex-1 py-1 focus:ring-0 focus:outline-none min-w-[80px] text-gray-800 placeholder:text-gray-400'
                  placeholder=''
                />
              </>
              )
            : !multiSelect && selectedOptions.length > 0
                ? (
                  <div className='flex items-center w-full h-full'>
                    <span className='text-gray-800 truncate'>
                      {selectedOptions[0].label || selectedOptions[0].value}
                    </span>
                  </div>
                  )
                : (
                  <input
                    ref={inputRef}
                    type='text'
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={() => setShowDropdown(true)}
                    onBlur={onBlur}
                    name={name}
                    className='flex-1 py-1 focus:ring-0 focus:outline-none min-w-[120px] w-full text-gray-800 placeholder:text-gray-400'
                    placeholder={placeholder}
                  />
                  )}
        </div>

        <div className='flex items-center gap-1 ml-1 flex-shrink-0'>
          {isClearable && selectedOptions.length > 0 && (
            <button
              type='button'
              onClick={handleClear}
              className='p-1 rounded-full hover:bg-gray-100 transition-colors'
              title='Limpiar selección'
            >
              <X className='w-4 h-4 text-gray-500 hover:text-red-500 transition-colors' />
            </button>
          )}
          <button
            type='button'
            onClick={() => setShowDropdown(!showDropdown)}
            className='p-1 rounded-full hover:bg-gray-100 transition-colors'
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                showDropdown ? 'transform rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div className='h-[4px] my-[0.5px] ml-2'>
        <p className='text-xs text-red-600'>{error ? 'Este campo es obligatorio' : ' '}</p>
      </div>

      {showDropdown && (
        <ul className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1'>
          {filteredOptions.length > 0
            ? (
                filteredOptions.map((option) => {
                  const isSelected = selectedOptions.some(
                    (selected) => selected.value === option.value
                  )
                  return (
                    <li
                      key={option.value}
                      onClick={() => handleSelectOption(option)}
                      className={`px-4 py-2 cursor-pointer transition-colors ${
                    hoverClassName || 'hover:bg-gray-50'
                  } flex items-center justify-between ${
                    isSelected ? selectedClassName || 'text-emerald-700 bg-emerald-50' : ''
                  }`}
                    >
                      {option.label || option.value}
                      {isSelected && (
                        <span
                          className={`${
                        selectedClassName ? 'text-inherit' : 'text-emerald-600'
                      } font-medium`}
                        >
                          ✓
                        </span>
                      )}
                    </li>
                  )
                })
              )
            : (
              <li className='px-4 py-2.5 text-gray-500 text-sm'>{noOptionsText}</li>
              )}
        </ul>
      )}
    </div>
  )
}
