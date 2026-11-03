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
  { data:"03/11/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Overview",                                     link:"https://academy.wolterskluwer.it/learn/learning-plans/55/overview/courses/885/overview-del-03112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"03/11/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità IVA base",                         link:"https://academy.wolterskluwer.it/learn/learning-plans/46/contabilita-iva-base/courses/886/contabilita-iva-base-del-03112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"04/11/2026", ora_inizio:"14:30", ora_fine:"15:30", titolo:"Contabilità Generale Base ed Estratto Conto",  link:"https://academy.wolterskluwer.it/learn/learning-plans/79/contabilita-generale-base-ed-estratto-conto/courses/890/contabilita-generale-base-ed-estratto-conto-del-04112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"05/11/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità IVA avanzato",                     link:"https://academy.wolterskluwer.it/learn/learning-plans/45/contabilita-iva-avanzata/courses/891/contabilita-iva-avanzato-del-05112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"05/11/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Liquidazione IVA/Ritenute acconto/F24",        link:"https://academy.wolterskluwer.it/learn/learning-plans/50/liquidazione-iva-ritenute-acconto-f24/courses/893/liquidazione-ivaritenute-accontof24-del-05112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"10/11/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Adempimenti periodici LIPE/Intrastat/Autofatture", link:"https://academy.wolterskluwer.it/learn/learning-plans/37/adempimenti-periodici-lipeintrastatautofatture/courses/895/adempimenti-periodici-lipeintraaut-del-10112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"10/11/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Delega Unica Telematici",                      link:"https://academy.wolterskluwer.it/learn/learning-plans/63/delega-unica-telematici/courses/896/delega-unica-telematici-del-10112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"11/11/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Attivazioni e Servizi Smart",                  link:"https://academy.wolterskluwer.it/learn/learning-plans/99/attivazioni-e-servizi-smart/courses/897/attivazioni-e-servizi-smart-del-11112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"11/11/2026", ora_inizio:"14:30", ora_fine:"15:30", titolo:"Liquidazione IVA/Ritenute acconto/F24",        link:"https://academy.wolterskluwer.it/learn/learning-plans/50/liquidazione-iva-ritenute-acconto-f24/courses/894/liquidazione-ivaritenute-accontof24-del-11112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"12/11/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità IVA base",                         link:"https://academy.wolterskluwer.it/learn/learning-plans/46/contabilita-iva-base/courses/887/contabilita-iva-base-del-12112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"12/11/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità IVA avanzato",                     link:"https://academy.wolterskluwer.it/learn/learning-plans/45/contabilita-iva-avanzata/courses/892/contabilita-iva-avanzato-del-12112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
];


/* ═══════════════════════════════════════
   Q&A GENYA — visibili SOLO su diretta
   ═══════════════════════════════════════ */

var QA = [
  { data:"06/11/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",  link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/888/sessione-di-qa-del-06112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
  { data:"13/11/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",  link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/889/sessione-di-qa-del-13112026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202611" },
];


/* ═══════════════════════════════════════
   ACADEMY TALKS GENYA — visibili su diretta e indiretta
   ═══════════════════════════════════════ */

var TALKS = [
  { data:"27/11/2026", ora_inizio:"11:00", ora_fine:"12:00", titolo:"Scegliere la piattaforma AI per lo studio senza diventarne prigionieri - parte 2", link:"https://academy.wolterskluwer.it/learn/courses/898/27112026-scegliere-la-piattaforma-ai-per-lo-studio-senza-diventarne-prigionieri-parte-2" },
];


/* ╔══════════════════════════════════════════════════════════════════╗
   ║                       CANALE  ARCA                               ║
   ║   Visibile solo su arca.html                                     ║
   ╚══════════════════════════════════════════════════════════════════╝ */

var WEBINAR_ARCA = [
  { data:"12/11/2026", ora_inizio:"11:00", ora_fine:"12:00", titolo:"Novità release di Arca Evolution",                     link:"https://academy.wolterskluwer.it/learn/courses/824/webinar-novita-release-del-12112026" },
  { data:"23/11/2026", ora_inizio:"11:00", ora_fine:"12:00", titolo:"Valorizzazioni di magazzino",                         link:"https://academy.wolterskluwer.it/learn/courses/825/valorizzazioni-di-magazzino-del-26112026" },
  { data:"21/12/2026", ora_inizio:"11:00", ora_fine:"12:00", titolo:"Procedure di fine anno – contabilità e magazzino",    link:"https://academy.wolterskluwer.it/learn/courses/827/procedure-di-fine-anno-contabilita-e-magazzino-del-22122026" },
];

var QA_ARCA = [
];

var TALKS_ARCA = [
  { data:"05/11/2026", ora_inizio:"15:00", ora_fine:"16:00", titolo:"L'azienda che funziona anche quando non ci sei: l'arte dell'organizzazione e della delega", link:"https://zoom.us/webinar/register/WN_O_8dYekwRDuE1ZgibhRp-w#/registration" },
  { data:"10/11/2026", ora_inizio:"11:00", ora_fine:"12:00", titolo:"Attrazione e gestione di risorse di talento in azienda",  link:"https://academy.wolterskluwer.it/learn/courses/823/10112026-attrazione-e-gestione-di-risorse-di-talento-in-azienda" },
  { data:"10/12/2026", ora_inizio:"11:00", ora_fine:"12:00", titolo:"Adeguati assetti e organizzazione aziendale",       link:"https://academy.wolterskluwer.it/learn/courses/826/10122026-adeguati-assetti-e-organizzazione-aziendale" },
];
