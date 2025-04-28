<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  /**
   * Background image URL for the recipe card
   */
  image: {
    type: String,
    default: ''
  },
  /**
   * Title of the recipe
   */
  title: {
    type: String,
    default: 'Title'
  },
  /**
   * ID of the recipe for navigation to detail view
   */
  id: {
    type: [String, Number],
    required: true
  }
})
</script>

<template>
  <RouterLink 
    :to="'/recipe/' + id" 
    :key="id"
    class="block overflow-hidden rounded-lg"
  >
    <div 
      class="relative w-[200px] h-[150px] rounded-lg bg-cover bg-center cursor-pointer transition-transform hover:scale-105" 
      :style="{ 
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundColor: image ? '' : 'var(--color-secondary)',
      }"
    >
    
      <div class="flex flex-wrap w-[150px] items-start gap-[10px] p-2 absolute top-0 left-0 z-10">
        <div 
          class="relative flex-1 title-medium p-[10px] text-black" 
        >
          {{ title }}
        </div>
      </div>

      <button class="absolute w-6 h-6 top-3 right-3 p-2 text-black" @click.stop>
        <i class="pi pi-ellipsis-v" aria-hidden="true"></i>
      </button>
    </div>
  </RouterLink>
</template>