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
    class="flex items-center justify-center w-12 h-12 p-2 rounded-lg hover:bg-[var(--color-tertiary-hover)] active:bg-[var(--color-tertiary)] transition-colors"
  >
    <i :class="['pi', `pi-${icon}`, 'text-xl']" aria-hidden="true" />
  </button>
</template>
