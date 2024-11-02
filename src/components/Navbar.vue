<template>
  <Disclosure as="nav" class="bg-black text-white" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <DisclosureButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="absolute -inset-0.5"/>
            <span class="sr-only">Open</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-between sm:items-stretch">
          <div class="hidden sm:ml-6 sm:block">
            <a v-for="item in navigation" :key="item.name" :href="item.href"
               :class="[
                   isCurrent(item.href) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    (!isAuth && (item.name === 'Meine Bestellungen' || item.name === 'Upload')) ? 'pointer-events-none opacity-50' : '',
                   (isAuth && user.role === 'Lieferant' && item.name === 'Meine Bestellungen') ? 'pointer-events-none opacity-50' : '',
                   (isAuth && user.role === 'Mitarbeiter' && item.name === 'Upload') ? 'pointer-events-none opacity-50' : '',
                        'rounded-md px-3 py-2 text-sm font-medium']"
               :aria-current="isCurrent(item.href) ? 'page' : undefined">
              {{ item.name }}
            </a>
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <a v-show="!isAuth" v-for="item in authNavigation" :key="item.name" :href="item.href"
               :class="[
                   isCurrent(item.href) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium']"
               :aria-current="isCurrent(item.href) ? 'page' : undefined">
              {{ item.name }}
            </a>
            <button v-show="isAuth" @click="logout"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href"
                          :class="[isCurrent(item.href) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                             (!isAuth && (item.name === 'Meine Bestellungen' || item.name === 'Upload')) ? 'pointer-events-none opacity-50' : '',
                   (isAuth && user.role === 'Lieferant' && item.name === 'Meine Bestellungen') ? 'pointer-events-none opacity-50' : '',
                   (isAuth && user.role === 'Mitarbeiter' && item.name === 'Upload') ? 'pointer-events-none opacity-50' : '',
                                   'block rounded-md px-3 py-2 text-base font-medium']"
                          :aria-current="isCurrent(item.href) ? 'page' : undefined">{{ item.name }}
        </DisclosureButton>
        <DisclosureButton v-show="!isAuth" v-for="item in authNavigation" :key="item.name" as="a"
                          :href="item.href"
                          :class="[isCurrent(item.href) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block rounded-md px-3 py-2 text-base font-medium']"
                          :aria-current="isCurrent(item.href) ? 'page' : undefined">{{ item.name }}
        </DisclosureButton>
        <button v-show="isAuth" @click="logout"
                class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
          Logout
        </button>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import {Bars3Icon, XMarkIcon} from '@heroicons/vue/24/outline'
import {useRoute} from 'vue-router'
import {useRouter} from 'vue-router'
import {computed, onMounted} from 'vue'
import {useStore} from "vuex";

const route = useRoute()
const router = useRouter()
const store = useStore()

const isAuth = computed(() => store.getters.isAuthenticated)
const user = computed(() => store.getters.user)

const navigation = [
  {name: 'Angebot', href: '/offer'},
  {name: 'Meine Bestellungen', href: '/ordered'},
  {name: 'Upload', href: '/upload'}
]

const authNavigation = [
  {name: 'Login', href: '/login'},
  {name: 'Registrieren', href: '/register'}
]

const isCurrent = (href) => {
  return route.path === href
}

const logout = async () => {
  await store.dispatch('logout')
  await router.push('/offer')
}

onMounted(async () => {
  if (!isAuth.value) {
    await store.dispatch('logout')
  }
})

</script>

<style>
body {
  font-family: 'Poppins', sans-serif;
}
</style>