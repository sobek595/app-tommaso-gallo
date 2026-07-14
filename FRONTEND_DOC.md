# Documentazione Frontend - Academy Backend

Base URL: `http://localhost:3000/api`
Autenticazione: JWT Bearer token (header `Authorization: Bearer <token>`)
Nessuna API pubblica: tutte le richiedono token, tranne register/login.

---

## Entità

### Utente
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "fullName": "Mario Rossi",   // virtual, solo lettura
  "role": "dipendente"          // "dipendente" | "referente"
}
```
Nota: `email` e `password` NON vengono restituiti nelle risposte (vivi solo in UserIdentity).

### Corso
```json
{
  "id": "string",
  "titolo": "string",
  "descrizione": "string",
  "categoria": "string",        // es. "Sicurezza", "Compliance", "Tecnico"
  "durataOre": 8,               // number, > 0
  "obbligatorio": false,        // boolean
  "attivo": true                // boolean; false = non assegnabile
}
```

### Assegnazione
```json
{
  "id": "string",
  "corsoId": { ...Corso },           // popolato, NON solo l'ID
  "dipendenteId": { ...Utente },     // popolato, NON solo l'ID
  "dataAssegnazione": "2026-01-05T00:00:00.000Z",
  "dataScadenza": "2026-09-30T00:00:00.000Z",
  "stato": "assegnato",              // "assegnato" | "completato" | "scaduto" | "annullato"
  "dataCompletamento": null          // null o ISO date se completato
}
```
Importante: nelle risposte delle GET, `corsoId` e `dipendenteId` sono oggetti popolati (con tutti i campi dell'entità). Leggi `assegnazione.corsoId.titolo`, `assegnazione.corsoId.categoria`, `assegnazione.dipendenteId.fullName`.

---

## Endpoint

### Auth (pubbliche)

#### POST `/users/register`
Crea un utente. Body:
```json
{ "firstName": "Mario", "lastName": "Rossi", "email": "mario@example.com", "role": "dipendente", "password": "Password1!" }
```
- password: min 8, almeno 1 maiuscola, 1 minuscola, 1 numero, 1 simbolo
- 200: ritorna l'Utente creato | 400: `UserExists` (email duplicata) o `ValidationError`

#### POST `/users/login`
Body: `{ "email": "...", "password": "..." }`
- 200: `{ "user": { ...Utente }, "token": "eyJhbGc..." }`
- 400: `{ "error": "LoginError", "message": "..." }`

Salva `token` (localStorage/cookie) e `user.role` per nascondere/mostrare le nav.

---

### Corsi (autenticazione richiesta)

| Metodo | Endpoint | Ruolo | Note |
|---|---|---|---|
| GET | `/corsi?categoria=...&attivo=true` | entrambi | filtri opz. `attivo` come stringa "true"/"false" |
| GET | `/corsi/:id` | referente | 404 se non trovato, 403 se dipendente |
| POST | `/corsi` | referente | 201, body AddCorsoDTO |
| PUT | `/corsi/:id` | referente | body parziale |
| PUT | `/corsi/:id/disattiva` | referente | setta `attivo=false` |
| DELETE | `/corsi/:id` | referente | 204, 400 se ha assegnazioni collegate |

**POST /corsi body** (campi obbligatori: titolo, categoria, durataOre):
```json
{ "titolo": "...", "descrizione": "...", "categoria": "...", "durataOre": 8, "obbligatorio": false, "attivo": true }
```
Risposta 201: `{ ...Corso }`

---

### Assegnazioni (autenticazione richiesta)

| Metodo | Endpoint | Ruolo | Note |
|---|---|---|---|
| GET | `/assegnazioni-corsi?stato=...&categoria=...&corso=...&dipendente=...` | entrambi | dipendente vede solo le proprie ( filtro `dipendente` ignorato ) |
| GET | `/assegnazioni-corsi/:id` | entrambi | dipendente: 404 se non sua |
| POST | `/assegnazioni-corsi` | referente | 201; corso deve essere attivo |
| PUT | `/assegnazioni-corsi/:id` | referente | body parziale |
| PUT | `/assegnazioni-corsi/:id/annulla` | referente | setta stato=annullato |
| PUT | `/assegnazioni-corsi/:id/completa` | **dipendente** | setta stato=completato + dataCompletamento |
| DELETE | `/assegnazioni-corsi/:id` | referente | 204 |

**POST body** (tutti obbligatori):
```json
{ "corsoId": "id", "dipendenteId": "id", "dataAssegnazione": "2026-01-01", "dataScadenza": "2026-09-30" }
```
- date in formato ISO 8601 (YYYY-MM-DD)
- `dataScadenza` deve essere >= `dataAssegnazione`
- 400 `CorsoNonAttivo` se il corso e disattivato

**Filtri GET (query string)**:
- `stato`: uno tra `assegnato` | `completato` | `scaduto` | `annullato`
- `categoria`: testo (filtra per categoria del corso collegato)
- `corso`: ID corso
- `dipendente`: ID utente (solo referente; per dipendente viene ignorato)

Risposta GET: array di Assegnazione con `corsoId` e `dipendenteId` popolati.

---

## Ruoli e autorizzazioni (riepilogo)

**Dipendente** puo:
- Vedere solo le proprie assegnazioni (GET /assegnazioni-corsi)
- Vedere il dettaglio delle proprie assegnazioni (GET /:id)
- Filtrare per stato, categoria, corso
- Completare le proprie assegnazioni (PUT /:id/completa)
- Vedere la lista dei corsi (GET /corsi) — per consultazione, non per modifica

**Referente Academy** puo:
- Tutto cio che fa il dipendente (ma su tutte le assegnazioni, non solo le proprie)
- Gestire il catalogo corsi (CRUD + disattiva)
- Assegnare corsi ai dipendenti (POST assegnazioni)
- Modificare/annullare/eliminare assegnazioni
- Filtrare assegnazioni per dipendente

Il backend ENFORCE queste regole: nascondere i bottoni nel frontend non basta.

---

## Pagine da creare

### 1. Home / Login
- Form email + password
- POST `/users/login`
- Salva token + ruolo in stato globale (context/store)
- Su successo: redirect alla dashboard del ruolo
- Su errore: messaggio "Credenziali errate"
- Link "Registrati" (opzionale, se prevedi registrazione pubblica; nel seed gli utenti sono gia creati)

### 2. Dashboard (post-login)
In_base al ruolo mostra card/link alle sezioni disponibili:
- **Dipendente**: "I miei corsi", "Le mie scadenze"
- **Referente**: "Catalogo corsi", "Assegnazioni", "Statistiche"

### 3. Area Dipendente

#### 3a. I miei corsi
- GET `/assegnazioni-corsi` con token dipendente
- Mostra tabella/card con: titolo (da `corsoId.titolo`), categoria (`corsoId.categoria`), durata (`corsoId.durataOre`), data assegnazione, data scadenza, stato, data completamento
- Filtri: select per stato, select per categoria
- Bottone "Dettaglio" per riga -> pagina dettaglio
- Bottone " Completa" (solo se stato=assegnato) -> PUT `/:id/completa`
- Sezioni/tab: "Assegnati", "Completati" (usa filtro `stato`)

#### 3b. Dettaglio mio corso
- GET `/assegnazioni-corsi/:id`
- Mostra tutti i campi del corso + dati assegnazione
- Bottone "Segna come completato" se stato=assegnato

### 4. Area Referente

#### 4a. Catalogo corsi
- GET `/corsi` per lista
- Tabella: titolo, categoria, durata, obbligatorio, stato (attivo/non attivo)
- Filtri: categoria, stato attivo
- Bottone "Nuovo corso" -> form POST `/corsi`
- Bottone "Modifica" -> form PUT `/corsi/:id`
- Bottone "Disattiva" -> PUT `/corsi/:id/disattiva`
- Bottone "Elimina" -> DELETE `/corsi/:id` (gestisci 400 CorsoConAssegnazioni)

#### 4b. Assegnazioni
- GET `/assegnazioni-corsi` con token referente
- Tabella: dipendente (`dipendenteId.fullName`), corso (`corsoId.titolo`), categoria (`corsoId.categoria`), data assegnazione, data scadenza, stato, data completamento
- Filtri: stato, categoria, dipendente, corso
- Bottone "Assegna corso" -> form con select corso (solo attivi), select dipendente, date -> POST
- Bottone "Modifica" -> PUT `/assegnazioni-corsi/:id`
- Bottone "Annulla" -> PUT `/:id/annulla`
- Bottone "Elimina" -> DELETE `/:id`

#### 4c. Statistiche (da implementare nel backend)
> Endpoint `/statistiche/academy?mese=YYYY-MM&categoria=...` non ancora disponibile.
> Lo aggiungeremo. Per ora puoi creare la pagina vuota con filtri mese + categoria.

---

## Gestione errori (comune)

Tutte le API di errore restituiscono:
```json
{ "error": "NomeErrore", "message": "descrizione umana" }
```
Codici HTTP:
- 400: validazione / CorsoNonAttivo / CorsoConAssegnazioni / CorsoNonTrovato
- 403: ruolo non autorizzato (NotDipendenteError / NotReferenteError)
- 404: risorsa non trovata
- 500: errore generico

Nelle pagine mostra `message` in un banner/alert rosso. Per 403 redirect a dashboard. Per 401 (token invalido) redirect a login.

---

## Credenziali di test (seed)
Password unica: `Password1!`
- Dipendente: `mario.rossi@example.com`
- Dipendente: `luca.verdi@example.com`
- Referente: `laura.bianchi@example.com`