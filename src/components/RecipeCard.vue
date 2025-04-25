<script setup>
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
  }
})
</script>

<template>
  <div 
    class="relative w-[200px] h-[150px] rounded-xl bg-cover bg-center" 
    :style="{ 
      backgroundImage: image ? `url(${image})` : 'none',
      backgroundColor: image ? '' : 'var(--color-secondary)',
    }"
  >
  
    <div class="flex flex-wrap w-[150px] items-start gap-[10px] p-2 absolute top-0 left-0">
      <div class="relative flex-1 title-medium text-black p-[10px]">
        {{ title }}
      </div>
    </div>

    <button class="absolute w-6 h-6 top-3 right-3 p-2 text-black">
      <i class="pi pi-ellipsis-v" aria-hidden="true"></i>
    </button>
  </div>
</template>