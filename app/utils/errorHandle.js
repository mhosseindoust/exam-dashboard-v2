export function CatchMessage(error) {
  if (!error.response) return { msg: 'مشکلی پیش آمده است', errorFields: [] }

  if (Object.prototype.toString.call(error.response.data) === '[object Object]') {
    if (error.response.status === 422) {
      let objectError = { msg: 'مشکلی در اعتبار سنجی بوجود آمده است', errorFields: [] }
      error.response.data.detail.map((e) => {
        objectError.errorFields.push({
          name: e.msg,
          errors: e.loc.toString(),
        })
      })

      return objectError
    }
    if (error.response.data.detail) {
      if (error.response.data.detail.error) {
        return { msg: error.response.data.detail.error.message, errorFields: [] }
      } else {
        return { msg: error.response.data.detail, errorFields: [] }
      }
    }
    return { msg: 'مشکلی پیش آمده کنسول را بررسی کنید', errorFields: [] }
  } else if (error.response.status === 500) {
    return { msg: 'مشکلی پیش آمده کنسول را بررسی کنید', errorFields: [] }
  } else {
    return { msg: error.response.data, errorFields: [] }
  }
}
