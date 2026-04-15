export interface OrderItem {
  productId: number
  name: string
  image: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: number
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])

  function add(items: OrderItem[], total: number) {
    const order: Order = {
      id: Math.random().toString(36).slice(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      items: [...items],
      total,
    }
    orders.value.unshift(order)
  }

  return { orders, add }
})
