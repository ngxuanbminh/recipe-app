<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
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

// Use the route to determine which item is active
const route = useRoute();

// Determine which nav item is active based on current route
const activeItem = computed(() => {
  const path = route.path;
  if (path === '/') return 'smart-recommend';
  if (path.startsWith('/recipe')) return 'recipe';
  if (path.startsWith('/groceries')) return 'groceries';
  if (path.startsWith('/meal-plan')) return 'meal-plan';
  if (path.startsWith('/chat')) return 'chat';
  return '';
});
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
      <RouterLink to="/chat" custom v-slot="{ navigate }">
        <NavItem 
          icon="comments" 
          label="Chat" 
          :active="activeItem === 'chat'"
          :truncated="truncated"
          @click="navigate"
          class="transition-all duration-300"
        />
      </RouterLink>
      
      <RouterLink to="/recipe" custom v-slot="{ navigate }">
        <NavItem 
          icon="file" 
          label="Recipe" 
          :active="activeItem === 'recipe'"
          :truncated="truncated"
          @click="navigate"
          class="transition-all duration-300"
        />
      </RouterLink>
      
      <RouterLink to="/groceries" custom v-slot="{ navigate }">
        <NavItem 
          icon="shopping-cart" 
          label="Groceries" 
          :active="activeItem === 'groceries'"
          :truncated="truncated"
          @click="navigate"
          class="transition-all duration-300"
        />
      </RouterLink>
      
      <RouterLink to="/meal-plan" custom v-slot="{ navigate }">
        <NavItem 
          icon="calendar" 
          label="Meal Plan" 
          :active="activeItem === 'meal-plan'"
          :truncated="truncated"
          @click="navigate"
          class="transition-all duration-300"
        />
      </RouterLink>
    </nav>

    <!-- NavBar Footer -->
    <div :class="[
      'flex items-center justify-start py-3 transition-all duration-300 w-full',
    ]">
      <IconButton icon="cog" />
    </div>
  </aside>
</template>