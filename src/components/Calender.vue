<template>
  <div class="flex h-full flex-col w-full mb-12">
    <header class="flex flex-none items-center justify-between border-b border-gray-200 py-4">
      <h1 class="text-base font-semibold leading-6 text-gray-900">
        <time :datetime="currentWeek[0]?.date">KW {{ weekNumber }}</time>
      </h1>
      <div class="flex items-center">
        <button @click="previousWeek" type="button"
                class="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50">
          <span class="sr-only">Previous week</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true"/>
        </button>
        <button @click="nextWeek" type="button"
                class="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50">
          <span class="sr-only">Nächste Woche</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true"/>
        </button>
      </div>
    </header>
    <div class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div
          class="grid grid-cols-5 gap-px border-b border-gray-300 bg-gray-200 text-center text-sm font-semibold leading-6 text-gray-700 lg:flex-none">
        <div v-for="day in currentWeek" :key="day.date" class="bg-white py-4">
          {{ formatWeekday(day.date) }}<br>{{ formatFullDate(day.date) }}
        </div>
      </div>
      <div class="flex bg-gray-200 text-sm leading-6 text-gray-700 lg:flex-auto">
        <div class="isolate grid w-full grid-cols-5 gap-px">
          <div v-for="day in currentWeek" :key="day.date" :class="[day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500', 'relative px-6 py-4']">
            <Menu v-for="menu in getItemsForDay(day.date)" :key="menu._id" :menu="menu" />
            <div v-if="day.ordered" class="mt-4 h-16 bg-green-500 text-white flex items-center justify-center rounded-md w-full cursor-pointer">
              Bestellt
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import {ref, computed, onMounted} from 'vue'
import axios from 'axios'
import moment from 'moment'
import Menu from "@/components/Menu.vue";
import {defineProps, defineEmits} from 'vue'
import {useStore} from 'vuex'

const props = defineProps({
  menus: {
    type: Array,
    required: true,
  }
})

const emit = defineEmits(['week-changed'])

const currentWeekIndex = ref(0)
const currentWeek = ref([])

const fetchCurrentDate = async () => {
  try {
    const response = await axios.get('http://worldtimeapi.org/api/timezone/Etc/UTC')
    const currentDate = new Date(response.data.datetime)
    generateWeekDates(currentDate)
  } catch (error) {
    console.error('Error fetching current date:', error)
  }
}

const generateWeekDates = (startDate) => {
  const startOfWeek = startDate.getDate() - startDate.getDay() + 1
  const weekDates = []
  for (let i = 0; i < 5; i++) {
    const date = new Date(startDate)
    date.setDate(startOfWeek + i)
    weekDates.push({
      date: date.toISOString().split('T')[0],
      isCurrentMonth: date.getMonth() === startDate.getMonth(),
      isToday: date.toDateString() === startDate.toDateString(),
      ordered: false,
    })
  }
  currentWeek.value = weekDates
  emit('week-changed', weekDates[0].date, weekDates[4].date)
}

const previousWeek = () => {
  currentWeekIndex.value -= 1
  const startDate = new Date(currentWeek.value[0].date)
  startDate.setDate(startDate.getDate() - 7)
  generateWeekDates(startDate)
}

const nextWeek = () => {
  currentWeekIndex.value += 1
  const startDate = new Date(currentWeek.value[0].date)
  startDate.setDate(startDate.getDate() + 7)
  generateWeekDates(startDate)
}

const weekNumber = computed(() => {
  if (currentWeek.value.length === 0) return ''
  const startDate = new Date(currentWeek.value[0].date)
  const firstDayOfYear = new Date(startDate.getFullYear(), 0, 1)
  const pastDaysOfYear = (startDate - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
})

const formatWeekday = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {weekday: 'short'}).format(date)
}

const formatFullDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(date)
}

const getItemsForDay = (date) => {
  let formatedDate = moment.utc(date).format('YYYY-MM-DD')
  return props.menus.filter(menu => moment.utc(menu.date).format('YYYY-MM-DD') === formatedDate)
}

onMounted(async () => {
  await fetchCurrentDate()
})
</script>

<style>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>