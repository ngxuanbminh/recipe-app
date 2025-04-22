<script setup>
import { computed } from 'vue';

const props = defineProps({
  /** primeicon name, e.g. "pi-plus" */
  icon: {
    type: String,
    required: true
  },
  /** label text (hidden when truncated) */
  label: {
    type: String,
    default: ''
  },
  /** show only icon? */
  truncated: {
    type: Boolean,
    default: false
  },
  /**
   * persistent "active" (selected) state
   */
  active: {
    type: Boolean,
    default: false
  }
});

// Get CSS classes for active state if needed
const activeStateClasses = computed(() => {
  return props.active ? 'bg-[var(--color-secondary)] border border-[var(--color-tertiary)]' : '';
});
</script>

<template>
  <button
    type="button"
    @click="$emit('click', $event)"
    :class="[
      // base layout
      'inline-flex items-center select-none transition-colors duration-150 outline-none',
      // alignment - center in truncated mode, left-aligned otherwise
      truncated ? 'justify-center' : 'justify-start gap-2',
      // sizing
      truncated ? 'w-12 h-12 p-2' : 'h-12 px-6 py-3 w-full',
      // rounded corners
      'rounded-lg',
      // state classes using CSS variables
      activeStateClasses,
      // dynamic hover/active states
      !active && 'hover:bg-[var(--color-tertiary-hover)] active:bg-[var(--color-tertiary)]'
    ]"
  >
    <i :class="['pi', `pi-${icon}`, 'text-xl']" aria-hidden="true" />
    <span v-if="!truncated" class="whitespace-nowrap label-medium">
      {{ label }}
    </span>
  </button>
</template>

