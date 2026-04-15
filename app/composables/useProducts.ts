import type { Product } from '~/stores/products'

export const useProducts = () => {
  const productsStore = useProductsStore()

  const { data, status, error } = useAsyncData<Product[]>(
    'products',
    () => $fetch('/api/products'),
    { default: () => [], server: false },
  )

  watch(data, (val) => {
    if (val) productsStore.setProducts(val)
  }, { immediate: true })

  return { status, error }
}
