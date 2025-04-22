<script setup>
import { ref } from 'vue';
import IconButton from './IconButton.vue';
import NavItem from './NavItem.vue';

defineProps({
  /** Whether the navbar is in truncated mode */
  truncated: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle']);

const activeItem = ref('smart-recommend');

const setActiveItem = (item) => {
  activeItem.value = item;
};
</script>

<template>
  <aside 
    class="flex flex-col bg-[var(--color-primary)] h-full border-r border-[var(--color-tertiary)] transition-all duration-300 linear overflow-hidden px-3" 
    :class="truncated ? 'w-[72px]' : 'w-[225px]'"
  >
    <!-- NavBar Header -->
    <div :class="[
      'flex items-center py-3 transition-all duration-300 w-full',
      truncated ? 'justify-start' : 'justify-between'
    ]">
      <IconButton 
        :icon="truncated ? 'angle-double-right' : 'angle-double-left'" 
        @click="$emit('toggle')" 
        class="transition-transform duration-300"
      />
      <IconButton 
        icon="search" 
        v-if="!truncated" 
        class="transition-opacity duration-300" 
      />
      <IconButton 
        icon="plus" 
        v-if="!truncated" 
        class="transition-opacity duration-300" 
      />
    </div>

    <!-- NavBar Items -->
    <nav :class="[
      'flex-1 flex flex-col gap-4 py-4 transition-all duration-300 w-full',
      truncated ? 'items-center' : ''
    ]">
      <NavItem 
        icon="star" 
        label="Smart Recommend" 
        :active="activeItem === 'smart-recommend'"
        :truncated="truncated"
        @click="setActiveItem('smart-recommend')"
        class="transition-all duration-300"
      />
      <NavItem 
        icon="file" 
        label="Recipe" 
        :active="activeItem === 'recipe'"
        :truncated="truncated"
        @click="setActiveItem('recipe')"
        class="transition-all duration-300"
      />
      <NavItem 
        icon="shopping-cart" 
        label="Groceries" 
        :active="activeItem === 'groceries'"
        :truncated="truncated"
        @click="setActiveItem('groceries')"
        class="transition-all duration-300"
      />
      <NavItem 
        icon="calendar" 
        label="Meal Plan" 
        :active="activeItem === 'meal-plan'"
        :truncated="truncated"
        @click="setActiveItem('meal-plan')"
        class="transition-all duration-300"
      />
    </nav>

    <!-- NavBar Footer -->
    <div :class="[
      'flex items-center justify-start py-3 transition-all duration-300 w-full',
    ]">
      <IconButton icon="cog" />
    </div>
  </aside>
</template>