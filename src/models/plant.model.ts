export interface PlantModel {
    id: number
    name: string
    latinName: string
    imageUrl: string
    description: string
    planting: string
    care: string
    types: string[]
    targetGroup: string
    producedAt: string
    price: number
    averageRating: number
    reviewCount: number
}

export interface SearchFilters {
    name: string
    description: string
    type: string
    targetGroup: string
    producedFrom: string
    producedTo: string
    priceFrom: number | ''
    priceTo: number | ''
    minRating: number
    reviewText: string
}
