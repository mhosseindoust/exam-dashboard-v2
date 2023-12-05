import React from 'react'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'

function Loading(props) {
  return (
    <div>
      <PageHead title='آزمون ها' breadcrumbList={[{ title: 'آزمون ها' }]}></PageHead>
      <PageBody loading></PageBody>
    </div>
  )
}

export default Loading
