import { useProductsStore } from './products'
import { useOrdersStore } from './orders'

export interface CartItem {
  productId: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const totalPrice = computed(() => {
    const productsStore = useProductsStore()
    return items.value.reduce((sum, item) => {
      const product = productsStore.getById(item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)
  })

  function getQuantity(productId: number): number {
    return items.value.find(i => i.productId === productId)?.quantity ?? 0
  }

  function add(productId: number) {
    const existing = items.value.find(i => i.productId === productId)
    if (existing) {
      existing.quantity++
    }
    else {
      items.value.push({ productId, quantity: 1 })
    }
  }

  function remove(productId: number) {
    items.value = items.value.filter(i => i.productId !== productId)
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      remove(productId)
      return
    }
    const item = items.value.find(i => i.productId === productId)
    if (item) item.quantity = quantity
  }

  function clearCart() {
    items.value = []
  }

  function placeOrder(): string {
    const productsStore = useProductsStore()
    const ordersStore = useOrdersStore()

    const snapshot = items.value.map(item => {
      const product = productsStore.getById(item.productId)
      return {
        productId: item.productId,
        name: product?.name ?? '',
        image: product?.images[0] ?? '',
        price: product?.price ?? 0,
        quantity: item.quantity,
      }
    })

    ordersStore.add(snapshot, totalPrice.value)
    const orderId = ordersStore.orders[0]?.id ?? ''
    clearCart()
    return orderId
  }

  return { items, totalItems, totalPrice, getQuantity, add, remove, updateQuantity, clearCart, placeOrder }
})
