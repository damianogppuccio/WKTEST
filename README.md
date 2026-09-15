# Calendario Webinar Academy — Sistema Widget per Docebo

Sistema di widget per la piattaforma WK Academy (Docebo) che mostra i prossimi webinar, le sessioni Q&A e gli Academy Talks sulle homepage **Genya** (Diretta e Indiretta) e **Arca**.

Versione: **v3.0** — canale Arca + tre finestre vacanze (estate/natale/pasqua).

---

## Indice

1. [Panoramica del sistema](#1-panoramica-del-sistema)
2. [Architettura file](#2-architettura-file)
3. [Setup su Docebo](#3-setup-su-docebo)
4. [Guida alla compilazione di events.js](#4-guida-alla-compilazione-di-eventsjs)
5. [I canali: Genya e Arca](#5-i-canali-genya-e-arca)
6. [Logica automatica dei widget](#6-logica-automatica-dei-widget)
7. [Badge e stati degli eventi](#7-badge-e-stati-degli-eventi)
8. [Modalità vacanze (tre finestre)](#8-modalità-vacanze-tre-finestre)
9. [Gestione della cache](#9-gestione-della-cache)
10. [Visibilità eventi per canale](#10-visibilità-eventi-per-canale)
11. [Palette colori e stile](#11-palette-colori-e-stile)
12. [Manutenzione ordinaria](#12-manutenzione-ordinaria)
13. [Troubleshooting](#13-troubleshooting)
14. [Dipendenze esterne](#14-dipendenze-esterne)
15. [Storico versioni](#15-storico-versioni)

---

## 1. Panoramica del sistema

Il sistema è composto da tre widget iframe che condividono lo stesso file dati (`events.js`) e lo stesso motore (`calendario.js`):

| Widget | Homepage | Cosa mostra | Dimensioni iframe |
|---|---|---|---|
| **`diretta.html`** | Genya Diretta | Webinar + Q&A + Talks Genya | 736 × 440 px |
| **`indiretta.html`** | Genya Indiretta | Webinar + Talks Genya (NO Q&A) | 736 × 440 px |
| **`arca.html`** | Arca | Webinar + Talks Arca (Q&A predisposti) | 736 × 440 px |

I widget sono caricati tramite **iframe** perché Docebo rimuove il JavaScript dai widget HTML nativi.

---

## 2. Architettura file

```
📁 cartella sul server (es. https://vostrosito.it/academy/calendario/)
│
├── events.js         ← 🔴 UNICO FILE DA MODIFICARE
│                        Tutti gli eventi + le finestre vacanze
│
├── calendario.js     ← ⚙️ Motore condiviso — NON MODIFICARE
│
├── stile.css         ← 🎨 Stile condiviso — NON MODIFICARE
│
├── diretta.html      ← 📺 Genya Diretta   (CANALE genya, MOSTRA_QA true)
├── indiretta.html    ← 📺 Genya Indiretta (CANALE genya, MOSTRA_QA false)
├── arca.html         ← 📺 Arca            (CANALE arca)
│
└── README.md         ← 📖 Questo file
```

**Regola d'oro**: si modifica solo `events.js`. Tutti gli altri file sono fissi.

Gli HTML si distinguono per due sole variabili dichiarate al loro interno:
- `CANALE` → `"genya"` o `"arca"` (decide quali sezioni di `events.js` leggere)
- `MOSTRA_QA` → `true` o `false` (decide se mostrare i Q&A)

---

## 3. Setup su Docebo

### 3.1 Caricamento file sul server

Caricare **tutti i file** nella stessa cartella su un server web accessibile. Il server deve servire `.html`, `.js`, `.css` con i corretti MIME type e non bloccare l'embedding in iframe (header `X-Frame-Options` / `Content-Security-Policy` non restrittivi verso il dominio Docebo).

### 3.2 Configurazione widget su Docebo

Per ogni homepage, aggiungere un widget di tipo **iframe**:

| Homepage | URL iframe | Altezza |
|---|---|---|
| Genya Diretta | `.../diretta.html` | 440 px |
| Genya Indiretta | `.../indiretta.html` | 440 px |
| Arca | `.../arca.html` | 440 px |

Titolo widget: lasciare **vuoto** (l'header è già dentro il widget).

---

## 4. Guida alla compilazione di events.js

### 4.1 Struttura del file

```
events.js
│
├── var VACANZE = [ ... ]        ← finestre di pausa (estate/natale/pasqua)
│
├── CANALE GENYA
│   ├── var WEBINAR = [ ... ]
│   ├── var QA = [ ... ]
│   └── var TALKS = [ ... ]
│
└── CANALE ARCA
    ├── var WEBINAR_ARCA = [ ... ]
    ├── var QA_ARCA = [ ... ]
    └── var TALKS_ARCA = [ ... ]
```

### 4.2 Formato di ogni riga evento

```javascript
{ data:"03/09/2026", ora_inizio:"10:00", ora_fine:"11:30", titolo:"Nome evento", link:"https://..." },
```

| Campo | Formato | Note |
|---|---|---|
| `data` | `"GG/MM/AAAA"` | Formato italiano con zero iniziale |
| `ora_inizio` | `"HH:MM"` | Formato 24h, orario Roma |
| `ora_fine` | `"HH:MM"` | Deve essere successiva a `ora_inizio` |
| `titolo` | testo | Nome evento come apparirà nel widget |
| `link` | `"https://..."` | URL iscrizione/accesso su Docebo |

### 4.3 Regole di sintassi

| Regola | Corretto | Sbagliato |
|---|---|---|
| Ogni riga finisce con virgola | `...link:"..." },` | `...link:"..." }` |
| Solo doppi apici | `titolo:"Nome"` | `titolo:'Nome'` |
| Niente TAB | spazi | tab |

⚠️ **Una sola virgola mancante** blocca l'intero calendario (mostra "Nessun webinar in programma"). Prima di caricare, incollare il file su **jshint.com** per verificare la sintassi.

### 4.4 Capienza array

Non c'è un limite tecnico rigido: il widget filtra gli eventi passati, quindi si possono accumulare centinaia di righe. Pulire periodicamente lo storico per leggibilità.

---

## 5. I canali: Genya e Arca

Il sistema serve due prodotti distinti, ciascuno con le proprie sezioni in `events.js`.

### 5.1 Come funziona

Ogni HTML dichiara la variabile `CANALE`. Il motore, in base ad essa, legge le sezioni corrispondenti:

| CANALE | Webinar letti da | Q&A letti da | Talks letti da | Header |
|---|---|---|---|---|
| `"genya"` | `WEBINAR` | `QA` | `TALKS` | "Calendario webinar Genya" |
| `"arca"` | `WEBINAR_ARCA` | `QA_ARCA` | `TALKS_ARCA` | "Calendario webinar Arca" |

I due mondi sono completamente separati: un evento Arca non appare mai su Genya e viceversa.

### 5.2 Q&A Arca

Le sessioni Q&A Arca sono **predisposte** (`QA_ARCA`) ma al momento la sezione è vuota. Quando serviranno, basterà compilarla come per Genya: appariranno automaticamente su `arca.html` (che ha `MOSTRA_QA = true`).

---

## 6. Logica automatica dei widget

### 6.1 Rolling degli eventi

Il widget mostra i prossimi eventi **non ancora terminati** del proprio canale, ordinati per data/ora, filtrando via il passato.

### 6.2 Slot dinamici

| Academy Talk attivo? | N. eventi rolling | Totale |
|---|---|---|
| Sì | 5 | 5 rolling + 1 Talk in fondo |
| No | 6 | 6 rolling |

### 6.3 Academy Talk

Appare in fondo in una sezione verde dedicata (icona microfono). Il widget mostra il primo Talk non ancora terminato; quando finisce, passa al successivo; se non ce ne sono, la sezione sparisce e i rolling diventano 6.

---

## 7. Badge e stati degli eventi

| Stato | Condizione | Badge | Dot timeline |
|---|---|---|---|
| Futuro | inizio > adesso + 30 min | nessuno | Verde (Q&A: blu) |
| Tra poco live | ≤ 30 min all'inizio | **Tra poco live** (arancione) | Arancione |
| LIVE | in corso | **● LIVE** (rosso lampeggiante) | Rosso |
| Terminato | adesso ≥ fine | scompare | — |

I badge si aggiornano ogni 30 secondi. Tutti gli orari sono interpretati come **Europe/Rome** (CET/CEST), quindi corretti anche se il browser dell'utente è in un altro fuso.

---

## 8. Modalità vacanze (tre finestre)

### 8.1 Cosa fa

Durante un periodo di pausa configurato, **tutti i widget** (Genya e Arca) mostrano un banner illustrato al posto della lista eventi. Tre periodi possibili, ciascuno con grafica e messaggio dedicati:

| Tipo | Banner | Messaggio (ritorno) |
|---|---|---|
| `estate` | Spiaggia, palma, tramonto | "…a settembre" |
| `natale` | Notte, neve, abete decorato | "…a gennaio" |
| `pasqua` | Primavera, sole, prato fiorito | "…a breve" |

### 8.2 Come si configura

In `events.js`, sezione 0, l'array `VACANZE`:

```javascript
var VACANZE = [
  { tipo:"estate", inizio:"01/08/2026", fine:"31/08/2026" },
  { tipo:"natale", inizio:"23/12/2026", fine:"06/01/2027" },
  { tipo:"pasqua", inizio:"02/04/2027", fine:"06/04/2027" },
];
```

Ogni riga è una finestra. Il `tipo` determina quale banner mostrare.

### 8.3 Come si disattiva una pausa

Cancellare la sua riga dall'array. Per disattivarle tutte, lasciare l'array vuoto: `var VACANZE = [];`

### 8.4 Regole di funzionamento

| Regola | Comportamento |
|---|---|
| **Finestre condivise** | Le stesse date valgono per Genya e Arca insieme |
| **Priorità assoluta** | Durante una finestra, il banner sostituisce tutto (eventi, Q&A, Talk) |
| **Auto-scadenza** | Dopo la data `fine`, il widget torna automaticamente agli eventi. Nessun intervento manuale |
| **Inclusività date** | La finestra include entrambi gli estremi: da `inizio` 00:00 a `fine` 23:59 (orario Roma) |
| **Sovrapposizioni** | Se due finestre si sovrapponessero, vince la prima nell'array |

### 8.5 Animazione durante la pausa

Il widget non resta fermo sull'immagine: cicla tra due viste con transizione a scorrimento orizzontale (0,6s):

| Fase | Durata | Cosa mostra |
|---|---|---|
| Immagine | 20 secondi | Banner della pausa |
| Calendario | 60 secondi | I prossimi eventi reali (dopo la pausa): il cliente vede cosa lo aspetta al rientro |

Ciclo: immagine → calendario → immagine → … finché dura la finestra. I badge LIVE restano attivi nella fase calendario. Alla fine della finestra il ciclo si ferma da solo.

### 8.6 Test consigliato prima del rilascio

Per vedere un banner in anteprima senza aspettare la data reale: aggiungere temporaneamente una riga a `VACANZE` con `inizio` = oggi e `fine` = domani e il `tipo` desiderato, aprire il widget, verificare, poi rimuovere la riga di test.

---

## 9. Gestione della cache

### 9.1 Cache-busting con timestamp

Ogni widget carica `events.js` e `calendario.js` con un parametro timestamp (`?v=1716912345678`) che cambia ad ogni apertura della pagina. Il browser vede un URL diverso ogni volta e scarica sempre la versione fresca.

### 9.2 Ricarica automatica

I badge si aggiornano ogni 30 secondi. Inoltre ogni **60 minuti** la pagina si ricarica del tutto, così anche chi tiene la homepage aperta a lungo riceve gli aggiornamenti di `events.js`.

### 9.3 Meta tag

Gli HTML contengono meta tag anti-cache (`Cache-Control`, `Pragma`, `Expires`) come rete di sicurezza.

---

## 10. Visibilità eventi per canale

| Tipo evento | `diretta.html` | `indiretta.html` | `arca.html` |
|---|---|---|---|
| WEBINAR (Genya) | ✅ | ✅ | ❌ |
| QA (Genya) | ✅ | ❌ | ❌ |
| TALKS (Genya) | ✅ | ✅ | ❌ |
| WEBINAR_ARCA | ❌ | ❌ | ✅ |
| QA_ARCA | ❌ | ❌ | ✅ (quando compilati) |
| TALKS_ARCA | ❌ | ❌ | ✅ |

Le finestre vacanze valgono invece per **tutti e tre** i widget.

---

## 11. Palette colori e stile

| Colore | Hex | Uso |
|---|---|---|
| WK Blue | `#007AC3` | Header, date, bordi, dot Q&A |
| WK Green | `#85BC20` | Tratto accent, dot futuri, sezione Talk |
| WK Red | `#E2231A` | Badge LIVE |
| WK Dark | `#353535` | Testo titoli |

Font: `'Segoe UI', Arial, sans-serif`. Header e branding identici tra Genya e Arca: cambia solo il titolo. I banner vacanze usano palette dedicate per stagione (tramonto estivo, notte natalizia, primavera pasquale).

---

## 12. Manutenzione ordinaria

### 12.1 Aggiungere eventi

1. Aprire `events.js`
2. Individuare la sezione corretta (canale + tipo)
3. Copiare una riga esistente e modificarne i valori
4. Verificare la virgola finale
5. (Consigliato) validare su jshint.com
6. Salvare

### 12.2 Procedura mensile consigliata

A inizio mese: cancellare le righe del mese passato in tutte le sezioni, aggiungere gli eventi nuovi, validare, salvare.

### 12.3 Cosa NON toccare

`calendario.js`, `stile.css`, i tre file `.html`, e la struttura delle righe in `events.js` (nomi campi, parentesi, virgolette).

---

## 13. Troubleshooting

| Sintomo | Causa probabile | Soluzione |
|---|---|---|
| Widget non visibile su Docebo | Server blocca iframe | Verificare con IT gli header `X-Frame-Options` / CSP |
| "Errore caricamento eventi" | `events.js` mancante o con errore di sintassi | Verificare che sia nella stessa cartella; validare su jshint.com |
| "Errore caricamento motore" | `calendario.js` mancante | Verificare presenza file |
| "Nessun webinar in programma" | Eventi tutti passati, oppure virgola mancante | Aggiungere eventi futuri / correggere la sintassi |
| Codice JS mostrato come testo | Inserito come widget HTML invece che iframe | Usare widget **iframe** |
| Badge LIVE non si attiva | Orario non corrisponde all'ora italiana | Il widget usa Europe/Rome |
| Arca mostra eventi Genya (o viceversa) | Evento nella sezione sbagliata | Spostare l'evento nella sezione del canale giusto |
| Banner vacanze non appare | Finestra non attiva o data errata | Verificare le date in `VACANZE` (formato GG/MM/AAAA) |

### 13.1 Errori comuni in events.js

| Errore | Fix |
|---|---|
| Apice singolo `'` | Usare `"` |
| Virgola mancante a fine riga | Aggiungere `,` |
| Data formato sbagliato (`2026/09/03`) | Usare `"GG/MM/AAAA"` |
| TAB al posto di spazi | Usare spazi |
| Campo mancante | Inserire tutti i 5 campi |

---

## 14. Dipendenze esterne

**Nessuna.** Le icone sono SVG inline nel motore. Zero CDN, zero framework, zero chiamate a terze parti. JavaScript vanilla. Funziona anche dietro firewall aziendali restrittivi.

---

## 15. Storico versioni

| Data | Versione | Modifiche |
|---|---|---|
| Maggio 2026 | v1.0 | Widget sidebar singolo, rolling 6 eventi |
| Maggio 2026 | v2.0 | Separazione diretta/indiretta, sezioni WEBINAR/QA/TALKS, Talk in fondo, cache-busting, brand WK |
| Luglio 2026 | v2.1 | Modalità pausa estiva: banner "Buone vacanze" (SVG inline), finestra date, auto-scadenza |
| Luglio 2026 | v2.2 | Hardening: escape HTML, validazione link/orari, icone SVG inline (no CDN), stile.css condiviso, reload 60 min |
| Luglio 2026 | v2.3 | Animazione pausa: ciclo immagine (20s) ↔ prossimi eventi (60s) con slide orizzontale |
| Settembre 2026 | v3.0 | Canale **Arca** (sezioni dedicate + `arca.html`); tre finestre vacanze **estate/natale/pasqua** con banner e messaggi dedicati; testo banner aggiornato ("webinar e Academy Talks") |
