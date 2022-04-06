<script setup lang="ts">
import { BarChart, useBarChart } from 'vue-chart-3'
import type { ChartData, ChartOptions, LegendItem, Plugin, ScriptableContext } from 'chart.js'
import { Chart, registerables } from 'chart.js'

interface BarContext extends ScriptableContext<'bar'> {
  element?: any
}

interface DataItem extends Record<string, any> {
  label: string
  count: number
  countObserving: number
  rate: number
  rateObserving: number
}

const props = defineProps<{
  controls?: boolean
  title?: string
  modelValue: DataItem[]
}>()

const emit = defineEmits(['click-bar'])

Chart.defaults.font.family = 'Poppins'
Chart.defaults.color = '#9BAAC4'
Chart.register(...registerables)

const root = ref(null)
const { width: rootWidth } = useElementSize(root)

const page = ref(0)

const categoryCount = computed(() => Math.floor(rootWidth.value / 80))
const pageCount = computed(() => categoryCount.value ? Math.ceil(props.modelValue.length / categoryCount.value) : 0)

const visibleData = computed(() => {
  const total = props.modelValue.length
  if (total <= categoryCount.value)
    return props.modelValue

  const start = page.value * categoryCount.value
  const end = start + categoryCount.value

  if (total - start < categoryCount.value)
    return props.modelValue.slice(categoryCount.value * -1)

  return props.modelValue.slice(start, end)
})

const createGradient = (top: string, bottom: string) => (context: BarContext) => {
  let width, height, gradient
  const { ctx, chartArea } = context.chart
  if (!chartArea || !context.element)
    return

  const { base } = context.element

  if (!base)
    return

  const chartWidth = chartArea.right - chartArea.left
  const chartHeight = chartArea.bottom - chartArea.top
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth
    height = chartHeight
    gradient = ctx.createLinearGradient(0, base, 0, chartHeight - 30) // TODO: improve anchor points of gradients
    gradient.addColorStop(1, top)
    gradient.addColorStop(0, bottom)
  }

  return gradient
}

const legendItems = ref([] as LegendItem[])

const reactiveLegendPlugin: Plugin = {
  id: 'htmlLegend',
  afterUpdate(chart) {
    if (!chart.options)
      return

    // @ts-expect-error Cannot invoke an object which is possibly 'undefined'
    legendItems.value = chart.options.plugins?.legend?.labels?.generateLabels(chart) || []
  },
}

const view = ref('both' as 'both' | 'count' | 'rate')

const countDataSets = computed(() => [
  {
    label: 'Count (active)',
    data: visibleData.value,
    backgroundColor: createGradient('#6F7CCD', '#A1A9DF'),
    hoverBackgroundColor: '#5C6CC6',
    stack: 'count',
    parsing: {
      yAxisKey: 'count',
    },
  },

  {
    label: 'Count (observing)',
    data: visibleData.value,
    backgroundColor: '#C6CAEB',
    stack: 'count',
    parsing: {
      yAxisKey: 'countObserving',
    },
  },
])

const rateDatasets = computed(() => [
  {
    label: 'Rate (active)',
    data: visibleData.value,
    backgroundColor: createGradient('#28B7F0', '#8DDAF8'),
    hoverBackgroundColor: '#009DDF',
    stack: 'rate',
    yAxisID: 'rate',
    parsing: {
      yAxisKey: 'rate',
    },
  },

  {
    label: 'Rate (observing)',
    data: visibleData.value,
    backgroundColor: '#A3E0F9',
    stack: 'rate',
    yAxisID: 'rate',
    parsing: {
      yAxisKey: 'rateObserving',
    },
  },
])

const chartData = computed<ChartData<'bar', DataItem[]>>(() => ({
  datasets: view.value === 'count'
    ? countDataSets.value
    : view.value === 'rate'
      ? rateDatasets.value
      : [...countDataSets.value, ...rateDatasets.value],
}))

const options = computed<ChartOptions<'bar'>>(() => {
  const countMax = !props.modelValue?.length ? 10 : Math.ceil(props.modelValue.reduce((max, { count, countObserving }) => Math.max(max, count + countObserving), 0)) + 10
  const rateMax = !props.modelValue?.length ? 10 : Math.ceil(props.modelValue.reduce((max, { rate, rateObserving }) => Math.max(max, rate + rateObserving), 0)) + 2

  return {
    datasets: {
      bar: {
        borderRadius: 5,
        categoryPercentage: 0.62,
        maxBarThickness: 32,
      },
    },
    scales: {
      y: {
        max: countMax,
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: '#5C6CC6',
          font: {
            weight: '600',
          },
        },
      },
      rate: {
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
        min: 0,
        max: rateMax,
        position: 'right',
        ticks: {
          color: '#28B7F0',
          font: {
            weight: '500',
          },
          callback: (value) => {
            return `${value}%`
          },
        },
      },
    },
    parsing: {
      xAxisKey: 'label',
    },
    plugins: {
      htmlLegend: {
        // ID of the container to put the legend in
        containerID: 'legend-container',
      },

      legend: {
        display: false,
        // https://www.chartjs.org/docs/3.3.2/samples/legend/html.html
        align: 'end',
        labels: {
          font: {
            size: 12,
            weight: '500',
          },
          usePointStyle: true,
          boxWidth: 12,
        },
        maxWidth: 200,
        maxHeight: 200,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'nearest',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        usePointStyle: true,
        callbacks: {
          label(ctx) {
            let label = ctx.dataset.label || ''

            if (label)
              label = ` ${label}: ${ctx.formattedValue || ''}${ctx.dataset.stack === 'rate' ? '%' : ''}`

            return label
          },
        },
      },
    },
    responsive: true,
    interaction: {
      mode: 'nearest',
    },

    onHover: (evt, _elements, chart) => {
      const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true)

      chart.canvas.style.cursor = points.length ? 'pointer' : 'default'
    },
    onClick: (evt, _elements, chart) => {
      const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true)

      if (points.length) {
        const firstPoint = points[0]
        const label = chart.data.labels?.[firstPoint.index] as string
        // const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index]

        emit('click-bar', label)
      }
    },
  }
})

const { barChartProps } = useBarChart({
  // @ts-expect-error custom interface not supported by ChartData
  chartData,
  options,
  plugins: [reactiveLegendPlugin],
})

const createLegendBackground = (item: LegendItem): string => {
  return typeof item.fillStyle === 'string'
    ? item.fillStyle
    : /rate/i.test(item.text) ? 'linear-gradient(#28B7F0, #8DDAF8)' : 'linear-gradient(#6F7CCD, #A1A9DF)'
}

const tabs = [
  {
    label: 'Both',
    value: 'both',
  },
  {
    label: 'Insight Count',
    value: 'count',
  },
  {
    label: 'Insight Rate',
    value: 'rate',
  },
]

const nextPage = () => {
  if (page.value >= (pageCount.value - 1))
    return

  page.value = page.value + 1
}
const prevPage = () => {
  page.value = page.value > 0 ? page.value - 1 : 0
}
const dots = computed(() => pageCount.value ? Array(pageCount.value).fill(0) : [])

</script>

<template>
  <div ref="root" class="relative">
    <header class="flex flex-col sm:flex-row justify-between mb-4">
      <div class="relative flex justify-between">
        <slot name="title">
          <div>
            <p class="w-32 h-6 text-sm font-medium leading-tight text-gray-500">
              Insights by
            </p>
            <p class="w-40 text-xl font-medium leading-7 text-gray-800">
              {{ title }}
            </p>
          </div>
        </slot>
        <div class="sm:hidden">
          <slot name="dialog-close" />
        </div>
      </div>
      <div class="flex justify-end">
        <ul
          class="grid gap-y-1 gap-x-4 items-center grid-rows-2 pt-4 grid-flow-col"
          :class="view === 'both' ? 'grid-cols-2' : 'grid-cols-1'"
        >
          <li v-for="item in legendItems" :key="item.datasetIndex" class="relative text-xs leading-none text-gray-500 flex items-center" :class="item.hidden ? 'opacity-60': ''">
            <div v-if="item.hidden" class="absolute w-full h-2px bg-gray-400" />
            <div
              class="rounded-full w-3 h-3 bg-gray-400 mr-1"
              :style="{ background: createLegendBackground(item as LegendItem) }"
            />
            = {{ item.text }}
          </li>
        </ul>

        <div class="hidden sm:block">
          <slot name="dialog-close" />
        </div>
      </div>
    </header>
    <Tabs v-if="controls" v-model="view" class="mb-6" :tabs="tabs" />
    <BarChart class="h-full w-full" v-bind="barChartProps" />

    <footer v-if="controls && dots.length > 1" class="flex justify-center pt-4">
      <div class="flex space-x-6 items-center justify-center">
        <button class="h-full px-2 py-1 bg-white border rounded-lg border-gray-300" @click="prevPage()">
          <i-ph-arrow-left class="h-6 w-6" />
        </button>
        <div class="flex space-x-2 items-center justify-center">
          <div
            v-for="(_dot, index) in dots" :key="index"
            class="w-4 h-4 rounded-full transition transform-gpu"
            :class="{
              'bg-gray-400 scale-100': index === page,
              'bg-gray-300 scale-90': index !== page
            }"
          />
        </div>
        <button class="h-full px-2 py-1 bg-white border rounded-lg border-gray-300" @click="nextPage()">
          <i-ph-arrow-right class="h-6 w-6" />
        </button>
      </div>
    </footer>
  </div>
</template>
