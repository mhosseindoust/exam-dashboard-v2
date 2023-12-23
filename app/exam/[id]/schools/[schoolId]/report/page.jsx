import React from 'react'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import ReportSection from '@/exam/[id]/schools/[schoolId]/report/ReportSection'

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
    let errorMessage = 'Failed to fetch data'
    try {
      // Attempt to parse error text from the response
      const errorText = await res.text()
      errorMessage = errorText || errorMessage
    } catch (error) {
      // If parsing fails, use the default error message
    }

    throw new Error(errorMessage)
  }
  return res.json()
}

async function Page({ params }) {
  const reports = await getExamReport(params.id, params.schoolId)

  return (
    <div>
      {reports.map((data) => (
        <ReportSection data={data} />
      ))}
    </div>
  )
}

export default Page
