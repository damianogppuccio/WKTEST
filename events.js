/*  ╔══════════════════════════════════════════════════════════════════════╗
    ║                                                                      ║
    ║   📅  EVENTI ACADEMY — UNICO FILE DA MODIFICARE  📅                ║
    ║                                                                      ║
    ║   Quattro sezioni: VACANZE, WEBINAR, QA, TALKS                      ║
    ║   Compilare solo i campi indicati, non toccare altro.               ║
    ║                                                                      ║
    ║   ⚙️  Il widget filtra automaticamente gli eventi passati.          ║
    ║       Puoi lasciare eventi vecchi nella lista: verranno ignorati.   ║
    ║       Pulisci quando vuoi per tenere il file ordinato.              ║
    ║                                                                      ║
    ║   Formato per ogni riga:                                            ║
    ║     data        →  "GG/MM/AAAA"       (es. "03/06/2026")           ║
    ║     ora_inizio  →  "HH:MM"            (es. "10:00")                ║
    ║     ora_fine    →  "HH:MM"            (es. "11:30")                ║
    ║     titolo      →  "Nome evento"                                    ║
    ║     link        →  "https://..."       (URL iscrizione)             ║
    ║                                                                      ║
    ║   ⚠️  Ogni riga DEVE finire con una virgola                         ║
    ║   ⚠️  L'ultima riga di ogni sezione PUÒ avere la virgola           ║
    ║   ⚠️  NON usare apici singoli ' — solo doppi apici "               ║
    ║                                                                      ║
    ╚══════════════════════════════════════════════════════════════════════╝ */


/* ═══════════════════════════════════════
   SEZIONE 0 — PAUSA ESTIVA (VACANZE)
   Durante la finestra qui sotto, ENTRAMBI
   gli iframe mostrano il banner "Buone
   vacanze" al posto degli eventi
   (Talk inclusi: sparisce tutto).

   La finestra scade da sola: dopo la
   data "fine" il calendario torna
   automaticamente a mostrare gli eventi.

   Per DISATTIVARE le vacanze:
   lasciare le date vuote → inizio:"", fine:""
   ═══════════════════════════════════════ */

var VACANZE = {
  inizio: "01/07/2026",     /* primo giorno di pausa  (GG/MM/AAAA) */
  fine:   "31/07/2026",     /* ultimo giorno di pausa (GG/MM/AAAA) */
};


/* ═══════════════════════════════════════
   SEZIONE 1 — WEBINAR
   Visibili su ENTRAMBI gli iframe
   (diretta e indiretta)
   ═══════════════════════════════════════ */

var WEBINAR = [
  { data:"02/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Overview",                                       link:"https://academy.wolterskluwer.it/learn/learning-plans/55/overview/courses/676/overview-del-02072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"02/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità Generale Base ed Estratto Conto",    link:"https://academy.wolterskluwer.it/learn/learning-plans/79/contabilita-generale-base-ed-estratto-conto/courses/677/contabilita-generale-base-ed-estratto-conto-del-02072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"07/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Cespiti e leasing",                              link:"https://academy.wolterskluwer.it/learn/learning-plans/37/adempimperiodici-lipeintraaut/courses/679/adempimenti-periodici-lipeintraaut-del-07072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"07/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Liquidaz. IVA/Ritenute acc/F24",                 link:"https://academy.wolterskluwer.it/learn/learning-plans/50/liquidazione-iva-ritenute-acconto-f24/courses/681/liquidaz-ivaritenute-accf24-del-07072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"09/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Delega Unica & Telematici",                      link:"https://academy.wolterskluwer.it/learn/learning-plans/63/delega-unica-telematici/courses/684/delega-unica-telematici-del-09072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"09/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Modello Redditi Società",                        link:"https://academy.wolterskluwer.it/learn/learning-plans/54/modello-redditi-societa/courses/686/modello-redditi-societa-del-09072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"14/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità IVA base",                           link:"https://academy.wolterskluwer.it/learn/learning-plans/46/contabilita-iva-base/courses/693/contabilita-iva-base-del-14072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"14/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità IVA avanzato",                       link:"https://academy.wolterskluwer.it/learn/learning-plans/45/contabilita-iva-avanzata/courses/695/contabilita-iva-avanzato-del-14072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"15/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Parcellazione Base - Gestione Studio",           link:"https://academy.wolterskluwer.it/learn/learning-plans/56/parcellazione-e-gestione-studio/courses/697/parcellazione-base-gestione-studio-del-15072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"15/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Modello Redditi Società",                        link:"https://academy.wolterskluwer.it/learn/learning-plans/54/modello-redditi-societa/courses/687/modello-redditi-societa-del-15072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"21/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Cespiti e leasing",                              link:"https://academy.wolterskluwer.it/learn/learning-plans/41/cespiti-e-leasing/courses/698/cespiti-e-leasing-del-21072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"21/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Adempimenti periodici Lipe/Intra/Aut",           link:"https://academy.wolterskluwer.it/learn/learning-plans/37/adempimperiodici-lipeintraaut/courses/699/adempimenti-periodici-lipeintraaut-del-21072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"22/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità Generale Base ed Estratto Conto",    link:"https://academy.wolterskluwer.it/learn/learning-plans/79/contabilita-generale-base-ed-estratto-conto/courses/678/contabilita-generale-base-ed-estratto-conto-del-22072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"22/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità gen. avanzata",                      link:"https://academy.wolterskluwer.it/learn/learning-plans/43/contabilita-generale-avanzata/courses/680/contabilita-gen-avanzata-del-22072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"23/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Gestione Modello 730 e RPF",                     link:"https://academy.wolterskluwer.it/learn/learning-plans/80/gestione-modello-730-e-rpf/courses/685/gestione-modello-730-e-rpf-del-23072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"23/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Modello Redditi Società",                        link:"https://academy.wolterskluwer.it/learn/learning-plans/54/modello-redditi-societa/courses/688/modello-redditi-societa-del-23072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"28/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Bilancio Base",                                  link:"https://academy.wolterskluwer.it/learn/learning-plans/39/bilancio-base/courses/700/bilancio-base-del-28072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"28/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Bilancio Avanzato",                              link:"https://academy.wolterskluwer.it/learn/learning-plans/38/bilancio-avanzato/courses/701/bilancio-avanzato-del-28072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"30/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Contabilità IVA base",                           link:"https://academy.wolterskluwer.it/learn/learning-plans/46/contabilita-iva-base/courses/694/contabilita-iva-base-del-30072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"30/07/2026", ora_inizio:"11:15", ora_fine:"12:15", titolo:"Contabilità IVA avanzato",                       link:"https://academy.wolterskluwer.it/learn/learning-plans/45/contabilita-iva-avanzata/courses/696/contabilita-iva-avanzato-del-30072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
];


/* ═══════════════════════════════════════
   SEZIONE 2 — Q&A
   Visibili SOLO su iframe DIRETTA
   (nascosti su indiretta)
   ═══════════════════════════════════════ */

var QA = [
  { data:"10/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",      link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/689/sessione-di-qa-del-10072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"17/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",      link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/690/sessione-di-qa-del-17072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"24/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",      link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/691/sessione-di-qa-del-24072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
  { data:"31/07/2026", ora_inizio:"10:00", ora_fine:"11:00", titolo:"Sessione di Q&A",      link:"https://academy.wolterskluwer.it/learn/learning-plans/76/sessione-di-qa/courses/692/sessione-di-qa-del-31072026?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
];


/* ═══════════════════════════════════════
   SEZIONE 3 — ACADEMY TALKS
   Visibili su ENTRAMBI gli iframe
   Il widget mostra il prossimo Talk
   non ancora terminato, in fondo
   al calendario in evidenza.
   ═══════════════════════════════════════ */

var TALKS = [
  { data:"17/07/2026", ora_inizio:"11:00", ora_fine:"12:00", titolo:"Costruire una strategia AI in studio: dalla scelta degli strumenti alla governance dei dati", link:"https://academy.wolterskluwer.it/learn/courses/706/luglio-2026-costruire-una-strategia-ai-in-studio-dalla-scelta-degli-strumenti-alla-governance-dei-dati?utm_source=calendario_eventi&utm_medium=link&utm_campaign=ita_academy_genya_webinar_calendario_q1_202607" },
];
