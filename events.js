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

   Durante una finestra attiva, TUTTI i widget (Genya e Arca)
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
  { data:"01/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Overview",                                         link:"https://academy.wolterskluwer.it/learn/learning-plans/55/overview/courses/769/overview-del-01092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"01/09/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità IVA base",                             link:"https://academy.wolterskluwer.it/learn/learning-plans/46/contabilita-iva-base/courses/772/contabilita-iva-base-del-01092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"02/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità IVA avanzato",                         link:"https://academy.wolterskluwer.it/learn/learning-plans/45/contabilita-iva-avanzata/courses/775/contabilita-iva-avanzato-del-02092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"02/09/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Liquidazione IVA/Ritenute acconto/F24",            link:"https://academy.wolterskluwer.it/learn/learning-plans/50/liquidazione-iva-ritenute-acconto-f24/courses/778/liquidaz-ivaritenute-accf24-del-02092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"03/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Adempimenti periodici Lipe/Intrastat/Autofatture", link:"https://academy.wolterskluwer.it/learn/learning-plans/37/adempimenti-periodici-lipeintrastatautofatture/courses/781/adempimenti-periodici-lipeintrastatautofatture-del-03092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"03/09/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Telematici & Dichiarazioni Integrative",           link:"https://academy.wolterskluwer.it/learn/learning-plans/59/telematici-dichiarazioni-integrative/courses/783/telematici-dichiarazioni-integrative-del-03092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"08/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità Generale Base ed Estratto Conto",      link:"https://academy.wolterskluwer.it/learn/learning-plans/79/contabilita-generale-base-ed-estratto-conto/courses/796/contabilita-generale-base-ed-estratto-conto-del-08092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"08/09/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità Generale Avanzata",                    link:"https://academy.wolterskluwer.it/learn/learning-plans/43/contabilita-generale-avanzata/courses/798/contabilita-generale-avanzata-del-08092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"09/09/2026", ora_inizio:"14:30", ora_fine:"15:30", titolo:"Modello 770",                                      link:"https://academy.wolterskluwer.it/learn/learning-plans/51/modello-770/courses/791/modello-770-del-09092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"10/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Overview",                                         link:"https://academy.wolterskluwer.it/learn/learning-plans/55/overview/courses/770/overview-del-10092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"10/09/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità IVA base",                             link:"https://academy.wolterskluwer.it/learn/learning-plans/46/contabilita-iva-base/courses/773/contabilita-iva-base-del-10092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"15/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità IVA avanzato",                         link:"https://academy.wolterskluwer.it/learn/learning-plans/45/contabilita-iva-avanzata/courses/776/contabilita-iva-avanzato-del-15092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"15/09/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Liquidazione IVA/Ritenute acconto/F24",            link:"https://academy.wolterskluwer.it/learn/learning-plans/50/liquidazione-iva-ritenute-acconto-f24/courses/780/liquidazione-ivaritenute-accontof24-del-15092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"22/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Overview",                                         link:"https://academy.wolterskluwer.it/learn/learning-plans/55/overview/courses/771/overview-del-22092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"22/09/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità IVA base",                             link:"https://academy.wolterskluwer.it/learn/learning-plans/46/contabilita-iva-base/courses/774/contabilita-iva-base-del-22092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"23/09/2026", ora_inizio:"14:30", ora_fine:"15:30", titolo:"Contabilità Generale Base ed Estratto Conto",      link:"https://academy.wolterskluwer.it/learn/learning-plans/79/contabilita-generale-base-ed-estratto-conto/courses/797/contabilita-generale-base-ed-estratto-conto-del-23092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"24/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Adempimenti periodici Lipe/Intrastat/Autofatture", link:"https://academy.wolterskluwer.it/learn/learning-plans/37/adempimenti-periodici-lipeintrastatautofatture/courses/782/adempimenti-periodici-lipeintrastatautofatture-del-24092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"24/09/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Parcellazione base - Gestione studio",             link:"https://academy.wolterskluwer.it/learn/learning-plans/56/parcellazione-e-gestione-studio/courses/784/parcellazione-base-gestione-studio-del-24092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"29/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Genya News - Novità e rilasci",                    link:"https://academy.wolterskluwer.it/learn/learning-plans/96/genya-news-novita-e-rilasci?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"30/09/2026", ora_inizio:"11:30", ora_fine:"12:30", titolo:"Contabilità Generale Avanzata",                    link:"https://academy.wolterskluwer.it/learn/learning-plans/43/contabilita-generale-avanzata/courses/800/contabilita-generale-avanzata-del-30092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"30/09/2026", ora_inizio:"14:30", ora_fine:"15:30", titolo:"Modello 770",                                      link:"https://academy.wolterskluwer.it/learn/learning-plans/51/modello-770/courses/792/modello-770-del-30092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
];


/* ═══════════════════════════════════════
   Q&A GENYA — visibili SOLO su diretta
   ═══════════════════════════════════════ */

var QA = [
  { data:"04/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",      link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/787/sessione-di-qa-del-04092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"11/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",      link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/788/sessione-di-qa-del-11092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"18/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",      link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/789/sessione-di-qa-del-18092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
  { data:"25/09/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",      link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/790/sessione-di-qa-del-25092026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
];


/* ═══════════════════════════════════════
   ACADEMY TALKS GENYA — visibili su diretta e indiretta
   ═══════════════════════════════════════ */

var TALKS = [
  { data:"25/09/2026", ora_inizio:"11:00", ora_fine:"12:00", titolo:"Scegliere la piattaforma AI per lo studio senza diventarne prigionieri", link:"https://academy.wolterskluwer.it/learn/courses/707/25092026-scegliere-la-piattaforma-ai-per-lo-studio-senza-diventarne-prigionieri?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202609" },
];


/* ╔══════════════════════════════════════════════════════════════════╗
   ║                       CANALE  ARCA                               ║
   ║   Visibile solo su arca.html                                     ║
   ╚══════════════════════════════════════════════════════════════════╝ */

var WEBINAR_ARCA = [
];

var QA_ARCA = [
];

var TALKS_ARCA = [
];
