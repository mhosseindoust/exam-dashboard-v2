import React from 'react'
import PageHead from '@/components/PageHead'
import PageBody from '@/components/PageBody'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import SectionBuilder from '@/components/SectionBuilder'
import UserScore from '@/exam/[id]/users/[userId]/UserScore'
import UserAnswer from '@/exam/[id]/users/[userId]/UserAnswer'
import UserScan from '@/exam/[id]/users/[userId]/UserScan'
import UserInfo from '@/exam/[id]/users/[userId]/UserInfo'

async function getExamUser(examId, userId) {
  const cookie = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exam/${examId}/users/${userId}/`, {
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
  const examUser = await getExamUser(params.id, params.userId)
  return (
    <div>
      <PageHead
        title={`${examUser.user.first_name} ${examUser.user.last_name} -  ${examUser.exam.title}`}
        breadcrumbList={[
          { title: 'آزمون ها', path: '/exam' },
          { title: examUser.exam.title, path: `/exam/${examUser.exam.id}` },
          { title: 'دانش آموزان', path: `/exam/${examUser.exam.id}/users` },
          {
            title: `${examUser.user.first_name} ${examUser.user.last_name}`,
          },
        ]}
      />

      <PageBody withoutLayout>
        <UserInfo examUser={examUser} />
        <UserScan examId={examUser.exam.id} userId={examUser.user.id} />
        <UserScore examId={examUser.exam.id} userId={examUser.user.id} />
        <UserAnswer examId={examUser.exam.id} userId={examUser.user.id} />
      </PageBody>
    </div>
  )
}

export default Page
