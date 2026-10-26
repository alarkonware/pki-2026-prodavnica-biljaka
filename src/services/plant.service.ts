import type { DetailsModel } from "@/models/details.model"
import type { PlantModel, SearchFilters } from "@/models/plant.model"
import { PLANTS } from "@/data/plants"
import { REVIEWS } from "@/data/reviews"
import type { ReviewModel } from "@/models/review.model"

// Mala slova bez kvacica: "djumbir" i "đumbir" se tretiraju isto prilikom pretrage
function simplify(text: string) {
    return text.toLowerCase().replace(/đ/g, 'dj').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const REVIEWS_KEY = 'zelenaoaza_reviews'

export class PlantService {

    // Recenzije se cuvaju u localStorage, pocetne se upisuju pri prvom citanju
    static getReviews(): ReviewModel[] {
        if (localStorage.getItem(REVIEWS_KEY) == null) {
            localStorage.setItem(REVIEWS_KEY, JSON.stringify(REVIEWS))
        }

        return JSON.parse(localStorage.getItem(REVIEWS_KEY)!)
    }

    static addReview(review: ReviewModel) {
        const reviews = this.getReviews()
        reviews.push(review)
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
    }

    static async getPlants(): Promise<PlantModel[]> {
        const reviews = this.getReviews()
        const plants: PlantModel[] = []

        for (let seed of PLANTS) {
            plants.push(this.withRatings(seed, reviews))
        }

        return plants
    }

    static async getPlantById(id: number): Promise<PlantModel | undefined> {
        const plants = await this.getPlants()
        return plants.find(p => p.id === id)
    }

    static async getDetails(id: number): Promise<DetailsModel | undefined> {
        const plant = await this.getPlantById(id)
        if (!plant) {
            return undefined
        }

        return {
            ...plant,
            reviews: this.getReviews().filter(r => r.plantId === id)
        }
    }

    // Najbolje ocenjene biljke jednog tipa (za kategorije na pocetnoj strani)
    static getTopByType(plants: PlantModel[], type: string, count: number): PlantModel[] {
        return plants
            .filter(p => p.types.includes(type))
            .sort((a, b) => b.averageRating - a.averageRating || b.reviewCount - a.reviewCount)
            .slice(0, count)
    }

    static emptyFilters(): SearchFilters {
        return {
            name: '',
            description: '',
            type: '',
            targetGroup: '',
            producedFrom: '',
            producedTo: '',
            priceFrom: '',
            priceTo: '',
            minRating: 0,
            reviewText: ''
        }
    }

    static getTypes(plants: PlantModel[]): string[] {
        const types: string[] = []

        for (let plant of plants) {
            for (let type of plant.types) {
                if (!types.includes(type)) {
                    types.push(type)
                }
            }
        }

        return types.sort()
    }

    static getTargetGroups(plants: PlantModel[]): string[] {
        const groups: string[] = []

        for (let plant of plants) {
            if (!groups.includes(plant.targetGroup)) {
                groups.push(plant.targetGroup)
            }
        }

        return groups
    }

    // Pretraga: svaki kriterijum se zadaje odvojeno, prazan kriterijum se ignorise
    static search(plants: PlantModel[], f: SearchFilters): PlantModel[] {
        const reviews = this.getReviews()

        return plants.filter(p => {
            if (f.name && !simplify(p.name).includes(simplify(f.name)))
                return false

            // opis ukljucuje i sadnju i negu
            if (f.description) {
                const text = `${p.description} ${p.planting} ${p.care}`.toLowerCase()
                if (!text.includes(f.description.toLowerCase()))
                    return false
            }

            if (f.type && !p.types.includes(f.type))
                return false

            if (f.targetGroup && p.targetGroup != f.targetGroup)
                return false

            // datumi su u formatu YYYY-MM-DD pa se mogu porediti kao tekst
            if (f.producedFrom && p.producedAt < f.producedFrom)
                return false

            if (f.producedTo && p.producedAt > f.producedTo)
                return false

            if (f.priceFrom !== '' && p.price < f.priceFrom)
                return false

            if (f.priceTo !== '' && p.price > f.priceTo)
                return false

            if (f.minRating && p.averageRating < f.minRating)
                return false

            if (f.reviewText) {
                const text = f.reviewText.toLowerCase()
                const found = reviews.some(r => r.plantId === p.id && r.text.toLowerCase().includes(text))
                if (!found)
                    return false
            }

            return true
        })
    }

    private static withRatings(plant: PlantModel, reviews: ReviewModel[]): PlantModel {
        // izdvaja recenzije samo izabrane biljke
        const own = reviews.filter(r => r.plantId === plant.id)

        let sum = 0
        for (let r of own) {
            sum += r.rating
        }

        return {
            ...plant,
            averageRating: own.length > 0 ? sum / own.length : 0,
            reviewCount: own.length
        }
    }
}