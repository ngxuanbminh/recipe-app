<script setup>
import IconButton from './IconButton.vue';

defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);

</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-white rounded-lg w-[360px] max-w-[90vw] max-h-[80vh] overflow-y-auto shadow-lg" @click.stop>
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold m-0">Settings</h2>
        <IconButton icon="times" @click="$emit('close')" />
      </div>
      
      <div class="p-4 border-b border-gray-200">
        <h3 class="mt-0 mb-3 text-base font-medium">Account</h3>
        <button class="block w-full py-2 px-4 mb-2 bg-[var(--color-primary)] text-white border-none rounded cursor-pointer text-sm hover:bg-[var(--color-secondary)]">Log in</button>
        <button class="block w-full py-2 px-4 mb-2 bg-[var(--color-primary)] text-white border-none rounded cursor-pointer text-sm hover:bg-[var(--color-secondary)]">Create account</button>
      </div>
      
      
      <div class="p-4 border-b border-gray-200">
        <h3 class="mt-0 mb-3 text-base font-medium">App Settings</h3>
        <div class="flex justify-between items-center mb-3">
          <span>Notifications</span>
          <input type="checkbox" />
        </div>
        <div class="flex justify-between items-center mb-3">
          <span>Auto-save recipes</span>
          <input type="checkbox" checked />
        </div>
        <div class="flex justify-between items-center mb-3">
          <span>Show nutritional info</span>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  </div>
</template>