/**
 * Удаляет всё кроме цифр и берёт последние 10 цифр.
 * Приводит +7 и 8 к единому формату (7771234567).
 */
export function normalizePhone(phone) {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  return digits.slice(-10)
}

/**
 * Проверяет, что номер — казахстанский мобильный.
 * Допустимые форматы:
 *   +7 (777) 123-45-67  — 11 цифр, начинается с 7
 *   8 (777) 123-45-67   — 11 цифр, начинается с 8
 *   777 123 45 67       — 10 цифр, начинается с 7
 */
export function validatePhone(phone) {
  if (!phone) return false
  const digits = phone.replace(/\D/g, '')

  // 11 цифр с +7 или 8 в начале
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) return true
  // 10 цифр — уже локальный номер (должен начинаться с 7 для KZ)
  if (digits.length === 10 && digits[0] === '7') return true

  return false
}
