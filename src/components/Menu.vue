<template>
  <div
      :class="[
          'divide-y divide-gray-200 overflow-hidden rounded-lg border border-solid bg-white shadow-2xl mt-7 hover:border-red-500',
          orderedMenu ? 'border-2 border-green-500' : '']">
    <div class="px-4 py-5 sm:p-6">
      <h2 class="text-lg font-semibold text-gray-900">Menü {{ menu.menuNumber }}</h2>
      <ul>
        <li v-for="item in menu.items" :key="item._id" class="py-2" @mouseover="hovered = item._id"
            @mouseleave="hovered = null">
          {{ item.type }}:
          <span class="font-bold">
            {{ item.name }}
          </span>
          <div v-show="hovered === item._id">
            <div v-for="allergen in item.allergens" :key="allergen" class="text-xs text-gray-500">
              <p>{{ allergen }}</p>
            </div>
          </div>
        </li>
      </ul>

      <button
          v-if="!orderedMenu"
          @click="orderMenu"
          class="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-4"
      >
        Bestellen
      </button>
      <div v-else class="mt-4 text-green-500 font-semibold">
        Bestellt!
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import {ref, computed, onMounted} from 'vue'
import {useStore} from "vuex"
import api from "../interceptor"

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  }
})

const emit = defineEmits(['menu-ordered', 'menu-cancelled'])
const hovered = ref(null)
const orderedMenu = ref(false)

const store = useStore()
const user = computed(() => store.getters.user)

const fetchOrderedMenu = async () => {
  try {
    const date = new Date(props.menu.date).toISOString().split('T')[0]
    const response = await api.get(`/ordered/${props.menu._id}/${date}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    orderedMenu.value = response.data.ordered
  } catch (error) {
    console.error('Es konnte nicht überprüft werden, ob das Menü bereits bestellt wurde', error)
    orderedMenu.value = false
  }
}

const orderMenu = async () => {
  if (user.value.role !== 'Mitarbeiter') {
    alert('Nur Mitarbeiter können Menüs bestellen')
    return
  }

  console.log('Ordering menu:', props.menu)
  console.log('orderedMenu:', orderedMenu.value)

  if (orderedMenu.value) {
    alert('Das Menü wurde bereits bestellt')
  } else {
    try {
      await api.post(`/order/${props.menu._id}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      emit('menu-ordered')
    } catch (error) {
      console.error('Error ordering menu:', error)
    }
  }
}

onMounted(async () => {
  await fetchOrderedMenu()
})

</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>