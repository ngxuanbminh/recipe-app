<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <button
    type="button"
    class="flex items-center justify-center w-10 h-10 p-2 rounded-full bg-white/70 hover:bg-[var(--color-tertiary-hover)] active:bg-[var(--color-tertiary)] cursor-pointer transition-colors"
  >
    <i :class="['pi', `pi-${icon}`, 'text-gray-700']" aria-hidden="true" />
  </button>
</template>
