// Predstavlja dugme u chat agentu
export interface QuestionChoice {
    text: string
    goTo?: string
    route?: string
    // opcija se prikazuje samo gostima ili samo prijavljenim korisnicima
    onlyFor?: 'guest' | 'user'
}

// Predstavlja pitanje agenta sa dugmadima koja nudi
export interface QuestionModel {
    id: string
    reply: string
    choices: QuestionChoice[]
}
