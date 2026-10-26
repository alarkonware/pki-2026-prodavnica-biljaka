export type OrderStatus = 'rezervisano' | 'pristiglo' | 'otkazano'

// Stavka rezervacije
export interface OrderModel {
    id: number
    plantId: number
    plantName: string
    quantity: number
    pricePerPlant: number
    note: string
    status: OrderStatus
    rating: number | null
    createdAt: string
    deletedAt: string | null
}
