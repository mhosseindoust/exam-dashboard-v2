'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button, Result } from 'antd'

export default function Error({ error, reset }) {
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.log(error)
  // }, [error])

  return (
    <div>
      <Result
        status='500'
        title='500'
        subTitle={error.message}
        extra={
          <Button type='primary' onClick={() => reset()}>
            تلاش مجدد
          </Button>
        }
      />
    </div>
  )
}
