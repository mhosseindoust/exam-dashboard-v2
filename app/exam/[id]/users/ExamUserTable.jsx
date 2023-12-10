'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { Input, Table } from 'antd'

const ExamUserTable = ({ examId }) => {
  const { data, isLoading } = useSWR(`/exam/${examId}/users/`)
  const [searchText, setSearchText] = useState('')

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'نام',
      dataIndex: 'first_name',
    },
    {
      title: 'نام خانوادگی',
      dataIndex: 'last_name',
    },
    {
      title: 'کد داوطلب (نام کاربری)',
      dataIndex: 'username',
    },
    {
      title: 'مقطع',
      dataIndex: ['grade', 'full_title'],
    },
    {
      title: 'نمایندگی',
      dataIndex: ['agency', 'name'],
      filters: Array.from(new Set(data?.map((item) => item.agency?.name))).map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.agency?.name === value,
    },
    {
      title: 'مدرسه',
      dataIndex: ['school', 'title'],
      filters: Array.from(new Set(data?.map((item) => item.school?.title))).map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.school?.title === value,
    },
    {
      title: 'کلاس',
      dataIndex: ['classroom', 'title'],
    },
  ]

  const filteredData = data?.filter((item) => {
    return searchText
      .toLowerCase()
      .split(' ')
      .every((term) =>
        [
          item.first_name?.toLowerCase(),
          item.last_name?.toLowerCase(),
          item.username?.toLowerCase(),
          item.agency.name?.toLowerCase(),
          item.school.title?.toLowerCase(),
        ].some((field) => field && field.includes(term)),
      )
  })

  return (
    <>
      <Input onChange={(e) => setSearchText(e.target.value)} className='mb-3' placeholder='جستجو دانش آموزان ...' />
      <Table
        columns={columns}
        dataSource={searchText ? filteredData : data}
        size='small'
        loading={isLoading}
        rowKey={(record) => record.id}
      />
    </>
  )
}

export default ExamUserTable
