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
    class="flex flex-col bg-[var(--color-primary)] h-full border-r border-[var(--color-tertiary)]" 
    :class="truncated ? 'w-[72px]' : 'w-[225px]'"
  >
    <!-- NavBar Header -->
    <div :class="[
      'flex items-center py-3 px-2 border-b border-[var(--color-tertiary)]',
      truncated ? 'justify-center' : 'justify-between'
    ]">
      <IconButton 
        :icon="truncated ? 'angle-double-right' : 'angle-double-left'" 
        @click="$emit('toggle')" 
      />
      <IconButton icon="search" v-if="!truncated" />
      <IconButton icon="plus" v-if="!truncated" />
    </div>

    <!-- NavBar Items -->
    <nav :class="[
      'flex-1 flex flex-col gap-4 py-4',
      truncated ? 'items-center px-0' : 'px-2'
    ]">
      <NavItem 
        icon="star" 
        label="Smart Recommend" 
        :active="activeItem === 'smart-recommend'"
        :truncated="truncated"
        @click="setActiveItem('smart-recommend')"
      />
      <NavItem 
        icon="file" 
        label="Recipe" 
        :active="activeItem === 'recipe'"
        :truncated="truncated"
        @click="setActiveItem('recipe')"
      />
      <NavItem 
        icon="shopping-cart" 
        label="Groceries" 
        :active="activeItem === 'groceries'"
        :truncated="truncated"
        @click="setActiveItem('groceries')"
      />
      <NavItem 
        icon="calendar" 
        label="Meal Plan" 
        :active="activeItem === 'meal-plan'"
        :truncated="truncated"
        @click="setActiveItem('meal-plan')"
      />
    </nav>

    <!-- NavBar Footer -->
    <div :class="[
      'flex items-center py-3 px-2 border-t border-[var(--color-tertiary)]',
      truncated ? 'justify-center' : 'justify-start'
    ]">
      <IconButton icon="cog" />
    </div>
  </aside>
</template>