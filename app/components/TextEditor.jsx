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
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'fontBackgroundColor',
              'fontColor',
              'fontFamily',
              'fontSize',
              '|',
              'MathType',
              'ChemType',
              '|',
              'alignment',
              'outdent',
              'indent',
              '|',
              'blockQuote',
              'insertTable',
              'undo',
              'redo',
              '|',
              'sourceEditing',
              '|',
              'style',
              '|',
              'specialCharacters',
              '|',
              'highlight',
              'horizontalLine',
              'htmlEmbed',
              'imageInsert',
              'pageBreak',
              'removeFormat',
              'restrictedEditingException',
              'strikethrough',
              'subscript',
              'todoList',
              'superscript',
              'findAndReplace',
              'codeBlock',
              'code',
              'mediaEmbed',
              'imageUpload',
            ],
          },
          image: {
            toolbar: [
              'imageTextAlternative',
              'toggleImageCaption',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              'imageStyle:alignLeft',
              'imageStyle:alignRight',
              'imageStyle:alignBlockLeft',
              'imageStyle:alignBlockRight',
              'imageStyle:alignCenter',
              'linkImage',
            ],
            // insert: {
            //   type: 'inline',
            // },
          },
          style: {
            definitions: [],
          },
        }}
      />
    </div>
  )
}

export default TextEditor
