# Copilot Instructions — Angular Frontend

Queste istruzioni guidano GitHub Copilot nel modificare **questo repository frontend Angular**, usando il codice già presente come riferimento diretto per struttura, convenzioni e pattern del progetto. Le istruzioni repository-wide possono essere salvate come `.github/copilot-instructions.md`, mentre istruzioni mirate possono vivere in `.github/instructions/*.instructions.md` con `applyTo` per path specifici.[1][2]

## 1. Lettura iniziale della codebase

All'inizio della sessione, analizza la codebase di **questo progetto Angular** per capire come sono state costruite le feature esistenti. Le istruzioni repository custom forniscono a Copilot contesto persistente su come capire il progetto e come costruire modifiche coerenti.[3][1]

Leggi almeno:
- `package.json`
- `angular.json`
- `tsconfig.json` e file di configurazione principali
- struttura di `src/`
- moduli, componenti, servizi, guard, interceptor, model/interface, shared utilities
- almeno un flusso completo già esistente: page/component → service → model/interface → template/style

Dopo la lettura iniziale, usa ciò che hai appreso come riferimento durante tutta la sessione. Non ripetere una rilettura completa a ogni richiesta, salvo quando la modifica coinvolge aree non ancora analizzate.

***

## 2. Principio base

**Il repository che stai leggendo è il repository da modificare.**

Quindi:
- non trattarlo come semplice esempio esterno
- usa il codice esistente per capire i pattern già adottati
- applica ogni nuova modifica rispettando l'architettura frontend già presente
- prima di creare qualcosa di nuovo, cerca nel progetto una feature simile e usala come riferimento

***

## 3. Obiettivo delle modifiche

Ogni richiesta serve a **modificare o ampliare questo frontend Angular** mantenendo coerenza con ciò che esiste già.

Le modifiche possono riguardare:
- creazione di nuove pagine o componenti
- modifica di componenti esistenti
- aggiornamento di servizi e chiamate API
- aggiunta o modifica di interfacce/model
- aggiornamento di form, validazioni, state handling e data mapping
- modifica di routing, guard, resolver o interceptor
- aggiornamento di template HTML, stile SCSS/CSS e logica TypeScript

Non reinterpretare il progetto con pattern diversi. Estendi quelli già presenti.

***

## 4. Regole di implementazione

Quando esegui una modifica:

1. Cerca una feature, pagina o componente simile già presente nel progetto.
2. Replica la stessa struttura tecnica già usata.
3. Mantieni naming, organizzazione file, logica di data flow, pattern di service, gestione errori UI e struttura dei template coerenti con il repository.
4. Modifica solo i file necessari alla richiesta.
5. Se servono aggiornamenti correlati, applicali solo dove realmente necessari.

Segui sempre queste regole:
- non introdurre pattern architetturali nuovi se nel progetto non esistono già
- non convertire il progetto a uno stile differente solo perché è alternativo o più moderno
- non aggiungere librerie o dipendenze senza richiesta esplicita
- non rinominare componenti, servizi, modelli o cartelle se non richiesto o non necessario
- non fare refactor ampi non richiesti
- non cambiare convenzioni di HTML, SCSS, RxJS, signals, store o form handling se il progetto segue già uno standard

***

## 5. Convenzioni da rispettare

Durante ogni modifica, inferisci e rispetta le convenzioni già presenti, ad esempio:
- struttura cartelle per feature o layer
- naming di componenti, servizi, pipe, directive e interface
- uso di standalone components oppure NgModule
- uso di reactive forms oppure template-driven forms
- gestione delle chiamate HTTP tramite service
- uso di RxJS, signals, store o state management già presente
- pattern di loading, error, empty state e mapping dei dati API
- convenzioni per SCSS/CSS, class naming e component styling
- strategia di routing, lazy loading e guard

Se esiste già un pattern dominante nel progetto, continua con quello.

***

## 6. Cosa riceverai da me

Le richieste potranno descrivere una modifica come:
- nuova feature frontend
- nuova pagina o nuovo componente
- modifica di componente esistente
- aggiornamento di una chiamata API e relativo rendering UI
- aggiunta di campi a form o viste
- modifica del comportamento di una feature
- aggiornamento della gestione dati mostrati a schermo

Per ogni richiesta:
- individua i file coinvolti
- proponi o applica una modifica aderente ai pattern del progetto
- se ci sono ambiguità funzionali, chiedi chiarimenti prima di procedere

***

## 7. Criteri di coerenza

Prima di generare codice, verifica sempre:
- Esiste già una feature o un componente simile da prendere come riferimento?
- La struttura dei file è coerente con il progetto?
- Il naming è coerente con quello già usato?
- Il template HTML segue il pattern delle altre parti dell'app?
- La logica TypeScript è coerente con lo stile esistente?
- Il service layer e il mapping dei dati rispettano il pattern già presente?
- Sto modificando solo ciò che è rilevante per la richiesta?

***

## 8. Output atteso

Quando proponi modifiche al codice:
- produci codice pronto da inserire nel repository
- mantieni alta la coerenza con il progetto esistente
- evita soluzioni diverse solo perché più moderne se divergono dal pattern del repository
- privilegia continuità, leggibilità e compatibilità con il codice già presente

## 9. Uso consigliato come skill

Per usarla come skill nel repository:
- salva questa versione come `.github/copilot-instructions.md` se vuoi che valga per tutto il frontend Angular.[3][1]
- crea eventualmente un file `.github/instructions/angular-frontend.instructions.md` con `applyTo` su `src/**/*.ts`, `src/**/*.html`, `src/**/*.scss` se vuoi istruzioni mirate ai file frontend.[2]
- se vuoi un comando riusabile in chat, crea anche un file `.github/prompts/modify-angular-feature.prompt.md`; i prompt files sono supportati negli IDE compatibili e in VS Code vanno abilitati nelle impostazioni workspace.[4][5]