import type { OrderModel } from "@/models/order.model"
import type { ProfileModel, UserModel } from "@/models/user.model"
import { USERS } from "@/data/users"
import { PlantService } from "./plant.service"

// ključ u localStorage-u pod kojim su sačuvani svi korisnici
const USERS_KEY = 'zelenaoaza_users'

// ključ u localStorage-u pod kojim je sačuvano korisničko ime prijavljenog korisnika
const ACTIVE_USER_KEY = 'zelenaoaza_session'

export class UserService {

    static getUsers(): UserModel[] {
        if (localStorage.getItem(USERS_KEY) == null) {
            localStorage.setItem(USERS_KEY, JSON.stringify(USERS))
        }

        return JSON.parse(localStorage.getItem(USERS_KEY)!)
    }

    static signIn(username: string, password: string): boolean {
        const users = this.getUsers()

        for (let user of users) {
            if (user.username == username && user.password == password) {
                localStorage.setItem(ACTIVE_USER_KEY, username)
                return true
            }
        }

        return false
    }

    static currentUser(): UserModel | null {
        for (let user of this.getUsers()) {
            if (user.username == localStorage.getItem(ACTIVE_USER_KEY)) {
                return user
            }
        }

        return null
    }

    static signOut() {
        localStorage.removeItem(ACTIVE_USER_KEY)
    }

    static emptyProfile(): ProfileModel {
        return {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            favoriteTypes: []
        }
    }

    // Vraca tekst greske ili null ako je sve u redu
    static createUser(profile: ProfileModel): string | null {
        const error = this.validate(profile)
        if (error) {
            return error
        }

        const users = this.getUsers()
        for (let user of users) {
            if (user.username === profile.username) {
                return 'Korisničko ime je već zauzeto!'
            }
        }

        users.push({ ...profile, orders: [] })
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        return null
    }

    static updateProfile(profile: ProfileModel): string | null {
        const error = this.validate(profile)
        if (error) {
            return error
        }

        this.updateActiveUser(user => {
            user.firstName = profile.firstName
            user.lastName = profile.lastName
            user.email = profile.email
            user.phone = profile.phone
            user.address = profile.address
            user.favoriteTypes = profile.favoriteTypes
            user.password = profile.password
        })

        return null
    }

    // Ako korisnik vec ima rezervaciju iste biljke (rezervisano), povecava se kolicina
    static reserve(order: Omit<OrderModel, 'id'>) {
        this.updateActiveUser(user => {
            for (let obj of user.orders) {
                if (obj.plantId === order.plantId && obj.status == 'rezervisano' && obj.deletedAt == null) {
                    obj.quantity += order.quantity
                    return
                }
            }

            user.orders.push({ id: this.nextOrderId(), ...order })
        })
    }

    // Izmena je moguca samo dok je status 'rezervisano'
    static editReservation(order: OrderModel, quantity: number, note: string) {
        this.modifyOrder(order, obj => {
            if (obj.status == 'rezervisano') {
                obj.quantity = quantity
                obj.note = note
            }
        })
    }

    static cancelReservation(order: OrderModel) {
        this.modifyOrder(order, obj => {
            if (obj.status == 'rezervisano') {
                obj.status = 'otkazano'
            }
        })
    }

    // Brisanje je moguce samo kada status nije 'rezervisano' (pristiglo ili otkazano)
    static deleteReservation(order: OrderModel) {
        this.modifyOrder(order, obj => {
            if (obj.status != 'rezervisano') {
                obj.deletedAt = new Date().toISOString()
            }
        })
    }

    // Dostava: sve rezervacije na cekanju stizu i dobijaju status 'pristiglo'
    // Vraca nazive biljaka koje su pristigle (za obavestenje)
    static deliverReservations(): string[] {
        const arrived: string[] = []

        this.updateActiveUser(user => {
            for (let obj of user.orders) {
                if (obj.status == 'rezervisano' && obj.deletedAt == null) {
                    obj.status = 'pristiglo'
                    arrived.push(obj.plantName)
                }
            }
        })

        return arrived
    }

    // Ocenjivanje je moguce samo kada je status 'pristiglo' i samo jednom
    static rateReservation(order: OrderModel, rating: number, text: string) {
        const activeUser = this.currentUser()

        this.modifyOrder(order, obj => {
            if (obj.status == 'pristiglo' && obj.rating == null && activeUser) {
                obj.rating = rating
                PlantService.addReview({
                    plantId: obj.plantId,
                    author: activeUser.firstName,
                    rating: rating,
                    text: text
                })
            }
        })
    }

    // sledeci slobodan broj porudzbine (jedinstven za sve korisnike)
    private static nextOrderId(): number {
        let max = 0
        for (let user of this.getUsers()) {
            for (let o of user.orders) {
                max = Math.max(max, o.id)
            }
        }

        return max + 1
    }

    private static modifyOrder(order: OrderModel, change: (obj: OrderModel) => void) {
        this.updateActiveUser(user => {
            for (let obj of user.orders) {
                if (obj.id == order.id) {
                    change(obj)
                }
            }
        })
    }

    private static updateActiveUser(change: (user: UserModel) => void) {
        const activeUser = this.currentUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.username === activeUser.username) {
                    change(user)
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    private static validate(p: ProfileModel): string | null {
        if (!p.firstName.trim() || !p.lastName.trim())
            return 'Unesite ime i prezime!'

        if (!p.email.includes('@') || !p.email.includes('.'))
            return 'Unesite ispravan email!'

        // razmaci, kosa crta i crtica se ignorišu; broj mora početi sa 06 i imati najmanje 9 cifara
        const digits = p.phone.replace(/[ /-]/g, '')
        if (!/^06[0-9]{7,}$/.test(digits))
            return 'Unesite ispravan broj telefona (npr. 060 123 4567)'

        if (!p.address.trim())
            return 'Unesite adresu!'

        if (p.favoriteTypes.length == 0)
            return 'Izaberite bar jednu omiljenu vrstu biljaka!'

        if (!p.username.trim())
            return 'Unesite korisničko ime!'

        if (p.password.length < 6)
            return 'Lozinka mora imati najmanje 6 karaktera!'

        return null
    }
}
