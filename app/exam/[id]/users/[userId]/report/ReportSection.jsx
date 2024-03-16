'use client'

import React from 'react'
import { Table, Typography, Card, Row, Col, Tag } from 'antd'
import SectionBuilder from '@/components/SectionBuilder'
const { Title } = Typography

const PerformanceReviewTable = ({ questions }) => (
  <Table
    dataSource={questions}
    size='small'
    pagination={false}
    columns={[
      { title: 'شماره سوال', dataIndex: 'question_number' },
      { title: 'موضوع', dataIndex: 'topic_title' },
      { title: 'وضعیت', dataIndex: 'status_title' },
    ]}
  />
)

const SubjectStatusTable = ({ topics }) => (
  <Table
    dataSource={topics}
    size='small'
    pagination={false}
    columns={[
      { title: 'موضوع', dataIndex: 'topic_title' },
      { title: 'وضعیت', dataIndex: 'status_title' },
    ]}
  />
)

const StatusTags = ({ item }) => (
  <div className='flex items-center gap-4'>
    <Tag color='blue'>{`وضعیت: ${item.lesson.status_title}`}</Tag>
    <Tag color='green'>{`وضعیت کلاس: ${item.lesson.status_classroom_title}`}</Tag>
    <Tag color='cyan'>{`وضعیت مدرسه: ${item.lesson.status_school_title}`}</Tag>
  </div>
)

const ReportSection = ({ report, item }) => {
  return (
    <SectionBuilder
      className='mb-5 space-y-4'
      key={item.exam_user_score_id}
      title={`${item.lesson.title} (${new Date(report.exam.start_date_time).toLocaleDateString('fa-IR')})`}
    >
      <Card className='mb-4'>
        <StatusTags item={item} />
      </Card>

      <Row gutter={24}>
        <Col span={12}>
          <Card title='بررسی عملکرد دانش آموز در هر سوال'>
            <PerformanceReviewTable questions={item.questions} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='بررسی وضعیت دانش آموز در موضوعات درسی'>
            <SubjectStatusTable topics={item.topics} />
          </Card>
        </Col>
      </Row>
    </SectionBuilder>
  )
}

export default ReportSection
