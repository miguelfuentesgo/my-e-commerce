<template>
  <UContainer class="py-8">
    <!-- Error state -->
    <div v-if="error" class="flex flex-col items-center gap-4 py-20 text-center">
      <span class="i-lucide-wifi-off block h-12 w-12 text-[var(--color-muted)]" />
      <p class="text-sm text-[var(--color-muted)]">Failed to load products. Please try again later.</p>
    </div>

    <template v-else>
      <AppBanner
        v-if="!activeCategory && !activeSearch && featuredBannerProducts.length"
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
      <!-- Loading skeleton -->
      <div
        v-if="status !== 'success'"
        :class="listLayout === 'vertical'
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'flex flex-col gap-4'"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="animate-pulse overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
        >
          <div class="h-52 bg-[var(--color-surface)]" />
          <div class="flex flex-col gap-2 p-4">
            <div class="h-3 w-1/3 rounded bg-[var(--color-surface)]" />
            <div class="h-4 w-3/4 rounded bg-[var(--color-surface)]" />
            <div class="h-3 w-full rounded bg-[var(--color-surface)]" />
            <div class="mt-2 h-4 w-1/4 rounded bg-[var(--color-surface)]" />
          </div>
        </div>
      </div>

      <!-- Products grid -->
      <div
        v-else
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
        <p
          v-if="!filteredProducts.length"
          class="col-span-full py-20 text-center text-sm text-[var(--color-muted)]"
        >
          No products found.
        </p>
      </div>
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'

const route = useRoute()
const productsStore = useProductsStore()
const listLayout = ref<'vertical' | 'horizontal'>('vertical')

const { status, error } = useProducts()

const activeCategory = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : null,
)

const activeSearch = computed(() =>
  typeof route.query.search === 'string' ? route.query.search.toLowerCase().trim() : '',
)

const filteredProducts = computed(() => {
  return productsStore.products.filter(p => {
    const matchesCategory = !activeCategory.value || p.category.toLowerCase() === activeCategory.value
    const matchesSearch = !activeSearch.value ||
      p.name.toLowerCase().includes(activeSearch.value) ||
      p.category.toLowerCase().includes(activeSearch.value)
    return matchesCategory && matchesSearch
  })
})

const featuredBannerProducts = computed(() =>
  [...productsStore.products].sort(() => Math.random() - 0.5).slice(0, 3),
)

const headingLabel = computed(() => {
  if (activeSearch.value) return `Results for "${route.query.search}"`
  if (!activeCategory.value) return 'Featured Products'
  return activeCategory.value.charAt(0).toUpperCase() + activeCategory.value.slice(1)
})
</script>
