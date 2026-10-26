import type { PlantModel } from "./plant.model"
import type { ReviewModel } from "./review.model"

//  biljka sa listom njenih recenzija (za stranicu detalja)
export interface DetailsModel extends PlantModel {
    reviews: ReviewModel[]
}
