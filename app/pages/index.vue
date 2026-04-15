<template>
  <UContainer class="py-8">
    <AppBanner
      v-if="!activeCategory"
      class="mb-10"
      :products="products
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)"
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
const route = useRoute()
const listLayout = ref<'vertical' | 'horizontal'>('vertical')

const activeCategory = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : null
)

const filteredProducts = computed(() => {
  if (!activeCategory.value) return products
  return products.filter(p => p.category.toLowerCase() === activeCategory.value)
})

const headingLabel = computed(() => {
  if (!activeCategory.value) return 'Featured Products'
  return activeCategory.value.charAt(0).toUpperCase() + activeCategory.value.slice(1)
})

const products = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and foldable design for travel.',
    price: 129.99,
    rating: 4.7,
    category: 'Electronics',
    badge: 'Best Seller',
    images: [
      'https://picsum.photos/seed/headphones/400/300',
      'https://picsum.photos/seed/headphones2/400/300',
      'https://picsum.photos/seed/headphones3/400/300',
    ],
  },
  {
    id: 2,
    name: 'Minimalist Leather Wallet',
    description: 'Slim RFID-blocking bifold wallet crafted from full-grain leather. Fits up to 8 cards and cash.',
    price: 49.95,
    rating: 4.3,
    category: 'Accessories',
    badge: undefined,
    images: [
      'https://picsum.photos/seed/wallet/400/300',
      'https://picsum.photos/seed/wallet2/400/300',
    ],
  },
  {
    id: 3,
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall insulated bottle keeps drinks cold 24h and hot 12h. BPA-free, leak-proof lid.',
    price: 34.99,
    rating: 4.8,
    category: 'Lifestyle',
    badge: 'New',
    images: [
      'https://picsum.photos/seed/bottle/400/300',
      'https://picsum.photos/seed/bottle2/400/300',
      'https://picsum.photos/seed/bottle3/400/300',
    ],
  },
  {
    id: 4,
    name: 'Mechanical Keyboard TKL',
    description: 'Tenkeyless mechanical keyboard with Cherry MX switches, RGB backlight, and aluminium frame.',
    price: 89.00,
    rating: 4.5,
    category: 'Electronics',
    badge: undefined,
    images: [
      'https://picsum.photos/seed/keyboard/400/300',
      'https://picsum.photos/seed/keyboard2/400/300',
    ],
  },
  {
    id: 5,
    name: 'Yoga Mat Premium',
    description: 'Eco-friendly non-slip yoga mat, 6mm thick with alignment lines. Includes carry strap.',
    price: 45.00,
    rating: 4.2,
    category: 'Sport',
    badge: 'Sale',
    images: [
      'https://picsum.photos/seed/yogamat/400/300',
      'https://picsum.photos/seed/yogamat2/400/300',
      'https://picsum.photos/seed/yogamat3/400/300',
    ],
  },
  {
    id: 6,
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Handcrafted ceramic dripper and server set. Includes paper filters. Brews 1–4 cups.',
    price: 62.50,
    rating: 4.9,
    category: 'Kitchen',
    badge: undefined,
    images: [
      'https://picsum.photos/seed/coffee/400/300',
      'https://picsum.photos/seed/coffee2/400/300',
    ],
  },
  {
    id: 7,
    name: 'Running Sneakers Pro',
    description: 'Lightweight breathable running shoes with responsive foam sole and reflective details for night runs.',
    price: 110.00,
    rating: 4.6,
    category: 'Sport',
    badge: 'New',
    images: [
      'https://picsum.photos/seed/sneakers/400/300',
      'https://picsum.photos/seed/sneakers2/400/300',
      'https://picsum.photos/seed/sneakers3/400/300',
    ],
  },
  {
    id: 8,
    name: 'Bamboo Desk Organizer',
    description: 'Sustainable bamboo organizer with 5 compartments for pens, cables, and desk accessories.',
    price: 27.99,
    rating: 3.9,
    category: 'Office',
    badge: undefined,
    images: [
      'https://picsum.photos/seed/organizer/400/300',
      'https://picsum.photos/seed/organizer2/400/300',
    ],
  },
  {
    id: 9,
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof IPX7 speaker with 360° sound, 20h playtime, and built-in power bank.',
    price: 79.99,
    rating: 4.4,
    category: 'Electronics',
    badge: 'Sale',
    images: [
      'https://picsum.photos/seed/speaker/400/300',
      'https://picsum.photos/seed/speaker2/400/300',
      'https://picsum.photos/seed/speaker3/400/300',
    ],
  },
  {
    id: 10,
    name: 'Linen Throw Blanket',
    description: 'Soft stonewashed linen throw, 130×170 cm. Available in 6 neutral tones. Machine washable.',
    price: 58.00,
    rating: 4.1,
    category: 'Home',
    badge: undefined,
    images: [
      'https://picsum.photos/seed/blanket/400/300',
      'https://picsum.photos/seed/blanket2/400/300',
    ],
  },
]
</script>
