'use client'

import React from 'react'
import { Empty, Spin } from 'antd'
import { SensorAlert } from 'react-flaticons'

const SectionBuilder = ({ title, children, className, actions, loading, error, empty, rootClassName = '' }) => {
  let content
  if (loading) {
    content = <LoadingState />
  } else if (error) {
    content = <ErrorState />
  } else if (empty) {
    content = <EmptyState />
  } else {
    content = children
  }

  return (
    <section className={`${rootClassName} container`}>
      <div className='shadow-md border-solid bg-white mb-4 rounded-xl border border-gray-200 h-full px-4'>
        <div className='flex justify-between items-center'>
          <h2 className='font-extrabold text-sm my-4'>{title}</h2>
          {actions}
        </div>
        <div className={className}>{content}</div>
      </div>
    </section>
  )
}

const LoadingState = () => (
  <div className='text-center h-44 flex flex-col justify-center items-center'>
    <Spin />
  </div>
)

const ErrorState = () => (
  <div className='flex justify-center items-center h-44 flex-col text-red-600'>
    <SensorAlert className='w-12 h-44 fill-current opacity-50' />
    <p>مشکلی در لود اطلاعات بوجود آمده...</p>
  </div>
)

const EmptyState = () => (
  <div className='h-44'>
    <Empty />
  </div>
)

export default SectionBuilder
