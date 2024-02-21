'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import { Progress } from 'antd'
import callAxios from '@/helpers/callAxios'
import Compressor from 'compressorjs'

const DWT = dynamic(() => import('../../components/DWT'), {
  ssr: false,
})

export default function Page(props) {
  const [uploads, setUploads] = useState([])
  const [finishScan, setFinishScan] = useState(false)

  const partId = useRef(null)

  const DWObjectRef = useRef(null)

  useEffect(() => {
    if (finishScan && uploads.filter((upload) => !upload.success && !upload.failed).length === 0) {
      const list_success = uploads.filter((upload) => upload.success).map((upload) => upload.index)
      if (DWObjectRef.current) {
        DWObjectRef.current.SelectImages(list_success)
        DWObjectRef.current.RemoveAllSelectedImages()
      }
    }
  }, [uploads])

  const updateUploadStatus = (imageId, status) => {
    setUploads((prevUploads) =>
      prevUploads.map((upload) =>
        upload.id === imageId ? { ...upload, success: status === 'success', failed: status === 'failed' } : upload,
      ),
    )
  }

  const handleScan = (DWObject, settings) => {
    const { scanner, adf, duplex, showUi, pixelType, resolution } = settings

    const deviceConfiguration = {
      SelectSourceByIndex: scanner,
      IfFeederEnabled: adf,
      IfDuplexEnabled: duplex,
      IfShowUI: showUi,
      PixelType: pixelType,
      Resolution: resolution,

      // IfShowIndicator: true,
      // IfDisableSourceAfterAcquire: true,

      // IfGetImageInfo: true,
      // IfGetExtImageInfo: true,
      // extendedImageInfoQueryLevel: 1,

      // IfDisableSourceAfterAcquire: true,
      // IfGetImageInfo: true,
      // IfGetExtImageInfo: true,
      // extendedImageInfoQueryLevel: 0,
    }

    setFinishScan(false)
    setUploads([])
    DWObject.RemoveAllImages()
    partId.current = null
    callAxios
      .post('/exam/scan-part/')
      .then((res) => {
        partId.current = res.data
        DWObject.AcquireImage(
          deviceConfiguration,
          (e) => setFinishScan(true),
          (e) => console.log(e),
        )
      })
      .catch((e) => console.log(e))
  }

  const uploadImage = (compressedBlob, imageId) => {
    const formData = new FormData()
    formData.append('file', compressedBlob, `${imageId}.jpg`)

    callAxios
      .post(`/exam/scan-part/${partId.current}/paper`, formData)
      .then((response) => {
        updateUploadStatus(imageId, 'success')
      })
      .catch((error) => {
        updateUploadStatus(imageId, 'failed')
      })
  }

  const handleWebTWAINReady = (DWObject) => {
    DWObjectRef.current = DWObject
    DWObject.RegisterEvent('OnPostTransferAsync', function (outputInfo) {
      const imageIndex = DWObject.ImageIDToIndex(outputInfo.imageId)
      const newUpload = { index: imageIndex, id: outputInfo.imageId, progress: 0, success: false, failed: false }
      setUploads((prev) => [...prev, newUpload])

      DWObject.ConvertToBlob(
        [DWObject.ImageIDToIndex(outputInfo.imageId)],
        Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG,
        function (blob) {
          new Compressor(blob, {
            quality: 0.4,
            success(compressedBlob) {
              uploadImage(compressedBlob, outputInfo.imageId)
            },
            error: (err) => {
              updateUploadStatus(outputInfo.imageId, 'failed')
            },
          })
        },
        function (errorCode, errorString) {
          updateUploadStatus(outputInfo.imageId, 'failed')
        },
      )
    })
  }

  const countSuccess = uploads.filter((upload) => upload.success).length
  const countFailed = uploads.filter((upload) => upload.failed).length
  const countInProgress = uploads.filter((upload) => !upload.success && !upload.failed).length

  const inProcessPercent = uploads.length > 0 ? ((countInProgress / uploads.length) * 100).toFixed(2) : 0

  return (
    <div>
      <DWT
        scan={handleScan}
        onWebTWAINReady={handleWebTWAINReady}
        extraSideBar={
          <div>
            {countInProgress ? (
              <Progress percent={100 - inProcessPercent} status='active' format={(percent) => countInProgress} />
            ) : null}
            <div className='flex justify-around'>
              <Progress type='circle' percent={100} size={50} format={() => countSuccess} />
              <Progress type='circle' percent={100} status='exception' size={50} format={() => countFailed} />
            </div>
          </div>
        }
      />
    </div>
  )
}
