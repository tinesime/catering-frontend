<template>
  <div>
    <Navbar />
    <Layout>
      <router-view />
    </Layout>
  </div>
</template>

<script setup>
import Layout from './components/Layout.vue';
import Navbar from './components/Navbar.vue';
</script>
