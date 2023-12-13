import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Card, Modal, Spin } from 'antd'
import { useRouter } from 'next/navigation'

const LessonsModal = ({ exam, setExam }) => {
  const { data, isLoading, error } = useSWR(`/exam/${exam.id}/lessons`)
  // const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  // useEffect(() => {
  //   if (exam.id) {
  //     setIsModalOpen(true)
  //   }
  // }, [exam.id])

  if (isLoading)
    return (
      <Modal title='درس های آزمون' open footer={null} onCancel={() => setExam(null)}>
        <div className='text-center my-5'>
          <Spin spinning />
        </div>
      </Modal>
    )

  if (error) {
    return (
      <Modal title='درس های آزمون' open footer={null} onCancel={() => setExam(null)}>
        <div className='text-center my-5'>
          <div className='text-red-500'>خطا در دریافت اطلاعات</div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title='درس های آزمون' open footer={null} onCancel={() => setExam(null)} width={1000}>
      <div className='grid grid-cols-3 gap-3'>
        {data?.map((item) => (
          <Card
            key={item.id}
            title={`${item.lesson.title} (${item.lesson.id})`}
            hoverable
            onClick={() => router.push(`/exam/${exam.id}/lesson/${item.id}/correction`)}
          >
            {/*<div>ss</div>*/}
          </Card>
        ))}
      </div>
    </Modal>
  )
}

export default LessonsModal
