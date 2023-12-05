import React from 'react'
import { Spin } from 'antd'

function Loading(props) {
  return (
    <div className='text-center mt-52'>
      <Spin spinning />
    </div>
  )
}

export default Loading
