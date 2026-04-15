<template>
  <div
    class="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition-shadow hover:shadow-lg"
    :class="layout === 'horizontal' ? 'flex flex-row' : 'flex flex-col'"
  >
    <!-- Image gallery -->
    <div
      class="group relative shrink-0 overflow-hidden bg-[var(--color-surface)]"
      :class="layout === 'horizontal' ? 'w-48 sm:w-56' : 'h-52 w-full'"
    >
      <NuxtLink :to="`/products/${id}`" class="block h-full w-full">
        <Transition name="fade" mode="out-in">
          <NuxtImg
            :key="currentIndex"
            :src="images[currentIndex]"
            :alt="`${name} – image ${currentIndex + 1}`"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            format="webp"
          />
        </Transition>
      </NuxtLink>

      <!-- Arrows (visible on hover, only when multiple images) -->
      <template v-if="images.length > 1">
        <UButton
          icon="i-lucide-chevron-left"
          class="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-full bg-black/40 text-white hover:bg-black/60"
          color="neutral"
          variant="ghost"
          square
          size="xs"
          aria-label="Previous image"
          @click.prevent="prev"
        />
        <UButton
          icon="i-lucide-chevron-right"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-full bg-black/40 text-white hover:bg-black/60"
          color="neutral"
          variant="ghost"
          square
          size="xs"
          aria-label="Next image"
          @click.prevent="next"
        />

        <!-- Dot indicators -->
        <div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          <span
            v-for="(_, i) in images"
            :key="i"
            class="block h-1.5 rounded-full transition-all duration-300"
            :class="i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'"
          />
        </div>
      </template>

      <!-- Badge -->
      <div class="absolute left-2 top-2">
        <span
          v-if="badge"
          class="rounded-full bg-[var(--color-brand)] px-2 py-0.5 text-xs font-semibold text-[var(--color-text-rounded-label)]"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-1 flex-col gap-2 p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
        {{ category }}
      </p>

      <NuxtLink :to="`/products/${id}`">
        <h3 class="line-clamp-2 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-brand)] transition-colors">
          {{ name }}
        </h3>
      </NuxtLink>

      <p class="line-clamp-2 text-xs text-[var(--color-muted)]">
        {{ description }}
      </p>

      <div class="mt-auto flex items-center justify-between pt-3">
        <div class="flex flex-col">
          <span class="text-lg font-bold text-[var(--color-brand)]">
            ${{ price.toFixed(2) }}
          </span>
          <div class="flex items-center gap-1">
            <span
              v-for="star in 5"
              :key="star"
              class="text-sm"
              :class="star <= Math.round(rating) ? 'text-[var(--color-brand)]' : 'text-[var(--color-border)]'"
            >★</span>
            <span class="ml-1 text-xs text-[var(--color-muted)]">({{ rating.toFixed(1) }})</span>
          </div>
        </div>

        <!-- Add to cart / quantity controls -->
        <div v-if="cartQty > 0" class="flex items-center gap-1">
          <UButton
            icon="i-lucide-minus"
            color="neutral"
            variant="outline"
            size="xs"
            square
            aria-label="Decrease quantity"
            @click="cartStore.updateQuantity(id, cartQty - 1)"
          />
          <span class="min-w-5 text-center text-sm font-semibold text-[var(--color-text)]">
            {{ cartQty }}
          </span>
          <UButton
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            size="xs"
            square
            aria-label="Increase quantity"
            @click="cartStore.add(id)"
          />
        </div>

        <UButton
          v-else
          color="neutral"
          variant="solid"
          size="sm"
          icon="i-lucide-shopping-cart"
          class="bg-[var(--color-brand)] text-[var(--color-text-button)] hover:opacity-90"
          @click="cartStore.add(id)"
        >
          Add
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const props = withDefaults(defineProps<{
  id: number
  name: string
  description: string
  price: number
  rating: number
  images: string[]
  category?: string
  badge?: string
  layout?: 'vertical' | 'horizontal'
}>(), {
  category: 'General',
  layout: 'vertical',
})

const cartStore = useCartStore()
const cartQty = computed(() => cartStore.getQuantity(props.id))

const currentIndex = ref(0)

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
