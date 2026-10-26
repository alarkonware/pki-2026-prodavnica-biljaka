import type { OrderModel } from "./order.model"

export interface UserModel {
    username: string
    password: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    favoriteTypes: string[]
    orders: OrderModel[]
}


// Podaci o korisniku bez porudžbina. Koristi se u formi za registraciju i profil
// (ProfileForm, SignupView, ProfileView) i u UserService (createUser, updateProfile).
export type ProfileModel = Omit<UserModel, 'orders'>