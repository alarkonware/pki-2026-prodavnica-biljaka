import { PLANTS } from "@/data/plants"
import type { OrderModel, OrderStatus } from "@/models/order.model"
import type { UserModel } from "@/models/user.model"



// data = objekat sa svim podacima porudzbine; ime i cenu biljke funkcija sama uzima iz data/plants.ts
function order(data: {
  orderId: number
  plantId: number
  quantity: number
  status: OrderStatus
  createdAt: string
  note?: string
}): OrderModel {
  const plant = PLANTS.find(p => p.id === data.plantId)!

  return {
    id: data.orderId,
    plantId: data.plantId,
    plantName: plant.name,        
    quantity: data.quantity,
    pricePerPlant: plant.price,   
    note: data.note ?? '',
    status: data.status,
    rating: null,                 
    createdAt: data.createdAt,
    deletedAt: null               
  }
}

// Demo nalog; prilikom prvog pokretanja upisuje se u localStorage
export const USERS: UserModel[] = [
  {
    username: 'marko',
    password: 'marko123',
    firstName: 'Marko',
    lastName: 'Marković',
    email: 'marko@mail.com',
    phone: '0641234567',
    address: 'Bulevar kralja Aleksandra 10, Beograd',
    favoriteTypes: ['sobno', 'začinsko'],
    orders: [
      order({ orderId: 1, plantId: 1, quantity: 1, status: 'pristiglo', createdAt: '2026-10-01T10:00:00.000Z' }),
      order({ orderId: 2, plantId: 4, quantity: 3, status: 'rezervisano', createdAt: '2026-10-10T12:00:00.000Z', note: 'Za balkon' }),
      order({ orderId: 3, plantId: 6, quantity: 1, status: 'otkazano', createdAt: '2026-10-05T09:30:00.000Z' })
    ]
  }
]