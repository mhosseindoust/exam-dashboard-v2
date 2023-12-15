'use client'

import dynamic from 'next/dynamic'
import { BarcodeReader } from 'dynamsoft-javascript-barcode'
import React, { useEffect, useRef, useState } from 'react'
import { Progress, Spin } from 'antd'
import callAxios from '@/helpers/callAxios'
import Compressor from 'compressorjs'

let barcodeScanner

BarcodeReader.license = process.env.NEXT_PUBLIC_DBR_LICENSE_KEY
BarcodeReader.engineResourcePath = '/dbr-resources'
BarcodeReader.createInstance().then((reader) => {
  barcodeScanner = reader
})

const DWT = dynamic(() => import('../components/DWT'), {
  ssr: false,
})

export default function Page(props) {
  const [uploads, setUploads] = useState([])
  const [finishScan, setFinishScan] = useState(false)

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

    DWObject.AcquireImage(
      deviceConfiguration,
      (e) => setFinishScan(true),
      (e) => console.log(e),
    )
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
          barcodeScanner
            .decode(blob)
            .then((results) => {
              let barcodes = results.map((result) => ({
                barcode: result.barcodeText,
                y: result.localizationResult.y1,
              }))

              if (barcodes.length > 0 && barcodes[0].barcode.includes('-')) {
                if (barcodes.length > 1 && barcodes[1].barcode.split('-').length === 3) {
                  barcodes = barcodes.sort((a, b) => a.y - b.y)
                  const exam_user_id = barcodes
                    .filter((barcode) => barcode.barcode.split('-').length === 3)[0]
                    .barcode.replace(/-/g, '')
                  const validBarcodes = barcodes.filter((barcode) => !barcode.barcode.includes('-'))
                  new Compressor(blob, {
                    quality: 0.4,
                    success(compressedBlob) {
                      const formData = new FormData()
                      formData.append('file', compressedBlob, `${outputInfo.imageId}.jpg`)
                      formData.append('exam_user_id', exam_user_id)
                      formData.append('barcodes', JSON.stringify(validBarcodes))

                      callAxios
                        .post('/exam/upload_scanned/', formData)
                        .then((response) => {
                          updateUploadStatus(outputInfo.imageId, 'success')
                        })
                        .catch((error) => {
                          updateUploadStatus(outputInfo.imageId, 'failed')
                          console.log('1-',error)
                        })
                    },
                    error: (err) => {
                      updateUploadStatus(outputInfo.imageId, 'failed')
                      console.error('Image compression error:', err.message)
                      console.log('2-',error)
                    },
                  })
                } else {
                  updateUploadStatus(outputInfo.imageId, 'failed')
                  console.log('3-')
                }

                // DWObject.TagImages([imageIndex], 'success')
              } else {
                DWObject.Rotate(imageIndex, 180, true) // Rotate the image 180 degrees
                // Retrieve the rotated image as a blob
                DWObject.ConvertToBlob(
                  [DWObject.ImageIDToIndex(outputInfo.imageId)],
                  Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG,
                  function (blob) {
                    barcodeScanner
                      .decode(blob)
                      .then((results) => {
                        let barcodes = results.map((result) => ({
                          barcode: result.barcodeText,
                          y: result.localizationResult.y1,
                        }))

                        if (barcodes.length > 0 && barcodes[0].barcode.includes('-')) {
                          if (barcodes.length > 1 && barcodes[1].barcode.split('-').length === 3) {
                            barcodes = barcodes.sort((a, b) => a.y - b.y)
                            const exam_user_id = barcodes
                              .filter((barcode) => barcode.barcode.split('-').length === 3)[0]
                              .barcode.replace(/-/g, '')
                            const validBarcodes = barcodes.filter((barcode) => !barcode.barcode.includes('-'))
                            new Compressor(blob, {
                              quality: 0.4,
                              success(compressedBlob) {
                                const formData = new FormData()
                                formData.append('file', compressedBlob, `${outputInfo.imageId}.jpg`)
                                formData.append('exam_user_id', exam_user_id)
                                formData.append('barcodes', JSON.stringify(validBarcodes))

                                callAxios
                                  .post('/exam/upload_scanned/', formData)
                                  .then((response) => {
                                    updateUploadStatus(outputInfo.imageId, 'success')
                                  })
                                  .catch((error) => {
                                    console.log('4-',error)
                                    updateUploadStatus(outputInfo.imageId, 'failed')
                                  })
                              },
                              error: (err) => {
                                updateUploadStatus(outputInfo.imageId, 'failed')
                                console.error('5-','Image compression error:', err.message)
                              },
                            })
                          } else {
                            updateUploadStatus(outputInfo.imageId, 'failed')
                            console.log('6-')
                          }
                        } else {
                          updateUploadStatus(outputInfo.imageId, 'failed')
                          console.log('7-')
                        }
                      })
                      .catch(() => {
                        updateUploadStatus(outputInfo.imageId, 'failed')
                        console.log('8-')
                      })
                  },
                  function (errorCode, errorString) {
                    updateUploadStatus(outputInfo.imageId, 'failed')
                    console.log('9-')
                  },
                )

                // updateUploadStatus(outputInfo.imageId, 'failed')

                // DWObject.TagImages([imageIndex], 'failed')
              }
            })
            .catch(() => {
              // DWObject.TagImages([imageIndex], 'failed')
              updateUploadStatus(outputInfo.imageId, 'failed')
              console.log('10-')
            })
        },
        function (errorCode, errorString) {
          console.log(errorString)
          updateUploadStatus(outputInfo.imageId, 'failed')
          console.log('11-')

          // DWObject.TagImages([imageIndex], 'failed')
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
