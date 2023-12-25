import React from 'react'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import ReportSection from '@/exam/[id]/schools/[schoolId]/report/ReportSection'
import { Result } from 'antd'

async function getExamReport(id, schoolId) {
  const cookie = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exam/${id}/schools/${schoolId}/report/`, {
    credentials: 'include',
    headers: { Cookie: cookie },
  })
  if (res.status === 404) return notFound()
  if (!res.ok) {
    if (res.status === 400) {
      const errorText = await res.text()
      return { error: errorText }
    }

    throw new Error('Failed to fetch data')
  }
  return { data: res.json() }
}

async function Page({ params }) {
  const reports = await getExamReport(params.id, params.schoolId)

  if (reports.error) return <Result status='500' title='500' subTitle={reports.error} />

  return (
    <div>
      {reports.data.map((item) => (
        <ReportSection key={item.score_id} data={item} />
      ))}
    </div>
  )
}

export default Page
