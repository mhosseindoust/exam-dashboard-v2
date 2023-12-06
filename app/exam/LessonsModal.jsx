import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Card, Modal, Spin } from 'antd'
import { useRouter } from 'next/navigation'

const LessonsModal = ({ exam_id }) => {
  const { data, isLoading, error } = useSWR(`/exam/${exam_id}/lessons/`)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (exam_id) {
      setIsModalOpen(true)
    }
  }, [exam_id])

  if (isLoading)
    return (
      <Modal title='درس های آزمون' open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
        <div className='text-center my-5'>
          <Spin spinning />
        </div>
      </Modal>
    )

  if (error) {
    return (
      <Modal title='درس های آزمون' open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
        <div className='text-center my-5'>
          <div className='text-red-500'>خطا در دریافت اطلاعات</div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title='درس های آزمون' open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)} width={1000}>
      <div className='grid grid-cols-3 gap-3'>
        {data?.map((item) => (
          <Card
            key={item.id}
            title={`${item.lesson.title} (${item.lesson.id})`}
            hoverable
            onClick={() => router.push(`/exam/${exam_id}/lesson/${item.id}/correction`)}
          >
            {/*<div>ss</div>*/}
          </Card>
        ))}
      </div>
    </Modal>
  )
}

export default LessonsModal
