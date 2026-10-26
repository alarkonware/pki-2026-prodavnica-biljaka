import type { QuestionModel } from "@/models/question.model"

// Unapred definisano stablo razgovora (simulacija agenta)
export const TREE: QuestionModel[] = [
    {
        id: 'start',
        reply: 'Zdravo! Ja sam pomoćnik prodavnice. Kako mogu da pomognem?',
        choices: [
            { text: 'Kako da pronađem biljku?', goTo: 'search' },
            { text: 'Kako da rezervišem biljku?', goTo: 'reserve' },
            { text: 'Šta znače statusi u korpi?', goTo: 'status' },
            { text: 'Savet za negu biljaka', goTo: 'care' }
        ]
    },
    {
        id: 'search',
        reply: 'Na stranici "Biljke" možete pretraživati po nazivu, opisu, tipu, ciljnoj grupi, datumu proizvodnje, ceni i oceni. Kriterijumi se zadaju odvojeno, a možete ih i kombinovati.',
        choices: [
            { text: 'Idi na pretragu', route: '/plants' },
            { text: 'Nazad', goTo: 'start' }
        ]
    },
    {
        id: 'reserve',
        reply: 'Kliknite "Rezerviši" na biljci i potvrdite rezervaciju. Morate biti prijavljeni. Rezervisana biljka se pojavljuje u rezervacijama.',
        choices: [
            { text: 'Nemam nalog', goTo: 'signup', onlyFor: 'guest' },
            { text: 'Idi na biljke', route: '/plants', onlyFor: 'user' },
            { text: 'Idi na korpu', route: '/reservations', onlyFor: 'user' },
            { text: 'Nazad', goTo: 'start' }
        ]
    },
    {
        id: 'signup',
        reply: 'Registracija je laka, samo popunite sve podatke profila.',
        choices: [
            { text: 'Registruj me', route: '/signup', onlyFor: 'guest' },
            { text: 'Nazad', goTo: 'start' }
        ]
    },
    {
        id: 'status',
        reply: 'Rezervisano: biljka čeka isporuku, možete je izmeniti ili otkazati. Pristiglo: biljka je stigla, možete je oceniti i obrisati. Otkazano: rezervacija je otkazana.',
        choices: [
            { text: 'Nazad', goTo: 'start' }
        ]
    },
    {
        id: 'care',
        reply: 'Za koju vrstu biljke vam treba savet?',
        choices: [
            { text: 'Sobne biljke', goTo: 'indoor' },
            { text: 'Baštenske biljke', goTo: 'garden' },
            { text: 'Nazad', goTo: 'start' }
        ]
    },
    {
        id: 'indoor',
        reply: 'Većina sobnih biljaka voli svetlo bez direktnog sunca. Zalivajte tek kada se gornji sloj zemlje osuši, jer je prekomerno zalivanje najčešća greška.',
        choices: [
            { text: 'Prikaži sobne biljke', route: '/plants?type=sobno' },
            { text: 'Nazad', goTo: 'care' }
        ]
    },
    {
        id: 'garden',
        reply: 'Baštenske biljke sade se u proleće ili jesen. Pripremite zemlju kompostom i zalivajte ujutru ili uveče.',
        choices: [
            { text: 'Prikaži baštenske biljke', route: '/plants?type=baštensko' },
            { text: 'Nazad', goTo: 'care' }
        ]
    }
]
