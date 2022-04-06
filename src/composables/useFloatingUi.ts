import type { Middleware, Placement, arrow } from '@floating-ui/dom'
import { computePosition } from '@floating-ui/dom'
import type { MiddlewareData } from '@floating-ui/core'
import type { Ref, WatchStopHandle } from 'vue'

interface ArrowConfig {
  arrow: typeof arrow
  arrowElement: Ref<HTMLElement>
}

export default (anchor: Ref<Element> | Element, floating: Ref<HTMLElement>, placement: Placement = 'bottom', middleware: Middleware[], arrowConfig?: ArrowConfig) => {
  const posX = ref(0)
  const posY = ref(0)
  const middlewareData: Ref<MiddlewareData> = ref({})

  const currentPlacement = ref(placement)

  const floatingStyles = computed(() => ({
    left: 0,
    top: 0,
    transform: `translate(${Math.round(posX.value)}px,${Math.round(posY.value)}px)`,
  }))

  const anchorRef = isRef(anchor) ? anchor : ref(anchor)

  const updateFloating = async() => {
    const mWare = [...middleware, ...arrowConfig ? [arrowConfig?.arrow({ element: arrowConfig.arrowElement.value })] : []]
    // const middleware = [flip(), offset(12), shift({ padding: 8 }), arrow({ element: arrowElement.value! })] // arrow middleware needs to be last
    const { x, y, placement: domPlacement, middlewareData: data } = await computePosition(anchorRef.value!, floating.value, { placement, middleware: mWare })

    middlewareData.value = data
    posX.value = x
    posY.value = y

    currentPlacement.value = domPlacement as Placement
  }

  let sub: WatchStopHandle
  onMounted(() => {
    sub = watch(() => anchor, () => {
      updateFloating()
    })
  })

  onBeforeUnmount(() => {
    sub?.()
  })

  return {
    currentPlacement,
    floatingStyles,
    middlewareData,
    posX,
    posY,
    updateFloating,
  }
}
