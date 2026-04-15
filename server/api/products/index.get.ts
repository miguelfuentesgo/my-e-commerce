interface FakeStoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

export default defineEventHandler(async () => {
  const data = await $fetch<FakeStoreProduct[]>('https://fakestoreapi.com/products')

  return data.map(p => ({
    id: p.id,
    name: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    rating: p.rating.rate,
    images: [p.image],
  }))
})
