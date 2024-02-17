'use client'
import { Button, Checkbox, Col, InputNumber, Row, Select, Typography } from 'antd'
import { useEffect, useState } from 'react'
import _ from 'lodash'

const { Title, Text } = Typography

const ToolsSection = ({ agencyList, setAgencySelect, headers, setSyncTimesSelect, setMargins, margins, syncTimesSelect }) => {
  const handleMarginChange = (value, type) => {
    setMargins((prev) => ({ ...prev, [type]: value }))
  }

  const syncTimeOptions = _.chain(headers)
    .groupBy((header) => new Date(header.created_at).toLocaleDateString())
    .map((value, key) => ({
      label: `${new Date(key).toLocaleDateString('fa-IR')} (${value.length})`,
      value: key,
    }))
    .value()

  useEffect(() => {
    if (syncTimeOptions.length === 1) {
      setSyncTimesSelect([syncTimeOptions[0].value])
    }
  }, [syncTimeOptions])

  return (
    <div style={{ padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px' }}>
      <Button type='primary' block onClick={() => window.print()} style={{ marginBottom: '20px' }}>
        چاپ
      </Button>
      <Select
        style={{ width: '100%', marginBottom: '20px' }}
        options={agencyList}
        placeholder='انتخاب نمایندگی'
        fieldNames={{ label: 'name', value: 'id' }}
        onChange={(e) => setAgencySelect(e)}
      />

      <Title level={5}>تنظیمات حاشیه</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Text>بالا</Text>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            value={margins.top}
            onChange={(value) => handleMarginChange(value, 'top')}
          />
        </Col>
        <Col span={6}>
          <Text>راست</Text>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            value={margins.right}
            onChange={(value) => handleMarginChange(value, 'right')}
          />
        </Col>
        <Col span={6}>
          <Text>پایین</Text>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            value={margins.bottom}
            onChange={(value) => handleMarginChange(value, 'bottom')}
          />
        </Col>
        <Col span={6}>
          <Text>چپ</Text>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            value={margins.left}
            onChange={(value) => handleMarginChange(value, 'left')}
          />
        </Col>
      </Row>
      <div style={{ marginTop: '20px' }}>
        <Title level={5}>فیلتر تاریخ همگام سازی:</Title>
        <Checkbox.Group
          options={syncTimeOptions}
          style={{ width: '100%' }}
          value={syncTimesSelect}
          onChange={(e) => setSyncTimesSelect(e)}
        />
      </div>
    </div>
  )
}

export default ToolsSection
