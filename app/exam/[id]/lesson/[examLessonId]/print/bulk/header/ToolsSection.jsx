'use client'
import { Button, Checkbox, Select } from 'antd'
import { useState } from 'react'
import _ from 'lodash'

const CheckboxGroup = Checkbox.Group

const ToolsSection = ({ agencyList, setAgencySelect, headers, setSyncTimesSelect }) => {
  return (
    <div>
      <Button type='primary' block onClick={() => window.print()}>
        چاپ
      </Button>
      <Select
        style={{ width: '100%' }}
        options={agencyList}
        placeholder='انتخاب نمایندگی'
        fieldNames={{ label: 'name', value: 'id' }}
        onChange={(e) => setAgencySelect(e)}
      />
      <div>
        <span>فیلتر تاریخ همگام سازی:</span>
        <CheckboxGroup
          options={(() => {
            const groupedObjects = _.groupBy(headers, (obj) => new Date(obj.created_at).toLocaleDateString())
            return Object.keys(groupedObjects).map((date) => ({
              value: date,
              label: new Date(date).toLocaleDateString('fa-IR') + ' (' + groupedObjects[date].length + ')',
            }))
          })()}
          style={{ display: 'grid' }}
          onChange={(e) => setSyncTimesSelect(e)}
        />
      </div>
    </div>
  )
}

export default ToolsSection
