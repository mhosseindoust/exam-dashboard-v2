import React from 'react'
import PageHead from '@/components/PageHead'
import { notFound } from 'next/navigation'
import { console } from 'next/dist/compiled/@edge-runtime/primitives'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Button } from 'antd'
import PageBody from '@/components/PageBody'
import ExamEditForm from '@/exam/[id]/ExamEditForm'
import EditLessons from '@/exam/[id]/EditLessons'
import QuestionList from '@/exam/[id]/QuestionList'

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
  const exam = await getExam(params.id)
  return (
    <div>
      <PageHead title={`${exam.title}`} breadcrumbList={[{ title: 'آزمون ها', path: '/exam' }, { title: exam.title }]}>
        <Link href={`/exam/${exam.id}/paper`}>
          <Button>دریافت برگه</Button>
        </Link>
      </PageHead>
      <PageBody withoutLayout>
        <ExamEditForm exam={exam} />
        <EditLessons exam={exam} />
        <QuestionList exam={exam} />
      </PageBody>
    </div>
  )
}

export default Page
