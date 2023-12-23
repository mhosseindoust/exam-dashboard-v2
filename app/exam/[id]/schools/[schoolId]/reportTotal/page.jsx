import React from 'react'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import ReportSection from '@/exam/[id]/schools/[schoolId]/reportTotal/ReportSection'

async function getExamReport(id, schoolId) {
  const cookie = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exam/${id}/schools/${schoolId}/report/total/`, {
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

async function getSchool(id) {
  const cookie = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/schools/${id}`, {
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
  const reports = await getExamReport(params.id, params.schoolId)
  const exam = await getExam(params.id)
  const school = await getSchool(params.schoolId)

  const ITEMS_PER_PAGE = 15

  const chunkItems = (items, chunkSize) => {
    let result = []
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize))
    }
    return result
  }

  // Splitting the items into chunks of 15
  const chunks = chunkItems(reports, ITEMS_PER_PAGE)

  return (
    <div>
      {chunks.map((group, index) => (
        <ReportSection key={index} index={index} group={group} school={school} exam={exam} />
      ))}
    </div>
  )
}

export default Page
