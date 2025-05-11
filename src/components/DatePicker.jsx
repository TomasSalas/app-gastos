import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Selecciona una fecha',
  error = false,
  className = '',
  selectedClassName = '',
  hoverClassName = '',
  rangeClassName = '',
  range = false,
  onRangeChange = () => {},
  name = '',
  onBlur = () => {},
  onDateChange = null,
}) => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [inputValue, setInputValue] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)

  const inputRef = useRef(null)
  const calendarRef = useRef(null)
  const wrapperRef = useRef(null)

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatISO = (date) => {
    return date.toISOString().split('T')[0]
  }

  const parseInputToDate = (input) => {
    const [day, month, year] = input.split('/').map(Number)
    const date = new Date(year, month - 1, day)
    return isNaN(date.getTime()) ? null : date
  }

  const updateInputValue = (start, end) => {
    if (range && start && end) {
      setInputValue(`${formatDate(start)} - ${formatDate(end)}`)
    } else if (!range && start) {
      setInputValue(formatDate(start))
    } else {
      setInputValue('')
    }
  }

  const createDetailedEvent = (value, dateObj) => {
    return {
      target: {
        name,
        value,
        dateDetails: dateObj,
      },
      dateObj,
    }
  }

  const handleDateSelect = (e, day) => {
    e.preventDefault()
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    if (range) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(selected)
        setRangeEnd(null)
      } else if (rangeStart && !rangeEnd) {
        const start = selected < rangeStart ? selected : rangeStart
        const end = selected < rangeStart ? rangeStart : selected
        setRangeStart(start)
        setRangeEnd(end)
        updateInputValue(start, end)

        const formattedValue = `${formatISO(start)} to ${formatISO(end)}`
        onRangeChange(formatISO(start), formatISO(end))

        if (typeof onChange === 'function') {
          onChange(formattedValue) // Pass raw value for RHF
        }

        if (typeof onDateChange === 'function') {
          const detailedEvent = createDetailedEvent(formattedValue, {
            start,
            end,
            formatted: {
              start: formatISO(start),
              end: formatISO(end),
            },
            isComplete: true,
            displayValue: `${formatDate(start)} - ${formatDate(end)}`,
          })
          onDateChange(detailedEvent)
        }

        setShowCalendar(false)
        onBlur()
      }
    } else {
      setSelectedDate(selected)
      setInputValue(formatDate(selected))

      const formattedValue = formatISO(selected)

      if (typeof onChange === 'function') {
        onChange(formattedValue) // Pass raw value for RHF
      }

      if (typeof onDateChange === 'function') {
        const detailedEvent = createDetailedEvent(formattedValue, {
          date: selected,
          formatted: formattedValue,
          isComplete: true,
          displayValue: formatDate(selected),
        })
        onDateChange(detailedEvent)
      }

      setCurrentMonth(selected)
      setShowCalendar(false)
      onBlur()
    }
  }

  const handleMonthChange = (offset, isCtrlPressed = false) => {
    const newDate = new Date(currentMonth)
    const delta = isCtrlPressed ? offset * 12 : offset
    newDate.setMonth(currentMonth.getMonth() + delta)
    setCurrentMonth(newDate)
  }

  const handleInputChange = (e) => {
    e.preventDefault()
    let val = e.target.value.replace(/[^\d]/g, '')
    if (val.length >= 3 && val.length <= 4) {
      val = val.slice(0, 2) + '/' + val.slice(2)
    } else if (val.length >= 5) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4, 8)
    }
    setInputValue(val)
    if (val.length === 10) {
      const date = parseInputToDate(val)
      if (date) {
        setCurrentMonth(date)
        setSelectedDate(date)

        const formattedValue = formatISO(date)

        if (typeof onChange === 'function') {
          onChange(formattedValue) // Pass raw value for RHF
        }

        if (typeof onDateChange === 'function') {
          const detailedEvent = createDetailedEvent(formattedValue, {
            date,
            formatted: formattedValue,
            isComplete: true,
            displayValue: formatDate(date),
            inputMethod: 'manual',
          })
          onDateChange(detailedEvent)
        }
      }
    }
  }

  const generateCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startDay = new Date(year, month, 1).getDay()
    const today = new Date()

    return (
      <div
        ref={calendarRef}
        className='absolute left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 z-50 w-[300px] max-w-full'
        style={{ width: '300px' }}
      >
        <div className='flex justify-between items-center mb-3 px-1'>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleMonthChange(-1, e.ctrlKey)
            }}
            className='text-sm p-1.5 hover:bg-gray-100 rounded-full transition-colors'
            title='Ctrl + click para cambiar de año'
          >
            <ChevronLeft size={18} className='text-gray-600' />
          </button>
          <div className='font-semibold text-center'>
            {months[month]} {year}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleMonthChange(1, e.ctrlKey)
            }}
            className='text-sm p-1.5 hover:bg-gray-100 rounded-full transition-colors'
            title='Ctrl + click para cambiar de año'
          >
            <ChevronRight size={18} className='text-gray-600' />
          </button>
        </div>
        <div className='grid grid-cols-7 text-xs text-center font-medium text-gray-500 mb-1'>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
            <div key={d} className='py-1'>
              {d}
            </div>
          ))}
        </div>
        <div className='grid grid-cols-7 gap-1 text-sm'>
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const current = new Date(year, month, day)

            const isToday = current.toDateString() === today.toDateString()
            const isSelected = !range && selectedDate && current.toDateString() === selectedDate.toDateString()
            const isInRange = rangeStart && rangeEnd && current >= rangeStart && current <= rangeEnd
            const isStart = rangeStart && current.toDateString() === rangeStart.toDateString()
            const isEnd = rangeEnd && current.toDateString() === rangeEnd.toDateString()

            const baseClass = 'w-full h-8 flex items-center justify-center rounded-md text-sm transition-colors'
            const highlight = isSelected
              ? `${selectedClassName || 'bg-emerald-500 text-white font-medium'}`
              : isStart || isEnd
                ? `${selectedClassName || 'bg-emerald-500 text-white font-medium'}`
                : isInRange
                  ? `${rangeClassName || 'bg-emerald-100 text-emerald-900'}`
                  : isToday
                    ? 'bg-gray-200 text-gray-900 font-medium'
                    : ''

            return (
              <button
                key={day}
                className={`${baseClass} ${highlight} ${hoverClassName || 'hover:bg-emerald-100'}`}
                onClick={(e) => handleDateSelect(e, day)}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (value) {
      try {
        if (range && typeof value === 'string' && value.includes('to')) {
          const [startStr, endStr] = value.split(' to ')
          if (startStr && endStr) {
            const start = new Date(startStr)
            const end = new Date(endStr)
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              setRangeStart(start)
              setRangeEnd(end)
              updateInputValue(start, end)
              setCurrentMonth(start)
            }
          }
        } else if (!range) {
          const parsedDate = new Date(value)
          if (!isNaN(parsedDate.getTime())) {
            setCurrentMonth(parsedDate)
            setSelectedDate(parsedDate)
            updateInputValue(parsedDate)
          }
        }
      } catch (e) {
        console.error('Invalid date format:', value)
      }
    }
  }, [value, range])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setShowCalendar(false)
        onBlur()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div
        className={`flex items-center border rounded-md px-3 py-2 bg-white transition-colors ${
          error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus-within:border-emerald-500'
        }`}
      >
        <Calendar className='w-4 h-4 text-gray-500 mr-2 flex-shrink-0' />
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          onClick={() => setShowCalendar(!showCalendar)}
          onBlur={onBlur}
          name={name}
          className='w-full outline-none text-sm text-gray-900 placeholder:text-gray-400 h-[24px]'
        />
      </div>
      <div className='h-[4px] my-[0.5px] ml-2'>
        <p className='text-xs text-red-600'>{error ? 'Este campo es obligatorio' : ' '}</p>
      </div>
      {showCalendar && generateCalendar()}
    </div>
  )
}
