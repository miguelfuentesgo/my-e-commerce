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
          Shop
        </NuxtLink>

        <UInput
          v-model="searchQuery"
          class="min-w-0 flex-1"
          placeholder="Search products..."
          leading-icon="i-lucide-search"
          size="md"
          :ui="{
            base: 'bg-[var(--color-background)] ring-[var(--color-border)] text-[var(--color-text-input)] placeholder:text-[var(--color-text-input-placeholder)] focus-visible:ring-[var(--color-border)]',
            leadingIcon: 'text-[var(--color-icon-input)] size-4'
       
          }"
        />

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
                  base: 'hover:bg-slate-100 active:bg-slate-200 text-slate-400 hover:text-slate-500'
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
        </div>
      </UContainer>
    </header>

    <nav
      class="hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] md:block"
      aria-label="Product categories"
    >
      <UContainer>
        <div class="flex flex-wrap gap-1 py-2 sm:gap-6">
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
      </UContainer>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const menuOpen = ref(false)
const searchQuery = ref('')

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const route = useRoute()

const categories = [
  { label: 'All', to: '/' },
  { label: 'Electronics', to: '/?category=electronics' },
  { label: 'Accessories', to: '/?category=accessories' },
  { label: 'Lifestyle', to: '/?category=lifestyle' },
  { label: 'Sport', to: '/?category=sport' },
]

function isActive(item: { label: string; to: string }) {
  if (item.label === 'All') return !route.query.category
  return route.query.category === item.label.toLowerCase()
}
</script>
