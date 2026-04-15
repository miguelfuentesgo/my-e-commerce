<template>
  <UContainer class="py-8">
    <!-- Not found -->
    <div v-if="!product" class="flex flex-col items-center gap-4 py-20 text-center">
      <span class="i-lucide-package-x block h-16 w-16 text-[var(--color-muted)]" />
      <h1 class="text-2xl font-semibold text-[var(--color-text)]">Product not found</h1>
      <NuxtLink to="/" class="text-sm text-[var(--color-brand)] hover:underline">
        Back to shop
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <nav class="mb-6 flex items-center gap-2 text-sm text-[var(--color-muted)]">
        <NuxtLink to="/" class="hover:text-[var(--color-brand)] transition-colors">Home</NuxtLink>
        <span>/</span>
        <NuxtLink
          :to="`/?category=${product.category.toLowerCase()}`"
          class="hover:text-[var(--color-brand)] transition-colors"
        >{{ product.category }}</NuxtLink>
        <span>/</span>
        <span class="text-[var(--color-text)]">{{ product.name }}</span>
      </nav>

      <!-- Main detail section -->
      <div class="flex flex-col gap-8 lg:flex-row">
        <!-- Image gallery -->
        <div class="w-full lg:w-1/2">
          <div class="group relative overflow-hidden rounded-2xl bg-[var(--color-surface)]" style="aspect-ratio: 4/3;">
            <Transition name="fade" mode="out-in">
              <NuxtImg
                :key="currentIndex"
                :src="product.images[currentIndex]"
                :alt="`${product.name} – image ${currentIndex + 1}`"
                class="h-full w-full object-cover"
                loading="eager"
                format="webp"
              />
            </Transition>

            <template v-if="product.images.length > 1">
              <UButton
                icon="i-lucide-chevron-left"
                class="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-full bg-black/40 text-white hover:bg-black/60"
                color="neutral"
                variant="ghost"
                square
                size="sm"
                aria-label="Previous image"
                @click="prevImage"
              />
              <UButton
                icon="i-lucide-chevron-right"
                class="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-full bg-black/40 text-white hover:bg-black/60"
                color="neutral"
                variant="ghost"
                square
                size="sm"
                aria-label="Next image"
                @click="nextImage"
              />
   
            </template>
          </div>

          <!-- Thumbnails -->
          <div v-if="product.images.length > 1" class="mt-3 flex gap-2">
            <button
              v-for="(img, i) in product.images"
              :key="i"
              class="h-16 w-16 overflow-hidden rounded-lg border-2 transition-all"
              :class="i === currentIndex
                ? 'border-[var(--color-brand)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'"
              :aria-label="`View image ${i + 1}`"
              @click="currentIndex = i"
            >
              <NuxtImg
                :src="img"
                :alt="`${product.name} thumbnail ${i + 1}`"
                class="h-full w-full object-cover"
                loading="lazy"
                format="webp"
              />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div class="flex flex-1 flex-col gap-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                {{ product.category }}
              </p>
              <h1 class="text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
                {{ product.name }}
              </h1>
            </div>
            <span
              v-if="product.badge"
              class="shrink-0 rounded-full bg-[var(--color-brand)] px-3 py-1 text-xs font-semibold text-[var(--color-text-rounded-label)]"
            >
              {{ product.badge }}
            </span>
          </div>

          <!-- Rating -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-0.5">
              <span
                v-for="star in 5"
                :key="star"
                class="text-lg"
                :class="star <= Math.round(product.rating)
                  ? 'text-[var(--color-brand)]'
                  : 'text-[var(--color-border)]'"
              >★</span>
            </div>
            <span class="text-sm text-[var(--color-muted)]">{{ product.rating.toFixed(1) }} out of 5</span>
          </div>

          <!-- Price -->
          <p class="text-3xl font-bold text-[var(--color-brand)]">
            ${{ product.price.toFixed(2) }}
          </p>

          <!-- Description -->
          <p class="text-sm leading-relaxed text-[var(--color-muted)]">
            {{ product.description }}
          </p>

          <!-- Cart controls -->
          <div class="mt-2 flex items-center gap-3">
            <div v-if="cartQty > 0" class="flex items-center gap-2">
              <UButton
                color="neutral"
                variant="outline"
                size="lg"
                icon="i-lucide-minus"
                aria-label="Decrease quantity"
                class="rounded-full h-10 w-10"
                @click="cartStore.updateQuantity(product.id, cartQty - 1)"
              />
              <span class="min-w-[2rem] text-center text-lg font-semibold text-[var(--color-text)]">
                {{ cartQty }}
              </span>
              <UButton
                color="neutral"
                variant="outline"
                size="lg"
                icon="i-lucide-plus"
                aria-label="Increase quantity"
                class="rounded-full h-10 w-10"
           
                @click="cartStore.add(product.id)"
              />
     
            </div>

            <UButton
              v-else
              color="neutral"
              variant="solid"
              size="lg"
              icon="i-lucide-shopping-cart"
              class="bg-[var(--color-brand)] text-[var(--color-text-button)] hover:opacity-90"
              @click="cartStore.add(product.id)"
            >
              Add to cart
            </UButton>

            <span v-if="cartQty > 0" class="text-sm text-[var(--color-muted)]">
              in your cart
            </span>
          </div>
        </div>
      </div>

      <!-- Related products -->
      <div v-if="relatedProducts.length" class="mt-16">
        <h2 class="mb-6 text-xl font-semibold text-[var(--color-text)]">
          More in {{ product.category }}
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ProductCard
            v-for="related in relatedProducts"
            :key="related.id"
            :id="related.id"
            :name="related.name"
            :description="related.description"
            :price="related.price"
            :rating="related.rating"
            :images="related.images"
            :category="related.category"
            :badge="related.badge"
          />
        </div>
      </div>
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

useProducts()

const productId = computed(() => Number(route.params.id))
const product = computed(() => productsStore.getById(productId.value))

const relatedProducts = computed(() =>
  product.value
    ? productsStore.getByCategory(product.value.category, product.value.id)
    : [],
)

const cartQty = computed(() =>
  product.value ? cartStore.getQuantity(product.value.id) : 0,
)

const currentIndex = ref(0)

watch(productId, () => { currentIndex.value = 0 })

function prevImage() {
  if (!product.value) return
  currentIndex.value = (currentIndex.value - 1 + product.value.images.length) % product.value.images.length
}

function nextImage() {
  if (!product.value) return
  currentIndex.value = (currentIndex.value + 1) % product.value.images.length
}

useHead({
  title: computed(() => product.value ? product.value.name : 'Product not found'),
})
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
