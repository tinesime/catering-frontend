<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Registrieren</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label for="username" class="block text-sm/6 font-medium text-gray-900">Benutzername</label>
          <div class="mt-2">
            <input id="username" v-model="username" name="username" type="text" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Passwort</label>
          </div>
          <div class="mt-2">
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <label for="role" class="block text-sm/6 font-medium text-gray-900">Role</label>
          <select id="role" v-model="role" name="role" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6">
            <option value="Mitarbeiter">Mitarbeiter</option>
            <option value="Lieferant">Lieferant</option>
          </select>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Registrieren</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import api from '../interceptor'

const username = ref('')
const password = ref('')
const role = ref('Mitarbeiter')
const router = useRouter()

const register = async () => {
  try {
    await api.post('/register', {
      username: username.value,
      password: password.value,
      role: role.value
    })

    await router.push('/login')
  } catch (error) {
    console.error('Error registering user:', error)
  }
}



</script>

<style scoped>

</style>