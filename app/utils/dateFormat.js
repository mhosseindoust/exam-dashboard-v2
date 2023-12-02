export function UtcToPersianDateTime(dateStr) {
  return new Date(dateStr + '+00:00').toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}
