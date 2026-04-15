<template>
  <UContainer class="py-8">
    <AppBanner
      v-if="!activeCategory"
      class="mb-10"
      :products="featuredBannerProducts"
    />

    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-[var(--color-text)]">{{ headingLabel }}</h2>

      <div class="flex items-center gap-1 rounded-lg border border-[var(--color-border)] p-1">
        <UButton
          size="xs"
          color="neutral"
          :variant="listLayout === 'vertical' ? 'solid' : 'ghost'"
          icon="i-lucide-layout-grid"
          square
          aria-label="Grid view"
          @click="listLayout = 'vertical'"
        />
        <UButton
          size="xs"
          color="neutral"
          :variant="listLayout === 'horizontal' ? 'solid' : 'ghost'"
          icon="i-lucide-layout-list"
          square
          aria-label="List view"
          @click="listLayout = 'horizontal'"
        />
      </div>
    </div>

    <div
      :class="listLayout === 'vertical'
        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'flex flex-col gap-4'"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :id="product.id"
        :name="product.name"
        :description="product.description"
        :price="product.price"
        :rating="product.rating"
        :images="product.images"
        :category="product.category"
        :badge="product.badge"
        :layout="listLayout"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'

const route = useRoute()
const productsStore = useProductsStore()
const listLayout = ref<'vertical' | 'horizontal'>('vertical')

const activeCategory = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : null,
)

const filteredProducts = computed(() => {
  if (!activeCategory.value) return productsStore.products
  return productsStore.products.filter(
    p => p.category.toLowerCase() === activeCategory.value,
  )
})

const featuredBannerProducts = computed(() =>
  [...productsStore.products].sort(() => Math.random() - 0.5).slice(0, 3),
)

const headingLabel = computed(() => {
  if (!activeCategory.value) return 'Featured Products'
  return activeCategory.value.charAt(0).toUpperCase() + activeCategory.value.slice(1)
})
</script>
