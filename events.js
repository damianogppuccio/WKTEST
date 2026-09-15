/*  ╔══════════════════════════════════════════════════════════════════════╗
    ║                                                                      ║
    ║   📅  EVENTI ACADEMY — UNICO FILE DA MODIFICARE  📅                ║
    ║                                                                      ║
    ║   Sezioni:                                                          ║
    ║     • VACANZE        → periodi di pausa (estate/natale/pasqua)      ║
    ║     • WEBINAR / QA / TALKS                → canale GENYA            ║
    ║     • WEBINAR_ARCA / QA_ARCA / TALKS_ARCA → canale ARCA            ║
    ║                                                                      ║
    ║   ⚙️  Il widget filtra automaticamente gli eventi passati.          ║
    ║       Puoi lasciare eventi vecchi nella lista: verranno ignorati.   ║
    ║                                                                      ║
    ║   Formato per ogni riga:                                            ║
    ║     data        →  "GG/MM/AAAA"       (es. "03/06/2026")           ║
    ║     ora_inizio  →  "HH:MM"            (es. "10:00")                ║
    ║     ora_fine    →  "HH:MM"            (es. "11:30")                ║
    ║     titolo      →  "Nome evento"                                    ║
    ║     link        →  "https://..."       (URL iscrizione)             ║
    ║                                                                      ║
    ║   ⚠️  Ogni riga DEVE finire con una virgola  },                     ║
    ║       Se ne manca UNA SOLA, il calendario mostra                    ║
    ║       "Nessun webinar in programma".                                ║
    ║   ⚠️  NON usare apici singoli ' — solo doppi apici "               ║
    ║   ⚠️  NON usare il tasto TAB — solo spazi                          ║
    ║                                                                      ║
    ║   ✅  PRIMA DI CARICARE: incolla il file su jshint.com              ║
    ║       per verificare che non ci siano errori di sintassi.           ║
    ║                                                                      ║
    ╚══════════════════════════════════════════════════════════════════════╝ */


/* ═══════════════════════════════════════════════════════════════════
   SEZIONE 0 — PAUSE / VACANZE
   ───────────────────────────────────────────────────────────────────
   Tre periodi possibili, ognuno con il suo banner illustrato:
     tipo:"estate"  → banner spiaggia   (testo: ritorno a settembre)
     tipo:"natale"  → banner neve/abete (testo: ritorno a gennaio)
     tipo:"pasqua"  → banner primavera  (testo: ritorno a breve)

   Durante una finestra attiva, ENTRAMBI i canali (Genya e Arca)
   mostrano il banner al posto degli eventi (Talk inclusi).
   La finestra scade da sola dopo la data "fine".

   Per DISATTIVARE una pausa: cancella la sua riga.
   ═══════════════════════════════════════════════════════════════════ */

var VACANZE = [
  { tipo:"estate", inizio:"01/08/2026", fine:"31/08/2026" },
  { tipo:"natale", inizio:"23/12/2026", fine:"06/01/2027" },
  { tipo:"pasqua", inizio:"02/04/2027", fine:"06/04/2027" },
];


/* ╔══════════════════════════════════════════════════════════════════╗
   ║                      CANALE  GENYA                               ║
   ╚══════════════════════════════════════════════════════════════════╝ */

/* ═══════════════════════════════════════
   WEBINAR GENYA — visibili su diretta e indiretta
   ═══════════════════════════════════════ */

var WEBINAR = [
  { data:"01/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Overview",              link:"" },
  { data:"03/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità IVA base",  link:"" },
];


/* ═══════════════════════════════════════
   Q&A GENYA — visibili SOLO su diretta
   ═══════════════════════════════════════ */

var QA = [
  { data:"04/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",  link:"" },
];


/* ═══════════════════════════════════════
   ACADEMY TALKS GENYA — visibili su diretta e indiretta
   ═══════════════════════════════════════ */

var TALKS = [
];


/* ╔══════════════════════════════════════════════════════════════════╗
   ║                       CANALE  ARCA                               ║
   ║   Visibile solo su arca.html                                     ║
   ╚══════════════════════════════════════════════════════════════════╝ */

/* ═══════════════════════════════════════
   WEBINAR ARCA
   ═══════════════════════════════════════ */

var WEBINAR_ARCA = [
  { data:"03/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Arca Evolution: gestione magazzino",  link:"" },
  { data:"08/09/2026", ora_inizio:"14:30", ora_fine:"15:30", titolo:"Arca: ciclo attivo e fatturazione",   link:"" },
];


/* ═══════════════════════════════════════
   Q&A ARCA
   (predisposto per il futuro: al momento vuoto)
   ═══════════════════════════════════════ */

var QA_ARCA = [
];


/* ═══════════════════════════════════════
   ACADEMY TALKS ARCA
   ═══════════════════════════════════════ */

var TALKS_ARCA = [
];
