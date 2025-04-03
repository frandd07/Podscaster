export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB')
}

export function formatDuration(raw: string): string {
  if (!raw) return ''
  if (raw.includes(':')) return raw

  const seconds = parseInt(raw)
  if (isNaN(seconds)) return raw
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`
}
