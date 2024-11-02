<template>
  <div>
    <div v-show="!isAuth" class="mt-4 rounded-lg bg-yellow-50 p-4">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Achtung!</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>
              Bitte melden Sie sich an, um ein Menü bestellen zu können.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="user" class="py-4 text-xl">
      <h4>Hallo, {{ user.username }}!</h4>
    </div>

    <div v-show="isAuth" class="flex items-center justify-center">
      <Calender :menus="menus" @week-changed="fetchMenus"/>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import Calender from '@/components/Calender.vue'
import api from "../interceptor"
import {useStore} from 'vuex'

const menus = ref([])

const store = useStore()
const isAuth = computed(() => store.getters.isAuthenticated)
const user = computed(() => store.getters.user)

const fetchMenus = async (startDate, endDate) => {
  try {
    const response = await api.get(`/menu/${startDate}/${endDate}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    menus.value = response.data
  } catch (error) {
    console.error("Die Menüs konnten nicht abgerufen werden:", error)
  }
}

onMounted(async () => {
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)).toISOString().split('T')[0]
  const endOfWeek = new Date(today.setDate(today.getDate() + 6)).toISOString().split('T')[0]
  await fetchMenus(startOfWeek, endOfWeek)
})
</script>