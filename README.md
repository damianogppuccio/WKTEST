# Calendario Webinar Genya — Sistema Widget per Docebo

Sistema di widget per la piattaforma WK Academy (Docebo) che mostra i prossimi webinar, sessioni Q&A e Academy Talks sulle homepage Genya Diretta e Indiretta, e sulla pagina Calendario Webinar Formativi.

---

## Indice

1. [Panoramica del sistema](#1-panoramica-del-sistema)
2. [Architettura file](#2-architettura-file)
3. [Setup su Docebo](#3-setup-su-docebo)
4. [Guida alla compilazione di events.js](#4-guida-alla-compilazione-di-eventsjs)
5. [Logica automatica dei widget sidebar](#5-logica-automatica-dei-widget-sidebar)
6. [Logica automatica del calendario mensile](#6-logica-automatica-del-calendario-mensile)
7. [Badge e stati degli eventi](#7-badge-e-stati-degli-eventi)
8. [Gestione della cache](#8-gestione-della-cache)
9. [Visibilità eventi per canale](#9-visibilità-eventi-per-canale)
10. [Palette colori e stile](#10-palette-colori-e-stile)
11. [Manutenzione ordinaria](#11-manutenzione-ordinaria)
12. [Troubleshooting](#12-troubleshooting)
13. [Dipendenze esterne](#13-dipendenze-esterne)

---

## 1. Panoramica del sistema

Il sistema è composto da tre widget iframe che condividono lo stesso file dati (`events.js`):

| Widget | Dove si trova | Cosa mostra | Dimensioni iframe |
|---|---|---|---|
| **Sidebar Diretta** (`diretta.html`) | Homepage Genya Diretta | 5-6 prossimi eventi rolling (Webinar + Q&A) + Academy Talk in fondo | 736 × 440 px |
| **Sidebar Indiretta** (`indiretta.html`) | Homepage Genya Indiretta | 5-6 prossimi eventi rolling (solo Webinar, NO Q&A) + Academy Talk in fondo | 736 × 440 px |
| **Calendario Mensile** (`calendario-mensile.html`) | Pagina "Calendario Webinar Formativi" | Vista mensile lun–ven con tutti gli eventi (Webinar + Q&A + Talks) con filtri e navigazione tra mesi | da definire |

I widget sono progettati per essere caricati tramite **iframe** nei widget Docebo, perché Docebo non esegue JavaScript nei widget HTML nativi.

---

## 2. Architettura file

```
📁 cartella sul server (es. https://vostrosito.it/academy/calendario/)
│
├── events.js                ← 🔴 UNICO FILE DA MODIFICARE
│                               Contiene tutti gli eventi divisi in sezioni:
│                               VACANZE, WEBINAR, QA, TALKS
│
├── calendario.js            ← ⚙️ Motore dei widget sidebar
│                               Gestisce: rolling, badge, filtri canale,
│                               timezone, modalità vacanze, sicurezza input
│                               NON MODIFICARE
│
├── stile.css                ← 🎨 Foglio di stile condiviso dai widget sidebar
│                               NON MODIFICARE
│
├── diretta.html             ← 📺 Widget sidebar per homepage Genya DIRETTA
│                               Imposta MOSTRA_QA = true
│                               NON MODIFICARE
│
├── indiretta.html           ← 📺 Widget sidebar per homepage Genya INDIRETTA
│                               Imposta MOSTRA_QA = false
│                               NON MODIFICARE
│
├── calendario-mensile.html  ← 📅 Widget calendario mensile (alpha, non live)
│                               NON MODIFICARE
│
└── README.md                ← 📖 Questo file
```

**Regola d'oro**: si modifica solo `events.js`. Tutti gli altri file sono fissi.

---

## 3. Setup su Docebo

### 3.1 Caricamento file sul server

Caricare **tutti i file** nella stessa cartella su un server web accessibile.
Il server deve:
- Servire file `.html` e `.js` con i corretti MIME type
- NON bloccare l'embedding in iframe (verificare che gli header `X-Frame-Options` e `Content-Security-Policy` non impediscano il caricamento dal dominio Docebo)

### 3.2 Configurazione widget su Docebo

**Homepage Genya Diretta:**
1. Apri il Composer della homepage
2. Aggiungi un widget di tipo **iframe**
3. URL: `https://vostrosito.it/academy/calendario/diretta.html`
4. Altezza: **440 px**
5. Titolo widget: lasciare **vuoto** (l'header è già dentro il widget)

**Homepage Genya Indiretta:**
1. Stessa procedura
2. URL: `https://vostrosito.it/academy/calendario/indiretta.html`
3. Altezza: **440 px**

**Pagina Calendario Webinar Formativi:**
1. Aggiungi un widget di tipo **iframe** in cima alla pagina
2. URL: `https://vostrosito.it/academy/calendario/calendario-mensile.html`
3. Altezza: da definire in base al render finale (stimata ~700 px)

---

## 4. Guida alla compilazione di events.js

### 4.1 Struttura del file

Il file contiene **3 sezioni separate**, ciascuna è un array JavaScript:

```
events.js
│
├── var WEBINAR = [ ... ];    ← Sezione 1: webinar formativi
├── var QA = [ ... ];         ← Sezione 2: sessioni Q&A
└── var TALKS = [ ... ];      ← Sezione 3: Academy Talks
```

### 4.2 Formato di ogni riga

Ogni evento è una riga con 5 campi. Esempio:

```javascript
{ data:"03/06/2026", ora_inizio:"10:00", ora_fine:"11:30", titolo:"Contabilità generale", link:"https://academy.wk.it/corso/123" },
```

| Campo | Formato | Esempio | Note |
|---|---|---|---|
| `data` | `"GG/MM/AAAA"` | `"03/06/2026"` | Formato italiano con zero iniziale |
| `ora_inizio` | `"HH:MM"` | `"10:00"` | Formato 24h, orario Roma (CET/CEST gestito automaticamente) |
| `ora_fine` | `"HH:MM"` | `"11:30"` | Formato 24h, stesso giorno |
| `titolo` | `"testo libero"` | `"Contabilità IVA base"` | Nome evento come apparirà nel widget |
| `link` | `"https://..."` | `"https://academy.wk.it/corso/123"` | URL pagina iscrizione/accesso su Docebo |

### 4.3 Regole di sintassi

| Regola | Corretto | Sbagliato |
|---|---|---|
| Ogni riga finisce con virgola | `...link:"https://..." },` | `...link:"https://..." }` (senza virgola) |
| Solo doppi apici | `titolo:"Nome"` | `titolo:'Nome'` |
| L'ultima riga PUÒ avere la virgola | Entrambe le forme OK | — |
| Niente a capo dentro i valori | `titolo:"Nome evento"` | `titolo:"Nome` (a capo) `evento"` |

### 4.4 Esempio completo di events.js

```javascript
var WEBINAR = [
  { data:"01/06/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Overview",              link:"https://..." },
  { data:"03/06/2026", ora_inizio:"14:00", ora_fine:"15:30", titolo:"Contabilità IVA base",  link:"https://..." },
  { data:"05/06/2026", ora_inizio:"10:00", ora_fine:"12:00", titolo:"Contabilità generale",  link:"https://..." },
  // ... fino a ~35 righe al mese
];

var QA = [
  { data:"02/06/2026", ora_inizio:"10:00", ora_fine:"12:00", titolo:"Sessione domande Contabilità",  link:"https://..." },
  { data:"09/06/2026", ora_inizio:"14:00", ora_fine:"16:00", titolo:"Sessione domande IVA",          link:"https://..." },
  // ... fino a ~10 righe al mese
];

var TALKS = [
  { data:"18/06/2026", ora_inizio:"18:00", ora_fine:"19:30", titolo:"AI e Automazione nello Studio",  link:"https://..." },
  // ... più di un Talk al mese possibile
];
```

### 4.5 Capienza massima degli array

| Sezione | Capienza consigliata | Note |
|---|---|---|
| WEBINAR | Fino a ~150 righe | ~35/mese × 4 mesi futuri + storico |
| QA | Fino a ~50 righe | ~10/mese × 4 mesi futuri + storico |
| TALKS | Fino a ~20 righe | Più di 1 al mese possibile |

Non c'è un limite tecnico rigido. Il widget filtra automaticamente gli eventi passati, quindi si possono accumulare centinaia di righe. Pulire periodicamente lo storico per leggibilità del file.

---

## 5. Logica automatica dei widget sidebar

### 5.1 Rolling degli eventi

Il widget sidebar mostra i prossimi eventi **non ancora terminati**, ordinati per data/ora:

1. Prende tutti gli eventi delle sezioni pertinenti (WEBINAR + QA per diretta, solo WEBINAR per indiretta)
2. Filtra via tutto ciò che ha `ora_fine` nel passato
3. Ordina per `data` + `ora_inizio` crescente
4. Prende i primi **N** eventi

### 5.2 Slot dinamici

| Academy Talk attivo? | N. eventi rolling | Totale righe visibili |
|---|---|---|
| Sì (prossimo Talk non ancora terminato) | 5 | 5 rolling + 1 Talk fisso in fondo |
| No (nessun Talk futuro caricato) | 6 | 6 rolling, niente sezione Talk |

### 5.3 Academy Talk nella sidebar

- Appare in fondo al widget in una sezione verde dedicata (icona microfono, label "ACADEMY TALK")
- Il widget mostra **il primo Talk non ancora terminato** dall'array TALKS, in ordine cronologico
- Quando un Talk termina (ora_fine passata), sparisce e il prossimo Talk prende il suo posto
- Se non ci sono Talk futuri, la sezione verde non appare e lo spazio viene usato per un 6° evento rolling
- I badge LIVE / Tra poco live funzionano anche sul Talk

---

## 6. Logica automatica del calendario mensile

### 6.1 Griglia

- Layout **lunedì–venerdì** (5 colonne), weekend esclusi
- Il mese corrente parte evidenziando il giorno di oggi
- Navigazione: frecce avanti/indietro, min = mese corrente, max = +3 mesi dal corrente

### 6.2 Tipi di pill evento

| Tipo | Stile | Filtro |
|---|---|---|
| Webinar | Pill grigia con bordo sinistro blu `#007AC3`, orario in blu | Filtrabile on/off |
| Q&A | Pill viola chiaro con bordo sinistro viola `#8B5CF6`, tag "Q&A" a destra | Filtrabile on/off |
| Academy Talk | Pill verde piena `#85BC20`, testo bianco, icona microfono | Sempre visibile, non filtrabile |

### 6.3 Overflow giorni

- Max **3 pill visibili** per cella giorno
- Se ci sono più di 3 eventi, appare un link "+N altri"
- Click su "+N altri" → popup flottante con la lista completa (titoli estesi + orari + tipo)
- Click sulla X o fuori dal popup → chiude

### 6.4 Filtri

- Due toggle in alto: "Webinar" e "Q&A"
- Attivi di default, cliccabili per nascondere/mostrare
- I Talk NON sono filtrabili: sono sempre visibili
- Quando un filtro è off, le pill di quel tipo spariscono e il conteggio "+N" si ricalcola

### 6.5 Evento live nel calendario mensile

- Un dot rosso pulsante appare accanto all'orario della pill dell'evento attualmente in corso

---

## 7. Badge e stati degli eventi

Si applicano sia ai widget sidebar che al calendario mensile.

### 7.1 Widget sidebar — badge a destra della riga

| Stato | Condizione | Visualizzazione |
|---|---|---|
| **Futuro** | `ora_inizio` > adesso + 30 min | Nessun badge |
| **Tra poco live** | Mancano ≤ 30 minuti all'inizio | Badge arancione `Tra poco live` |
| **LIVE** | `ora_inizio` ≤ adesso < `ora_fine` | Badge rosso lampeggiante `● LIVE` |
| **Terminato** | adesso ≥ `ora_fine` | Evento scompare dalla lista |

### 7.2 Widget sidebar — dot timeline a sinistra

| Stato | Dot |
|---|---|
| Webinar futuro | Verde `#85BC20` |
| Q&A futuro | Blu `#007AC3` |
| Tra poco live (qualsiasi tipo) | Arancione `#F5A623` |
| LIVE (qualsiasi tipo) | Rosso `#E2231A` |

### 7.3 Calendario mensile

| Stato | Visualizzazione |
|---|---|
| Evento futuro | Pill normale |
| Evento in corso (LIVE) | Dot rosso pulsante accanto all'orario |
| Giorno passato | Pill con opacità ridotta |
| Giorno corrente | Bordo blu sulla cella + label "oggi" |

### 7.4 Priorità badge

Quando un evento Q&A è anche LIVE, entrambi i badge convivono sulla stessa riga:
- Badge `● LIVE` (rosso, lampeggiante) ha priorità visiva
- Badge `Q&A` (piccolo, blu) resta accanto

### 7.5 Timezone

Tutti gli orari sono interpretati come **Europe/Rome** (CET/CEST). Il widget usa `toLocaleString('en-US', { timeZone:'Europe/Rome' })` per determinare l'ora corrente, quindi funziona correttamente anche se il browser dell'utente è in un fuso orario diverso.

### 7.6 Frequenza di aggiornamento

I badge si aggiornano automaticamente ogni **30 secondi** senza ricaricare la pagina.

---

## 8. Gestione della cache

### 8.1 Il problema

I browser cachano i file JavaScript. Se si aggiorna `events.js` sul server, i clienti potrebbero continuare a vedere la versione vecchia dalla cache del browser.

### 8.2 La soluzione: cache-busting con timestamp

Ogni widget carica `events.js` e `calendario.js` aggiungendo un parametro timestamp all'URL:

```
events.js?v=1716912345678
calendario.js?v=1716912345678
```

Il numero `1716912345678` è il timestamp del momento (`Date.now()`), quindi cambia ad ogni apertura della pagina. Il browser vede un URL diverso ogni volta e scarica il file fresco dal server.

### 8.3 Cosa succede in pratica

1. L'admin modifica `events.js` sul server e salva
2. Un cliente apre (o ricarica) la homepage Docebo
3. L'iframe carica `events.js?v=<nuovo_timestamp>`
4. Il browser scarica la versione aggiornata
5. Il cliente vede gli eventi corretti

Nessun intervento necessario lato browser. Nessun hard refresh richiesto.

### 8.4 Ricarica automatica per pagine aperte a lungo

I badge si aggiornano ogni 30 secondi con i dati in memoria. In più, ogni **60 minuti** la pagina si ricarica completamente: così anche un cliente che tiene la homepage aperta per ore/giorni riceve gli aggiornamenti di `events.js` senza intervento.

### 8.5 Meta tag aggiuntivi

I file HTML contengono anche meta tag anti-cache come rete di sicurezza:

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

---

## 9. Visibilità eventi per canale

### 9.1 Matrice di visibilità — Widget sidebar

| Tipo evento | `diretta.html` | `indiretta.html` |
|---|---|---|
| **WEBINAR** | ✅ Visibile | ✅ Visibile |
| **Q&A** | ✅ Visibile (sfondo azzurro + tag Q&A) | ❌ Nascosto |
| **TALKS** | ✅ Visibile (sezione verde in fondo) | ✅ Visibile (sezione verde in fondo) |

### 9.2 Matrice di visibilità — Calendario mensile

| Tipo evento | `calendario-mensile.html` |
|---|---|
| **WEBINAR** | ✅ Visibile (filtrabile) |
| **Q&A** | ✅ Visibile (filtrabile) |
| **TALKS** | ✅ Sempre visibile (NON filtrabile) |

Il calendario mensile è unico (non esiste versione diretta/indiretta) perché è posizionato sulla pagina "Calendario Webinar Formativi" che è comune a tutti.

### 9.3 Come funziona tecnicamente

La differenza tra `diretta.html` e `indiretta.html` è una sola riga di codice:

```javascript
// diretta.html
var MOSTRA_QA = true;

// indiretta.html
var MOSTRA_QA = false;
```

Il motore `calendario.js` legge questa variabile e decide se includere l'array QA nel rolling.

---

## 10. Palette colori e stile

### 10.1 Colori WK ufficiali utilizzati

| Colore | Hex | Uso nei widget |
|---|---|---|
| WK Blue | `#007AC3` | Header, date, bordi webinar, dot Q&A, chevron |
| WK Green | `#85BC20` | Tratto accent header, dot futuri, sezione Talk, pill Talk |
| WK Red | `#E2231A` | Badge LIVE, dot LIVE, dot live calendario mensile |
| WK Dark | `#353535` | Testo titoli eventi |

### 10.2 Colori derivati

| Colore | Hex | Uso |
|---|---|---|
| Light blue (tint) | `#D6EBF7` | Timeline sidebar, bordi leggeri |
| Mid blue | `#4FA8D8` | Mese abbreviato sotto il giorno |
| Light green (tint) | `#EBF5D0` | Bordo dot futuri |
| Sfondo Talk | `#F4FAE8` | Sfumatura sezione Talk |
| Viola Q&A | `#8B5CF6` | Bordo pill Q&A calendario mensile |
| Sfondo Q&A | `#F0EDFE` | Background pill Q&A |
| Arancione "Tra poco" | `#F5A623` | Dot "tra poco live" |
| Sfondo "Tra poco" | `#FFF3CD` | Badge "Tra poco live" |

### 10.3 Font

`'Segoe UI', Arial, sans-serif` — coerente con il font system di Docebo.

### 10.4 Icone

Tabler Icons 3.6.0 (CDN jsdelivr). Icone utilizzate:
- `ti-calendar-event` — header widget sidebar
- `ti-clock` — orario eventi
- `ti-chevron-right` — freccia navigazione riga
- `ti-chevron-left` / `ti-chevron-right` — frecce mese calendario
- `ti-microphone` — icona Academy Talk
- `ti-calendar` — data Talk
- `ti-circle-check` — filtri attivi
- `ti-filter` — label filtri
- `ti-x` — chiudi popup

---

## 11. Manutenzione ordinaria

### 11.1 Aggiungere eventi nuovi

1. Aprire `events.js` sul server
2. Individuare la sezione corretta (WEBINAR, QA, o TALKS)
3. Aggiungere una nuova riga **copiando e incollando una riga esistente** e modificando i valori
4. Verificare che la riga finisca con una virgola `,`
5. Salvare il file

### 11.2 Rimuovere eventi passati

Non è obbligatorio: gli eventi passati vengono ignorati automaticamente. Tuttavia, per tenere il file leggibile, è consigliabile pulire periodicamente gli eventi vecchi (es. a inizio mese, cancellare il mese precedente).

### 11.3 Procedura consigliata mensile

1. A inizio mese, aprire `events.js`
2. Cancellare le righe degli eventi del mese passato in tutte e tre le sezioni
3. Aggiungere gli eventi del nuovo mese
4. Salvare

### 11.4 Cosa NON toccare

- `diretta.html` — mai modificare
- `indiretta.html` — mai modificare
- `calendario.js` — mai modificare
- `calendario-mensile.html` — mai modificare
- La struttura delle righe in `events.js` (nomi dei campi, parentesi, virgolette)

---

## 12. Troubleshooting

### 12.1 Il widget non si vede su Docebo

**Causa probabile**: il server blocca l'embedding in iframe.
**Soluzione**: verificare con IT che gli header HTTP `X-Frame-Options` e `Content-Security-Policy` permettano il caricamento dal dominio Docebo. In alternativa, rimuovere `X-Frame-Options` dal server che ospita i widget.

### 12.2 Il widget mostra "Errore caricamento eventi"

**Causa probabile**: il file `events.js` non è nella stessa cartella del file HTML, oppure contiene un errore di sintassi.
**Soluzione**:
1. Verificare che `events.js` sia nella stessa cartella di `diretta.html` / `indiretta.html`
2. Aprire `events.js` e verificare che non ci siano apici singoli, virgole mancanti, o parentesi non chiuse
3. Aprire la console del browser (F12) per vedere l'errore specifico

### 12.3 Il widget mostra "Errore caricamento motore"

**Causa probabile**: il file `calendario.js` non è nella stessa cartella.
**Soluzione**: verificare che `calendario.js` sia presente e accessibile.

### 12.4 Il widget mostra "Nessun webinar in programma"

**Causa probabile**: tutti gli eventi in `events.js` sono nel passato.
**Soluzione**: aggiungere eventi futuri.

### 12.5 I badge LIVE non si attivano

**Causa probabile**: l'orario nel file non corrisponde all'ora corrente italiana.
**Verifica**: il widget usa il fuso `Europe/Rome`. Se inserisci `ora_inizio:"10:00"` il badge LIVE si attiva alle 10:00 ora italiana, indipendentemente dal fuso del browser.

### 12.6 Gli eventi non si aggiornano dopo la modifica

**Causa probabile (rara)**: cache aggressiva a livello di proxy aziendale.
**Soluzione**: il meccanismo di cache-busting con timestamp dovrebbe prevenire il problema. Se persiste, chiedere all'IT se c'è un proxy/CDN che cacha i file .js e configurare un TTL basso o un cache bypass per la cartella del widget.

### 12.7 Il widget mostra codice JavaScript come testo

**Causa probabile**: il widget è stato inserito come widget **HTML** di Docebo invece che come **iframe**.
**Soluzione**: rimuovere il widget HTML e sostituirlo con un widget **iframe** puntato all'URL del file HTML sul server.

### 12.8 Errori comuni in events.js

| Errore | Sintomo | Fix |
|---|---|---|
| Apice singolo `'` invece di doppio `"` | Widget non carica | Sostituire con `"` |
| Virgola mancante a fine riga | Widget non carica | Aggiungere `,` |
| Data in formato sbagliato (es. `2026/06/03`) | Evento non appare | Usare `"GG/MM/AAAA"` |
| Ora senza zero iniziale (es. `9:00`) | Potrebbe funzionare ma è rischioso | Usare `"09:00"` |
| Spazi prima/dopo i valori | Generalmente tollerato | Meglio evitare |
| Campo mancante (es. senza `link`) | Console warning, evento ignorato | Aggiungere tutti i 5 campi |

---

## 13. Dipendenze esterne

**Nessuna.** Dalla v2.2 le icone sono SVG inline disegnate nel motore. Zero CDN, zero framework, zero chiamate a terze parti. JavaScript vanilla. Il sistema funziona anche dietro firewall aziendali restrittivi.

---

## 14. Modalità Pausa Estiva (Vacanze)

### 14.1 Cosa fa

Durante una finestra di date configurabile, i widget sidebar (`diretta.html` e `indiretta.html`) mostrano un banner illustrato "Buone vacanze" (spiaggia, palma, tramonto anni '90) al posto della lista eventi. Il calendario mensile NON è coinvolto.

### 14.2 Come si attiva

In `events.js`, sezione 0, compilare le due date:

```javascript
var VACANZE = {
  inizio: "01/08/2026",     /* primo giorno di pausa  */
  fine:   "31/08/2026",     /* ultimo giorno di pausa */
};
```

### 14.3 Come si disattiva

Lasciare le date vuote:

```javascript
var VACANZE = {
  inizio: "",
  fine:   "",
};
```

### 14.4 Regole di funzionamento

| Regola | Comportamento |
|---|---|
| **Priorità assoluta** | Durante la finestra, il banner vacanze sostituisce TUTTO: eventi rolling, Q&A e sezione Academy Talk. Anche se nell'array restano eventi con date dentro la finestra, vengono ignorati. |
| **Auto-scadenza** | Il giorno dopo la data `fine`, il widget torna automaticamente a mostrare gli eventi. Nessun intervento manuale richiesto a settembre. |
| **Inclusività date** | La finestra include entrambi gli estremi: da `inizio` 00:00 a `fine` 23:59 (orario Roma). |
| **Scope** | Solo widget sidebar. Il calendario mensile (alpha) non è coinvolto. |
| **Testo** | Il messaggio è definito nel motore (`calendario.js`): menziona la pausa di webinar e Academy Talks, il ritorno a settembre e la disponibilità dei contenuti on-demand. |

### 14.5 Test consigliato prima del rilascio

Per verificare il banner in anteprima senza aspettare agosto: impostare temporaneamente `inizio` a oggi e `fine` a domani, aprire il widget, verificare il banner, poi ripristinare le date reali.

---

## Storico versioni

| Data | Versione | Modifiche |
|---|---|---|
| Maggio 2026 | v1.0 | Widget sidebar singolo con rolling 6 eventi |
| Maggio 2026 | v2.0 | Separazione diretta/indiretta, 3 array separati (WEBINAR, QA, TALKS), sezione Talk in fondo, cache-busting, design WK brand |
| Maggio 2026 | v3.0 (in sviluppo) | Calendario mensile con griglia lun-ven, navigazione 4 mesi, filtri, popup overflow, dot live |
| Luglio 2026 | v2.1 | Modalità Pausa Estiva: banner "Buone vacanze" illustrato (SVG inline) con finestra date configurabile in events.js, priorità assoluta, auto-scadenza |
| Luglio 2026 | v2.2 | Hardening e pulizia: escape HTML su titoli (caratteri speciali sicuri), validazione link (solo https), validazione orari (fine > inizio), icone SVG inline al posto del CDN Tabler (zero dipendenze esterne), CSS estratto in stile.css condiviso, ricarica automatica completa ogni 60 minuti per pagine lasciate aperte |
