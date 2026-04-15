<template>
  <div
    class="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition-shadow hover:shadow-lg"
    :class="layout === 'horizontal' ? 'flex flex-row' : 'flex flex-col'"
  >
    <div
      class="group relative shrink-0 overflow-hidden bg-[var(--color-surface)]"
      :class="layout === 'horizontal' ? 'w-48 sm:w-56' : 'h-52 w-full'"
    >
      <Transition name="fade" mode="out-in">
        <NuxtImg
          :key="currentIndex"
          :src="images[currentIndex]"
          :alt="`${name} – image ${currentIndex + 1}`"
          class="h-full w-full object-cover"
          loading="lazy"
          format="webp"
        />
      </Transition>

      <!-- Arrows (visible on hover, only when multiple images) -->
      <template v-if="images.length > 1">
        <UButton
          class="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/60 active:bg-black/60"
          aria-label="Previous image"
          icon="i-lucide-chevron-left"

          @click.stop="prev"
        />
        <UButton
          class="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/60 active:bg-black/60"
          aria-label="Next image"
          icon="i-lucide-chevron-right"
          @click.stop="next"
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
          class="rounded-full bg-[var(--color-brand)] px-2 py-0.5 text-xs font-semibold text-white"
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

      <h3 class="line-clamp-2 text-sm font-semibold text-[var(--color-text)]">
        {{ name }}
      </h3>

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

        <UButton
          color="neutral"
          variant="solid"
          size="sm"
          icon="i-lucide-shopping-cart"
          class="bg-[var(--color-brand)] text-white hover:opacity-90"
        >
          Add
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
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
