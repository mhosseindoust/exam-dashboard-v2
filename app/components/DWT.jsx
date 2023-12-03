import React, { useEffect, useRef, useState } from 'react'
import { App, Button, Checkbox, Collapse, Divider, Form, Modal, Radio, Select, Spin } from 'antd'
import { Edit, FlipHorizontal, Reflect, RotateLeft, RotateRight, Trash } from 'react-flaticons'
import Dynamsoft from 'dwt'

export default function Dwt({ scan, onWebTWAINReady, extraSideBar }) {
  const { message, modal } = App.useApp()
  const [form] = Form.useForm()

  const [scanners, setScanners] = useState([])
  const [installDialogVisible, setInstallDialogVisible] = useState(false)
  const [installUrl, setInstallUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const containerID = 'dwtcontrolContainer'
  const container = useRef()
  const dwt = useRef()

  useEffect(() => {
    Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', onDWTReady)
    configureDWT()
    Dynamsoft.DWT.Load()
    Dynamsoft.DWT.OnWebTwainPreExecute = () => setLoading(true)
    Dynamsoft.DWT.OnWebTwainPostExecute = () => setLoading(false)
    Dynamsoft._show_install_dialog = showInstallDialog
    Dynamsoft.MobileNotSupportCallback = mobileNotSupported
  }, [])

  const onDWTReady = () => {
    const DWObject = Dynamsoft.DWT.GetWebTwain(containerID)
    initializeViewer(DWObject)
    const names = DWObject.GetSourceNames(false)
    setScanners(names)
    if (names.length > 0) {
      form.setFieldValue('scanner', names[0])
    }
    onWebTWAINReady(DWObject)
  }

  const initializeViewer = (DWObject) => {
    DWObject.Viewer.createThumbnailViewer().show()
    dwt.current = DWObject
    DWObject.Viewer.setViewMode(1, 1)
    DWObject.Viewer.createThumbnailViewer().show()
  }

  const configureDWT = () => {
    Dynamsoft.DWT.ResourcesPath = '/dwt-resources'
    Dynamsoft.DWT.ProductKey = process.env.NEXT_PUBLIC_DWT_LICENSE_KEY
    Dynamsoft.DWT.Containers = [{ WebTwainId: 'dwtObject', ContainerId: containerID, Width: '100%', Height: '600px' }]
  }

  const showInstallDialog = (...args) => {
    setInstallUrl(args[1].default)
    setInstallDialogVisible(true)
  }

  const mobileNotSupported = () => {
    modal.error({
      title: 'خطا',
      content: 'این قابلیت در دستگاه‌های موبایل پشتیبانی نمی‌شود.',
      autoFocusButton: null,
    })
    Dynamsoft.DWT.Unload()
  }

  const imageEdit = (action) => {
    const DWObject = dwt.current
    const currentIndex = DWObject.CurrentImageIndexInBuffer
    if (currentIndex >= 0) {
      performImageEditAction(DWObject, currentIndex, action)
    } else {
      message.warning('عکس برای ویرایش وجود ندارد')
    }
  }

  const performImageEditAction = (DWObject, currentIndex, action) => {
    switch (action) {
      case 'editor':
        DWObject.Viewer.createImageEditor().show()
        break
      case 'rotateL':
        DWObject.RotateLeft(currentIndex)
        break
      case 'rotateR':
        DWObject.RotateRight(currentIndex)
        break
      case 'mirror':
        DWObject.Mirror(currentIndex)
        break
      case 'flip':
        DWObject.Flip(currentIndex)
        break
      case 'removeS':
        DWObject.RemoveAllSelectedImages()
        break
      case 'removeA':
        DWObject.RemoveAllImages()
        break
      default:
        break
    }
  }

  const collapseItems = [
    {
      key: '1',
      label: 'اسکن',
      children: <ScannerForm form={form} scanners={scanners} scan={scan} dwt={dwt.current} />,
    },
    {
      key: '2',
      label: '',
      children: <div>{extraSideBar}</div>,
    },
  ]

  return (
    <div className='grid grid-cols-3 gap-2 p-2'>
      <div>
        <Collapse items={collapseItems} defaultActiveKey={['1', '2']} />
      </div>
      <div className='col-span-2'>
        <ScannerViewer
          installDialogVisible={installDialogVisible}
          setInstallDialogVisible={setInstallDialogVisible}
          installUrl={installUrl}
          loading={loading}
          imageEdit={imageEdit}
          containerID={containerID}
          container={container}
        />
      </div>
    </div>
  )
}

const ScannerViewer = ({
  installDialogVisible,
  setInstallDialogVisible,
  installUrl,
  loading,
  imageEdit,
  container,
  containerID,
}) => {
  return (
    <div className='border rounded p-3 relative'>
      <Modal
        title='نصب درایور'
        open={installDialogVisible}
        onCancel={() => setInstallDialogVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setInstallDialogVisible(false)}>
            لغو
          </Button>,
          <Button
            key='download'
            type='primary'
            onClick={() => {
              window.open(installUrl, '_blank')
              setInstallDialogVisible(false)
            }}
          >
            دانلود و نصب
          </Button>,
        ]}
      >
        <p>به نظر می‌رسد درایور روی دستگاه شما نصب نشده است. لطفاً برای استفاده از قابلیت‌های اسکن، آن را دانلود و نصب کنید.</p>
      </Modal>
      <div className='mb-1'>
        <div className='flex gap-2 justify-center'>
          <Button size={'small'} icon={<Edit />} onClick={() => imageEdit('editor')} />
          <Button size={'small'} icon={<RotateLeft />} onClick={() => imageEdit('rotateL')} />
          <Button size={'small'} icon={<RotateRight />} onClick={() => imageEdit('rotateR')} />
          <Button size={'small'} icon={<FlipHorizontal />} onClick={() => imageEdit('mirror')} />
          <Button size={'small'} icon={<Reflect />} onClick={() => imageEdit('flip')} />
          <Button size={'small'} icon={<Trash />} onClick={() => imageEdit('removeS')} />
        </div>
      </div>
      <div ref={container} id={containerID}></div>
      <Spin className='absolute top-1/2 right-1/2 z-10 ' spinning={loading} />
    </div>
  )
}

const ScannerForm = ({ form, scanners, scan, dwt }) => {
  return (
    <Form
      onFinish={(settings) => scan(dwt, settings)}
      form={form}
      initialValues={{ adf: true, duplex: true, showUi: false, pixelType: 2, resolution: 100 }}
    >
      <Form.Item name='scanner' label='اسکنر'>
        <Select options={scanners.map((scanner) => ({ label: scanner, value: scanner }))} />
      </Form.Item>
      <Divider />
      <Form.Item name='pixelType' label='نوع پیکسل'>
        <Radio.Group>
          <Radio value={0}>B&W</Radio>
          <Radio value={1}>Gray</Radio>
          <Radio value={2}>Color</Radio>
        </Radio.Group>
      </Form.Item>
      <Divider />
      <Form.Item name='resolution' label='رزولوشن'>
        <Radio.Group>
          <Radio value={100}>100</Radio>
          <Radio value={200}>200</Radio>
          <Radio value={300}>300</Radio>
          <Radio value={400}>400</Radio>
          <Radio value={500}>500</Radio>
          <Radio value={600}>600</Radio>
        </Radio.Group>
      </Form.Item>
      <Divider />
      <div className='grid grid-cols-3'>
        <Form.Item name='adf' label='دسته ای' valuePropName='checked' className='mb-0'>
          <Checkbox />
        </Form.Item>
        <Form.Item name='duplex' label='پشت و رو' valuePropName='checked' className='mb-0'>
          <Checkbox />
        </Form.Item>
        <Form.Item name='showUi' label='نشان دادن رابط کاربری' valuePropName='checked' className='mb-0'>
          <Checkbox />
        </Form.Item>
      </div>
      <Divider />
      <Form.Item>
        <Button type='primary' htmlType='submit' block>
          اسکن
        </Button>
      </Form.Item>
    </Form>
  )
}
