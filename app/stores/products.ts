export interface Product {
  id: number
  name: string
  description: string
  price: number
  rating: number
  category: string
  badge?: string
  images: string[]
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])

  function setProducts(data: Product[]) {
    products.value = data
  }

  function getById(id: number): Product | undefined {
    return products.value.find(p => p.id === id)
  }

  function getByCategory(category: string, excludeId?: number): Product[] {
    return products.value.filter(
      p => p.category.toLowerCase() === category.toLowerCase() && p.id !== excludeId,
    )
  }

  return { products, setProducts, getById, getByCategory }
})
