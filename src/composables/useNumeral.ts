import type { ComputedRef, Ref } from 'vue'
import numeral from 'numeral'

export {
  numeral,
}

export const useNumeralFormat = (num: Ref<number | string> | ComputedRef<number> | number | string, format: string) => {
  const number = isRef(num) ? num : ref(num)

  return computed(() => numeral(number.value).format(format))
}

export const useNumeralFormatWithTransition = (num: ComputedRef<number>, format: string) => {
  if (typeof num.value !== 'number')
    return useNumeralFormat(num, format)
  return useNumeralFormat(useThrottle(useTransition(num, { duration: 250 }), 20), format)
}
