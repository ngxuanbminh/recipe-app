<script setup>
/**
 * Name of the PrimeIcon to display (without the `pi-` prefix).
 * e.g. 'trash', 'plus', 'check-circle'
 */
const props = defineProps({
  icon: {
    type: String,
    default: 'plus',
  },
})

// expose it as a local const for cleaner template binding
const icon = toRefs(props)
</script>

<template>
  <button
    type="button"
    class="flex items-center justify-center w-12 h-12 p-2 rounded-lg hover:bg-[#e8def880] active:bg-[var(--x-10)] transition-colors"
  >
    <!-- use props.icon here -->
    <i :class="['pi', `pi-${icon}`, 'w-6', 'h-6']" aria-hidden="true" />
  </button>
</template>
