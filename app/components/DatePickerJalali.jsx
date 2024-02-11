'use client'

import DatePicker from 'react-multi-date-picker'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import DateObject from 'react-date-object'
import { Form, theme } from 'antd'
import { useState } from 'react'

export const DateTimePickerJalali = ({ onChange, value }) => {
  const { status } = Form.Item.useStatus()
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const getBorderColor = () => {
    if (status === 'error') {
      return token.colorError
    }
    if (focused) {
      return token.colorPrimary
    }
    if (hovered) {
      return token.colorPrimaryBorderHover
    }
    return token.colorBorder
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <DatePicker
        containerClassName='w-full'
        onChange={(e) => {
          onChange(e.unix * 1000)
        }}
        value={value}
        format='DD/MM/YYYY HH:mm:ss'
        calendar={persian}
        locale={persian_fa}
        plugins={[<TimePicker position='bottom' />]}
        style={{
          height: `${token.controlHeight}px`,
          borderRadius: `${token.borderRadius}px`,
          paddingInline: `${token.controlPaddingHorizontal}px`,
          borderColor: getBorderColor(),
          // borderColor: focused ? token.colorPrimaryBorderHover : hovered ? token.colorPrimaryBorderHover : token.colorBorder,
          // borderColor: focused ? token.Input.hoverBorderColor : hovered ? token.Input.hoverBorderColor : token.colorBorder,
          // boxShadow: focused ? '0 0 0 2px rgba(125, 5, 255, 0.1)' : 'none',
          width: '100%',
        }}
      />
    </div>
  )
}

export const DatePickerJalali = ({ value, onChange }) => {
  const { status, errors } = Form.Item.useStatus()
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const convertGregorianToPersian = (gregorianDate) => {
    return new DateObject({
      date: gregorianDate, // Gregorian date string
      calendar: gregorian,
      locale: gregorian_en,
    })
      .convert(persian, persian_fa)
      .format('YYYY-MM-DD')
  }

  const handleDateChange = (date) => {
    setHovered(false)
    setFocused(false)
    const convertedDate = new DateObject({
      date: date,
      calendar: persian,
      locale: persian_fa,
    })
      .convert(gregorian, gregorian_en)
      .format('YYYY-MM-DD')

    onChange(convertedDate)
  }

  const getBorderColor = () => {
    if (status === 'error') {
      return token.colorError
    }
    if (focused) {
      return token.colorPrimary
    }
    if (hovered) {
      return token.colorPrimaryBorderHover
    }
    return token.colorBorder
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        onChange={handleDateChange}
        value={value ? convertGregorianToPersian(value) : null}
        containerClassName='w-full'
        style={{
          height: `${token.controlHeight}px`,
          borderRadius: `${token.borderRadius}px`,
          paddingInline: `${token.controlPaddingHorizontal}px`,
          borderColor: getBorderColor(),
          // borderColor: focused ? token.colorPrimaryBorderHover : hovered ? token.colorPrimaryBorderHover : token.colorBorder,
          // borderColor: focused ? token.Input.hoverBorderColor : hovered ? token.Input.hoverBorderColor : token.colorBorder,
          // boxShadow: focused ? '0 0 0 2px rgba(125, 5, 255, 0.1)' : 'none',
          width: '100%',
        }}
      />
    </div>
  )
}
