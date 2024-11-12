<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
              <tr>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Bestellt am</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Datum</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Menü</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Aktionen</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
              <tr v-for="order in orders" :key="order._id">
                <td class="whitespace-nowrap px-3 py-3.5 text-sm font-medium text-gray-900">{{ order.orderDate }}</td>
                <td class="whitespace-nowrap px-3 py-3.5 text-sm font-medium text-gray-900">{{ order.menuDate }}</td>
                <td class="whitespace-nowrap px-3 py-3.5 text-sm font-medium text-gray-900">Menü {{ order.menuNumber }}</td>
                <td class="whitespace-nowrap px-3 py-3.5 text-sm font-medium text-gray-900">
                  <button @click.prevent="cancelOrder(order._id)" class="text-red-600 hover:text-red-900">Stornieren</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import moment from 'moment'
import api from '../interceptor'

const router = useRouter()
const store = useStore()
const isAuth = computed(() => store.getters.isAuthenticated)
const orders = ref([])

const fetchOrders = async () => {
  try {
    const response = await api.get(`/ordered`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    orders.value = await Promise.all(response.data.map(async order => {
      const menuResponse = await api.get(`/menu/${order.menuId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      return {
        ...order,
        orderDate: moment(order.orderDate).format('DD.MM.YYYY'),
        menuDate: moment(menuResponse.data.date).format('DD.MM.YYYY'),
        menuNumber: menuResponse.data.menuNumber,
      }
    }))

  } catch (error) {
    console.error('Error getting orders:', error)
  }
}

const cancelOrder = async (orderId) => {
  try {
    await api.delete(`/cancel/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    orders.value = orders.value.filter(order => order._id !== id)
  } catch (error) {
    console.error('Error canceling order:', error)
  }
}

onMounted(async () => {
  if (!isAuth.value) {
    await store.dispatch('logout')
    await router.push('/login')
    return
  }

  await fetchOrders()
})


</script>