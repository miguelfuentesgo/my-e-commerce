<template>
  <div class="relative overflow-hidden rounded-2xl">
    <!-- Slides track -->
    <div
      class="flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <!-- Slide 0: main promo -->
      <div class="relative w-full shrink-0 bg-[var(--color-brand)]">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white" />
          <div class="absolute -bottom-16 left-1/3 h-80 w-80 rounded-full bg-white" />
          <div class="absolute right-1/4 top-1/2 h-40 w-40 rounded-full bg-white" />
        </div>
        <div class="relative flex flex-col items-start gap-4 px-8 py-12 sm:px-14 sm:py-16 md:max-w-2xl">
          <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-rounded-label)]">
            {{ badge }}
          </span>
          <h1 class="text-3xl font-semibold leading-tight text-[var(--color-text-rounded-label)] sm:text-4xl lg:text-5xl">
            {{ title }}
          </h1>
            <p class="text-base text-[var(--color-text-rounded-label)] sm:text-lg">
              {{ subtitle }}
          </p>
          <UButton
            color="neutral"
            variant="solid"
            size="lg"
            class="mt-2 bg-white font-semibold text-[var(--color-brand)] hover:bg-white/90"
          >
            {{ cta }}
          </UButton>
        </div>
      </div>

      <!-- Slides 1–3: featured products -->
      <div
        v-for="product in featuredProducts"
        :key="product.id"
        class="relative w-full shrink-0 bg-[var(--color-brand)]"
      >
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white" />
          <div class="absolute -bottom-16 right-1/3 h-80 w-80 rounded-full bg-white" />
        </div>

        <div class="relative flex h-full flex-col sm:flex-row">
          <!-- Image -->
          <div class="h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-1/2">
            <NuxtImg
              :src="product.images[0]"
              :alt="product.name"
              class="h-full w-full object-cover"
              loading="eager"
              format="webp"
            />
          </div>

          <!-- Info -->
          <div class="flex flex-1 flex-col items-start justify-center gap-3 px-8 py-10 sm:px-10 sm:py-14">
            <span
              v-if="product.badge"
              class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-rounded-label)]"
            >
              {{ product.badge }}
            </span>
            <span class="text-xs font-medium uppercase tracking-wide text-[var(--color-text-rounded-label)]">
              {{ product.category }}
            </span>
            <h2 class="text-2xl font-semibold leading-tight text-[var(--color-text-rounded-label)] sm:text-3xl">
              {{ product.name }}
            </h2>
            <p class="line-clamp-2 text-sm text-[var(--color-text-rounded-label)]">
              {{ product.description }}
            </p>
            <div class="flex items-center gap-3 pt-1">
              <span class="text-2xl font-bold text-[var(--color-text-rounded-label)]">${{ product.price.toFixed(2) }}</span>
              <div class="flex items-center gap-0.5">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-sm"
                  :class="star <= Math.round(product.rating) ? 'text-[var(--color-text-rounded-label)]' : 'text-[var(--color-text-input-placeholder)]'"
                >★</span>
              </div>
            </div>
            <UButton
              color="neutral"
              variant="solid"
              size="lg"
              class="mt-1 bg-white font-semibold text-[var(--color-brand)] hover:bg-white/90"
            >
              Shop now
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Dot indicators -->
    <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
      <button
        v-for="(_, i) in totalSlides"
        :key="i"
        class="h-2 rounded-full transition-all duration-300"
        :class="current === i ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'"
        :aria-label="`Go to slide ${i + 1}`"
        @click="goTo(i)"
      />
    </div>

    <!-- Prev / Next arrows -->
    <UButton
      color="neutral"
      variant="solid"
      size="sm"
      icon="i-lucide-chevron-left"
      class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/40"
      aria-label="Previous slide"
      @click="prev"
    />
    <UButton
      color="neutral"
      variant="solid"
      size="sm"
      icon="i-lucide-chevron-right"
      class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/40"
      aria-label="Next slide"
      @click="next"
    />
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  description: string
  price: number
  rating: number
  images: string[]
  category: string
  badge?: string
}

const props = withDefaults(defineProps<{
  badge?: string
  title?: string
  subtitle?: string
  cta?: string
  products?: Product[]
}>(), {
  badge: 'New arrivals',
  title: 'Discover our latest collection',
  subtitle: 'Hand-picked products at unbeatable prices. Updated every week.',
  cta: 'Shop now',
  products: () => [],
})

const featuredProducts = computed(() => {
  const shuffled = [...props.products].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
})

const totalSlides = computed(() => 1 + featuredProducts.value.length)
const current = ref(0)

function goTo(index: number) {
  current.value = index
}

function next() {
  current.value = (current.value + 1) % totalSlides.value
}

function prev() {
  current.value = (current.value - 1 + totalSlides.value) % totalSlides.value
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(next, 3000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
