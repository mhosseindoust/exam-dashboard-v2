export function UtcToPersianDateTime(dateStr) {
  return new Date(dateStr + '+00:00').toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export function convertUTCDateToUnix(inputDate) {
  let date = new Date(inputDate + '+00:00')
  return date.getTime()
}
