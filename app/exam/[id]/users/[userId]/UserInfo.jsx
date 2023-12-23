import React from 'react'
import SectionBuilder from '@/components/SectionBuilder'

const UserInfo = ({ examUser }) => {
  return (
    <SectionBuilder title='اطلاعات' className='mb-5'>
      <div className='grid grid-cols-3 gap-3'>
        <div>
          <span>نمایندگی : </span>
          <span>{examUser.user.agency.name}</span>
        </div>
        <div>
          <span> مدرسه : </span>
          <span>{examUser.user.school.title}</span>
        </div>
        <div>
          <span>کلاس :</span>
          <span>{examUser.user.classroom.title}</span>
        </div>
      </div>
    </SectionBuilder>
  )
}

export default UserInfo
