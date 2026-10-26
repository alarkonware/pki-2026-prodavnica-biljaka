# Baštenska Oaza - prototip korisničkog interfejsa

Vue 3 + TypeScript + Vue Router + Bootstrap (CDN) + SweetAlert2. Nema backend-a, podaci se čuvaju u `localStorage`.

## Pokretanje

```
bun install
bun run dev
```

Demo nalog: `marko` / `marko123`

## Struktura `src`

- `data` - početni podaci (plants, reviews, users, questions)
- `models` - interfejsi (plant, details, review, order, user, question)
- `services` - klase sa statičkim metodama (`PlantService`, `UserService`, `QuestionService`)
- `components` - PlantCard, OrderCard, ProfileForm, Rating, InfoCard, ChatAgent
- `views` - stranice (Home, Plants, Details, Order, Cart, Profile, Login, Signup, About)
- `router` - rute (stranice sa `meta.requiresLogin` zahtevaju prijavu, proverava se u `beforeEach`)
- `assets` - base.css, main.css
- `src/assets/images` - slike biljaka (ubaci fotografije; putanja svake je upisana u `imageUrl` u `data/plants.ts`)
- `public/plants/placeholder.svg` - zamenska slika dok prava ne postoji
- `utils.ts` - pomoćne funkcije i SweetAlert2 dijalozi
