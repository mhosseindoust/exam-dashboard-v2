import React from 'react'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Table } from 'antd'
import useSWR from 'swr'
import ExamUserTable from '@/exam/[id]/users/ExamUserTable'

async function getExam(id) {
  const cookie = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exam/${id}`, {
    credentials: 'include',
    headers: { Cookie: cookie },
  })
  if (res.status === 404) return notFound()
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

async function Page({ params: { id: examId } }) {
  const examData = await getExam(examId)

  return (
    <div>
      <PageHead
        title='دانش آموزان'
        breadcrumbList={[
          { title: 'آزمون ها', path: '/exam' },
          { title: examData.title, path: `/exam/${examData.id}` },
          { title: 'دانش آموزان' },
        ]}
      />
      <PageBody>
        <ExamUserTable examId={examId} />
      </PageBody>
    </div>
  )
}

export default Page
