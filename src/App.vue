<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';

const truncated = ref(false);

const toggleNavBar = () => {
  truncated.value = !truncated.value;
};
</script>

<template>
  <div class="flex h-screen">
    <NavBar :truncated="truncated" @toggle="toggleNavBar" />
    <RouterView/>
  </div>
</template>
