import React from 'react'
import useSWR from 'swr'
import PageHead from '@/components/PageHead'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import PageBody from '@/components/PageBody'
import SchoolTable from '@/exam/[id]/schools/SchoolTable'

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

async function Page({ params }) {
  const examData = await getExam(params.id)

  return (
    <div>
      <PageHead
        title='مدرسه ها'
        breadcrumbList={[
          { title: 'آزمون ها', path: '/exam' },
          { title: examData.title, path: `/exam/${examData.id}` },
          { title: 'مدرسه ها' },
        ]}
      />
      <PageBody>
        <SchoolTable exam={examData} />
      </PageBody>
    </div>
  )
}

export default Page
