'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { Input, Table } from 'antd'
import classnames from 'classnames'
import { useRouter } from 'next/navigation'

const ExamUserTable = ({ examId }) => {
  const { data, isLoading } = useSWR(`/exam/${examId}/users/`)
  const [searchText, setSearchText] = useState('')
  const router = useRouter()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'exam_user_id',
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
      filters: Array.from(new Set(data?.map((item) => item.school?.title)))
        .sort()
        .map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.school?.title === value,
      filterSearch: true,
    },
    {
      title: 'کلاس',
      dataIndex: ['classroom', 'title'],
    },
    {
      title: 'سوالات ',
      render: (_, { user_id, question_count, question_corrected_count, question_scanned_count }) => (
        <div className='flex items-center justify-center'>
          <div
            className={classnames('w-20 text-white text-center rounded hover:cursor-pointer select-none', {
              'bg-green-600 hover:bg-green-500 ': question_count === question_corrected_count,
              'bg-primary hover:bg-primary/80': question_count !== question_corrected_count,
            })}
            onClick={(e) => router.push(`/exam/${examId}/users/${user_id}`)}
          >
            {question_corrected_count} / {question_scanned_count}
          </div>
          <div className='mr-1'> / {question_count}</div>
        </div>
      ),
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
