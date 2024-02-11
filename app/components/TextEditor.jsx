'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor'
import callAxios from '@/helpers/callAxios'
import { App } from 'antd'

const TextEditor = ({ value, onChange, placeholder }) => {
  const { message } = App.useApp()
  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return {
        upload: () => {
          return loader.file.then(
            (file) =>
              new Promise(async (resolve, reject) => {
                const data = new FormData()
                data.append('file', file)
                callAxios
                  .post('/exam/image/upload/', data)
                  .then((response) => {
                    resolve({ default: response.data.url })
                  })
                  .catch((e) => {
                    message.error(e.errorData.msg)
                    reject()
                  })
              }),
          )
        },
      }
    }
  }
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData()
          onChange(data)
        }}
        config={{
          placeholder: `${placeholder ? placeholder : 'متن خود را وارد کنید ...'}`,
          extraPlugins: [MyCustomUploadAdapterPlugin],
        }}
      />
    </div>
  )
}

export default TextEditor
