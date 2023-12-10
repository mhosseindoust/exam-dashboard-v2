import { App, Form, Modal, Select } from 'antd'
import { useState } from 'react'
import useSWR from 'swr'
import callAxios from '@/helpers/callAxios'

const ExamSyncModal = ({ exam, setExam }) => {
  const { data, isLoading } = useSWR('/exam/sync/')
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [form] = Form.useForm()
  const { message } = App.useApp()

  const handleConfirm = () => {
    setLoading(true)
    callAxios
      .get(`/exam/${exam.id}/sync/${selectedId}`)
      .then((res) => {
        message.success('همگام سازی با موفقیت انجام شد')
        setExam(null)
      })
      .catch((e) => message.error(e.errorData.msg))
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal
      title={`همگام سازی آزمون ${exam?.title}`}
      open
      onOk={handleConfirm}
      onCancel={() => setExam(null)}
      confirmLoading={loading}
    >
      <Select
        loading={isLoading}
        disabled={isLoading}
        options={data}
        placeholder='انتخاب آزمون'
        fieldNames={{ label: 'title', value: 'id' }}
        onChange={(e) => setSelectedId(e)}
        className='w-full my-2'
      />
    </Modal>
  )
}

export default ExamSyncModal
