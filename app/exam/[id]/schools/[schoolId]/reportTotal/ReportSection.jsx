'use client'
const ReportSection = ({ index, group, school, exam }) => {
  return (
    <div>
      <style jsx>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          @page {
            margin: 0;
            size: landscape;
          }
        }
      `}</style>
      <style jsx global>{`
        body {
          background-color: unset;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }

        td,
        th {
          border: 1px solid #dddddd;
          text-align: center;
          padding: 8px;
        }
      `}</style>
      <div className='mt-[0.6cm] text-black mx-[0.8cm] break-after-page'>
        <div className='flex text-[10px] justify-end space-x-[0.6cm] space-x-reverse '>
          <div className='w-[5cm]'>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>نمایندگی:</span>
              <span className='pr-[1cm]'>{school.agency_name}</span>
            </p>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>مدرسه:</span>
              <span className='pr-[1cm]'>{school.title}</span>
            </p>
          </div>
          <div className='w-[5cm] '>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>آزمون:</span>
              <span className='pr-[1cm]'>{exam.title}</span>
            </p>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>پایه:</span>
              <span className='pr-[0.5cm]'>{exam.grade.full_title}</span>
            </p>
          </div>
          <div className='w-[5cm]'>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>تاریخ گزارش:</span>
              <span className='pr-[0.5cm]'>{new Date().toLocaleDateString('fa-IR')}</span>
            </p>
            <p className='flex flex-col my-0 mb-1'>
              <span className='font-semibold'>صفحه:</span>
              <span className='pr-[1cm]'> {index + 1}</span>
            </p>
          </div>
        </div>
        <div className='text-[11px] mt-[0.3cm]'>
          <table>
            <thead className='bg-gray-50'>
              <tr>
                <th>ردیف</th>
                <th>کد داوطلب</th>
                <th>نام و نام خانوادگی</th>
                <th>کلاس</th>
                <th>ریاضی</th>
                <th>علوم</th>
                <th>فارسی</th>
              </tr>
            </thead>
            <tbody>
              {group.map((item) => (
                <tr key={item.username}>
                  <td>{item.row_number}</td>
                  <td>{item.username}</td>
                  <td> {item.full_name}</td>
                  <td>{item.classroom_title}</td>
                  <td>{item.riazi}</td>
                  <td>{item.olum}</td>
                  <td>{item.farsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReportSection
