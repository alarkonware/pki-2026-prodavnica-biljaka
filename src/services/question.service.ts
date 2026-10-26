import { TREE } from "@/data/questions"
import type { QuestionModel } from "@/models/question.model"

export class QuestionService {

    // Vraća jedno pitanje agenta, ali samo sa opcijama koja važe za gosta ili za prijavljenog korisnika
    static async getNode(id: string, loggedIn: boolean): Promise<QuestionModel | null> {
        // nalazimo pitanje po imenu (npr. 'start'); ako ga nema, vraćamo null
        const node = TREE.find(q => q.id === id)
        if (!node) {
            return null
        }

        // određujemo ko je korisnik
        const who = loggedIn ? 'user' : 'guest'

       // Biram koje odgovore prikazujem: one bez onlyFor (za sve) i one čiji onlyFor odgovara korisniku (gost ili prijavljen)
        return {
            ...node,
            choices: node.choices.filter(c => c.onlyFor === undefined || c.onlyFor === who)
        }
    }
}