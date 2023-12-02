import { Button, Form } from 'antd'
import { useEffect, useState } from 'react'

export default function SubmitButton({ form, text = 'تایید', ...rest }) {
  const [submittable, setSubmittable] = useState(false)

  // Watch all values
  const values = Form.useWatch([], form)
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true)
        },
        () => {
          setSubmittable(false)
        },
      )
  }, [values])
  return (
    <Button type='primary' htmlType='submit' disabled={!submittable} {...rest}>
      {text}
    </Button>
  )
}
