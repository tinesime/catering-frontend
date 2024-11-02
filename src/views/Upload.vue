<template>
  <div class="flex mt-4 justify-center">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-900">
      <h1 class="text-2xl font-semibold mb-4 text-center">Upload</h1>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <input type="file" @change="handleFileUpload"
                 class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"/>
        </div>
        <div class="flex justify-center">
          <button type="submit"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Upload
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import api from '../interceptor'
import {computed} from 'vue'
import {useStore} from 'vuex'

const store = useStore()
const file = ref(null)
const user = computed(() => store.getters.user)

const handleFileUpload = (event) => {
  file.value = event.target.files[0]
}

const handleSubmit = async () => {
  if (!file.value) {
    alert('Bitte wählen Sie eine Datei aus')
    return
  }

  if (user.value.role !== 'Lieferant') {
    alert('Nur Lieferanten können Dateien hochladen')
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    await api.post('http://localhost:8000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })

    alert('Datei erfolgreich hochgeladen')
  } catch (error) {
    console.error('Error uploading file:', error.response ? error.response.data : error.message)
    alert('Datei konnte nicht hochgeladen werden')
  }
}

onMounted(async () => {
})
</script>