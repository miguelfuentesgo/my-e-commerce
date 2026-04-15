<template>
  <UContainer class="py-8">
    <div class="mb-8 flex items-center gap-3">
      <UIcon name="i-lucide-package" class="h-7 w-7 text-[var(--color-brand)]" />
      <h1 class="text-2xl font-semibold text-[var(--color-text)]">My Orders</h1>
    </div>

    <!-- Empty state -->
    <div
      v-if="ordersStore.orders.length === 0"
      class="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-20 text-center"
    >
      <UIcon name="i-lucide-inbox" class="h-16 w-16 text-[var(--color-muted)]" />
      <p class="text-base font-medium text-[var(--color-text)]">No orders yet</p>
      <p class="text-sm text-[var(--color-muted)]">Add products to your cart and place an order to see it here.</p>
      <UButton
        to="/"
        color="neutral"
        variant="solid"
        icon="i-lucide-shopping-bag"
        class="mt-2 bg-[var(--color-brand)] text-white hover:opacity-90"
      >
        Start shopping
      </UButton>
    </div>

    <!-- Orders accordion -->
    <UAccordion
      v-else
      type="multiple"
      :items="accordionItems"
      :ui="{
        item: 'border border-[var(--color-border)] rounded-2xl mb-3 last:mb-0 overflow-hidden',
        trigger: 'px-5 py-4 hover:bg-[var(--color-surface)] rounded-2xl data-[state=open]:rounded-b-none',
        body: 'px-0 pb-0',
      }"
    >
      <template #body="{ item }">
        <div class="border-t border-[var(--color-border)]">
          <!-- Item list -->
          <ul class="divide-y divide-[var(--color-border)]">
            <li
              v-for="orderItem in (item as AccordionOrderItem).order.items"
              :key="orderItem.productId"
              class="flex items-center gap-4 px-5 py-4"
            >
              <NuxtImg
                :src="orderItem.image"
                :alt="orderItem.name"
                class="h-14 w-14 shrink-0 rounded-lg object-cover"
                format="webp"
                loading="lazy"
              />

              <div class="flex flex-1 flex-col gap-0.5 min-w-0">
                <NuxtLink
                  :to="`/products/${orderItem.productId}`"
                  class="line-clamp-1 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-brand)] transition-colors"
                >
                  {{ orderItem.name }}
                </NuxtLink>
                <p class="text-xs text-[var(--color-muted)]">
                  ${{ orderItem.price.toFixed(2) }} × {{ orderItem.quantity }}
                </p>
              </div>

              <span class="shrink-0 text-sm font-semibold text-[var(--color-brand)]">
                ${{ (orderItem.price * orderItem.quantity).toFixed(2) }}
              </span>
            </li>
          </ul>

          <!-- Order total footer -->
          <div class="flex items-center justify-between bg-[var(--color-surface)] px-5 py-4">
            <span class="text-sm text-[var(--color-muted)]">
              {{ (item as AccordionOrderItem).order.items.reduce((s, i) => s + i.quantity, 0) }}
              {{ (item as AccordionOrderItem).order.items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items' }}
            </span>
            <span class="text-base font-bold text-[var(--color-text)]">
              Total: ${{ (item as AccordionOrderItem).order.total.toFixed(2) }}
            </span>
          </div>
        </div>
      </template>
    </UAccordion>
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import { useOrdersStore } from '~/stores/orders'
import type { Order } from '~/stores/orders'

interface AccordionOrderItem extends AccordionItem {
  order: Order
}

const ordersStore = useOrdersStore()

const accordionItems = computed<AccordionOrderItem[]>(() =>
  ordersStore.orders.map(order => ({
    label: `Order #${order.id}`,
    icon: 'i-lucide-receipt',
    value: order.id,
    order,
    description: `${new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${order.items.reduce((s, i) => s + i.quantity, 0)} items · $${order.total.toFixed(2)}`,
  })),
)

useHead({ title: 'My Orders' })
</script>
