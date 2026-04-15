<template>
  <div class="min-h-screen bg-[var(--color-surface)]">
    <header
      class="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
    >
      <UContainer class="flex items-center gap-2 py-3 sm:gap-3">
        <NuxtLink
          to="/"
          class="shrink-0 text-lg font-semibold text-[var(--color-brand)]"
        >
          My E
        </NuxtLink>

        <UInput
          v-model="searchQuery"
          class="min-w-0 flex-1"
          placeholder="Search products..."
          leading-icon="i-lucide-search"
          size="md"
          clearable
          @clear="searchQuery = ''"
          :ui="{
            base: 'bg-[var(--color-background)] ring-[var(--color-border)] text-[var(--color-text-input)] placeholder:text-[var(--color-text-input-placeholder)] focus-visible:ring-[var(--color-border)]',
            leadingIcon: 'text-[var(--color-icon-input)] size-4'
       
          }"
        >
        <template v-if="searchQuery?.length" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear input"
            @click="searchQuery = ''"
          />
        </template>
        </UInput>

        <div class="flex shrink-0 items-center gap-0.5">
          <div class="md:hidden">
            <USlideover
              v-model:open="menuOpen"
              title="Categories"
              side="right"
              :ui="{ content: 'bg-[var(--color-surface)] max-w-[min(100vw,20rem)]' }"
            >
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-menu"
                aria-label="Open menu"
                square
                :ui="{
                  base: 'hover:bg-[var(--color-background)] active:bg-[var(--color-background)] text-[var(--color-text)] hover:text-[var(--color-text-input)]'
                }"
              />

              <template #body>
                <nav class="flex flex-col gap-1" aria-label="Categories">
                  <NuxtLink
                    v-for="item in categories"
                    :key="item.to"
                    :to="item.to"
                    class="rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    :class="isActive(item)
                      ? 'bg-[var(--color-surface)] text-[var(--color-brand)] font-semibold'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'"
                    @click="menuOpen = false"
                  >
                    {{ item.label }}
                  </NuxtLink>
                </nav>

                <hr class="my-3 border-[var(--color-border)]" />

                <NuxtLink
                  to="/orders"
                  class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  :class="route.path === '/orders'
                    ? 'bg-[var(--color-surface)] text-[var(--color-brand)] font-semibold'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'"
                  @click="menuOpen = false"
                >
                  <UIcon name="i-lucide-package" class="h-4 w-4" />
                  My orders
                </NuxtLink>
              </template>
            </USlideover>
          </div>

          <UButton
            color="neutral"
            variant="ghost"
            :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            aria-label="Toggle theme"
            square
            :ui="{
              base: 'hover:bg-[var(--color-background)] active:bg-[var(--color-background)] text-[var(--color-text)] hover:text-[var(--color-text-input)]'
            }"
            @click="toggleTheme"
          />

          <USlideover
            v-model:open="cartOpen"
            title="Your cart"
            side="right"
            :ui="{ content: 'bg-[var(--color-surface-elevated)] max-w-[min(100vw,24rem)]' }"
          >
            <div class="relative">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-shopping-cart"
                aria-label="Shopping cart"
                square
                :ui="{
                  base: 'hover:bg-[var(--color-background)] active:bg-[var(--color-background)] text-[var(--color-text)] hover:text-[var(--color-text-input)]'
                }"
              />
              <Transition name="badge">
                <span
                  v-if="cartStore.totalItems > 0"
                  class="pointer-events-none absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-bold text-[var(--color-text-rounded-label)]"
                >
                  {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
                </span>
              </Transition>
            </div>

            <template #body>
              <!-- Empty state -->
              <div
                v-if="cartStore.items.length === 0"
                class="flex flex-col items-center gap-3 py-16 text-center"
              >
                <UIcon name="i-lucide-shopping-cart" class="h-12 w-12 text-[var(--color-muted)]" />
                <p class="text-sm font-medium text-[var(--color-text)]">Your cart is empty</p>
                <p class="text-xs text-[var(--color-muted)]">Add some products to get started</p>
              </div>

              <!-- Cart items -->
              <ul v-else class="flex flex-col divide-y divide-[var(--color-border)]">
                <li
                  v-for="item in cartStore.items"
                  :key="item.productId"
                  class="flex items-start gap-3 py-4"
                >
                  <NuxtImg
                    :src="productsStore.getById(item.productId)?.images[0] ?? ''"
                    :alt="productsStore.getById(item.productId)?.name ?? ''"
                    class="h-16 w-16 shrink-0 rounded-lg object-cover"
                    format="webp"
                    loading="lazy"
                  />

                  <div class="flex flex-1 flex-col gap-1 min-w-0">
                    <NuxtLink
                      :to="`/products/${item.productId}`"
                      class="line-clamp-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-brand)] transition-colors"
                      @click="cartOpen = false"
                    >
                      {{ productsStore.getById(item.productId)?.name }}
                    </NuxtLink>
                    <p class="text-xs text-[var(--color-muted)]">
                      ${{ productsStore.getById(item.productId)?.price.toFixed(2) }} each
                    </p>

                    <div class="flex items-center gap-2 pt-1">
                      <UButton
                        icon="i-lucide-minus"
                        color="neutral"
                        variant="outline"
                        size="xs"
                        square
                        aria-label="Decrease quantity"
                        @click="cartStore.updateQuantity(item.productId, item.quantity - 1)"
                      />
                      <span class="min-w-5 text-center text-sm font-semibold text-[var(--color-text)]">
                        {{ item.quantity }}
                      </span>
                      <UButton
                        icon="i-lucide-plus"
                        color="neutral"
                        variant="outline"
                        size="xs"
                        square
                        aria-label="Increase quantity"
                        @click="cartStore.add(item.productId)"
                      />
                    </div>
                  </div>

                  <div class="flex flex-col items-end gap-2 shrink-0">
                    <span class="text-sm font-bold text-[var(--color-brand)]">
                      ${{ ((productsStore.getById(item.productId)?.price ?? 0) * item.quantity).toFixed(2) }}
                    </span>
                    <UButton
                      icon="i-lucide-trash-2"
                      color="error"
                      variant="ghost"
                      size="xs"
                      square
                      aria-label="Remove item"
                      @click="cartStore.remove(item.productId)"
                    />
                  </div>
                </li>
              </ul>
            </template>

            <template v-if="cartStore.items.length > 0" #footer>
              <div class="flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[var(--color-muted)]">
                    {{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'item' : 'items' }}
                  </span>
                  <span class="text-lg font-bold text-[var(--color-text)]">
                    ${{ cartStore.totalPrice.toFixed(2) }}
                  </span>
                </div>
                <UButton
                  color="neutral"
                  variant="solid"
                  size="lg"
                  icon="i-lucide-package-check"
                  class="w-full justify-center bg-[var(--color-brand)] text-[var(--color-text-button)] hover:opacity-90"
                  @click="handlePlaceOrder"
                >
                  Create order
                </UButton>
                <UButton
                  color="neutral"
                  variant="outline"
                  size="lg"
                  icon="i-lucide-credit-card"
                  class="w-full justify-center"
                  @click="cartStore.clearCart()"
                  aria-label="Clear cart"
                  :ui="{
                    base: 'bg-transparent rounded-[var(--color-border)]-rounded-md text-[var(--color-text)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)] text-[var(--color-text)] hover:text-[var(--color-text-input)]'
                  }"
                >
                  Clear cart
                </UButton>
              </div>
            </template>
          </USlideover>
        </div>
      </UContainer>
    </header>

    <nav
      class="hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] md:block"
      aria-label="Product categories"
    >
      <UContainer>
        <div class="flex items-center justify-between py-2">
          <div class="flex flex-wrap gap-1 sm:gap-6">
            <NuxtLink
              v-for="item in categories"
              :key="'bar-' + item.to"
              :to="item.to"
              class="text-sm font-medium transition-colors"
              :class="isActive(item)
                ? 'text-[var(--color-brand)] border-b-2 border-[var(--color-brand)] pb-0.5'
                : 'text-[var(--color-muted)] hover:text-[var(--color-brand)]'"
            >
              {{ item.label }}
            </NuxtLink>
          </div>

          <NuxtLink
            to="/orders"
            class="flex items-center gap-1.5 text-sm font-medium transition-colors"
            :class="route.path === '/orders'
              ? 'text-[var(--color-brand)]'
              : 'text-[var(--color-muted)] hover:text-[var(--color-brand)]'"
          >
            <UIcon name="i-lucide-package" class="h-4 w-4" />
            My orders
          </NuxtLink>
        </div>
      </UContainer>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useProductsStore } from '~/stores/products'

const colorMode = useColorMode()
const cartStore = useCartStore()
const productsStore = useProductsStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const cartOpen = ref(false)
const searchQuery = ref(typeof route.query.search === 'string' ? route.query.search : '')

watch(searchQuery, (val) => {
  router.push({ query: { ...route.query, search: val || undefined } })
})

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function handlePlaceOrder() {
  const orderId = cartStore.placeOrder()
  cartOpen.value = false
  toast.add({
    title: 'Order placed!',
    description: `Order #${orderId} has been created. You can view it in My orders.`,
    icon: 'i-lucide-package-check',
    color: 'success',
    actions: [{
      label: 'View orders',
      color: 'neutral',
      variant: 'outline',
      onClick: (e: MouseEvent) => {
        e?.stopPropagation()
        navigateTo('/orders')
      },
    }],
    ui: {
      root: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)]',
      icon: 'text-[var(--color-brand)]',
      title: 'text-[var(--color-brand)]',
      description: 'text-[var(--color-brand)]',
      actions: 'text-[var(--color-brand)]',
      progress: 'bg-[var(--color-brand)]',
    }
  })
}

const categories = [
  { label: 'All', to: '/' },
  { label: 'Electronics', to: '/?category=electronics' },
  { label: "Men's Clothing", to: "/?category=men's clothing" },
  { label: "Women's Clothing", to: "/?category=women's clothing" },
  { label: 'Jewelery', to: '/?category=jewelery' },
]

function isActive(item: { label: string; to: string }) {
  if (item.label === 'All') return !route.query.category
  return route.query.category === item.label.toLowerCase()
}
</script>

<style scoped>
.badge-enter-active,
.badge-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.badge-enter-from,
.badge-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
