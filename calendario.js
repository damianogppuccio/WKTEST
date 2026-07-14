/* ══════════════════════════════════════════════════════════════════
   MOTORE CALENDARIO — NON MODIFICARE QUESTO FILE
   Modificare solo events.js
   v2.2 — escape HTML, icone SVG inline (zero CDN), validazione orari
   ══════════════════════════════════════════════════════════════════ */

(function(){

  var MESI = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  var GIORNI = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];

  /* ── Icone SVG inline (nessuna dipendenza esterna) ── */
  var ICONS = {
    calendar: function(size){ return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="4" y1="11" x2="20" y2="11"/><circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none"/></svg>'; },
    clock: function(size){ return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>'; },
    chevron: function(size){ return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>'; },
    mic: function(size){ return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="21"/></svg>'; }
  };

  /* ── Sicurezza: escape per testo e attributi HTML ── */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeLink(url) {
    var u = String(url == null ? '' : url).trim();
    if (!u) return '#';
    /* Solo http/https, tutto il resto diventa # */
    if (!/^https?:\/\//i.test(u)) {
      console.warn('[Calendario] Link non valido (deve iniziare con https://): "' + u + '"');
      return '#';
    }
    return esc(u);
  }

  /* ── Parsing date con validazione ── */
  function parseDate(dateStr, timeStr) {
    if (!dateStr || !timeStr) {
      console.warn('[Calendario] Riga con data o ora mancante — ignorata.');
      return null;
    }
    var d = String(dateStr).split('/');
    var t = String(timeStr).split(':');
    if (d.length !== 3 || t.length !== 2) {
      console.warn('[Calendario] Formato errato: "' + dateStr + '" / "' + timeStr + '" — usare GG/MM/AAAA e HH:MM');
      return null;
    }
    var dt = new Date(+d[2], +d[1]-1, +d[0], +t[0], +t[1], 0);
    if (isNaN(dt.getTime())) {
      console.warn('[Calendario] Data non valida: "' + dateStr + ' ' + timeStr + '"');
      return null;
    }
    return dt;
  }

  function nowRome() {
    return new Date(new Date().toLocaleString('en-US', { timeZone:'Europe/Rome' }));
  }

  /* ── Badge live / tra poco live ── */
  function badgeHTML(now, start, end) {
    var diff = start - now;
    var isLive = now >= start && now < end;
    var isSoon = !isLive && diff > 0 && diff <= 30 * 60 * 1000;
    if (isLive) return { dot:'ev-dot-live', html:'<span class="badge-live">\u25CF LIVE</span>' };
    if (isSoon) return { dot:'ev-dot-soon', html:'<span class="badge-soon">Tra poco live</span>' };
    return { dot:'ev-dot-future', html:'' };
  }

  /* ── Riga evento rolling ── */
  function buildRow(e, now, showQaTag) {
    var dd = ('0' + e.start.getDate()).slice(-2);
    var mm = MESI[e.start.getMonth()];
    var gg = GIORNI[e.start.getDay()];
    var b  = badgeHTML(now, e.start, e.end);

    var dotClass = b.dot;
    if (e.tipo === 'qa' && dotClass === 'ev-dot-future') dotClass = 'ev-dot-qa';

    var qaBadge = (showQaTag && e.tipo === 'qa')
      ? '<span class="badge-qa">Q&amp;A</span>'
      : '';

    var rowBg = (e.tipo === 'qa') ? ' ev-row-qa' : '';

    return ''
      + '<a class="ev-row' + rowBg + '" href="' + safeLink(e.link) + '" target="_blank" rel="noopener">'
      +   '<div class="ev-timeline">'
      +     '<div class="ev-dot ' + dotClass + '"></div>'
      +   '</div>'
      +   '<div class="ev-content">'
      +     '<div class="ev-date">'
      +       '<div class="ev-dd">' + dd + '</div>'
      +       '<div class="ev-mm">' + mm + '</div>'
      +     '</div>'
      +     '<div class="ev-info">'
      +       '<div class="ev-name">' + esc(e.titolo) + '</div>'
      +       '<div class="ev-time">'
      +         ICONS.clock(12)
      +         gg + ' \u00B7 ' + esc(e.oi) + ' \u2013 ' + esc(e.of)
      +       '</div>'
      +     '</div>'
      +     b.html
      +     qaBadge
      +     '<span class="ev-chevron">' + ICONS.chevron(15) + '</span>'
      +   '</div>'
      + '</a>';
  }

  /* ── Sezione Academy Talk ── */
  function buildTalk(talk, now) {
    var dd = ('0' + talk.start.getDate()).slice(-2);
    var mm = MESI[talk.start.getMonth()];
    var gg = GIORNI[talk.start.getDay()];
    var b  = badgeHTML(now, talk.start, talk.end);

    return ''
      + '<a class="talk-row" href="' + safeLink(talk.link) + '" target="_blank" rel="noopener">'
      +   '<div class="talk-icon">' + ICONS.mic(18) + '</div>'
      +   '<div class="talk-info">'
      +     '<div class="talk-label">Academy Talk</div>'
      +     '<div class="talk-name">' + esc(talk.titolo) + '</div>'
      +     '<div class="talk-time">'
      +       ICONS.calendar(12)
      +       dd + ' ' + mm + ' \u00B7 ' + gg + ' \u00B7 ' + esc(talk.oi) + ' \u2013 ' + esc(talk.of)
      +     '</div>'
      +   '</div>'
      +   b.html
      +   '<span class="talk-chevron">' + ICONS.chevron(15) + '</span>'
      + '</a>';
  }

  /* ── Normalizzazione array eventi ── */
  function prepareList(arr, tipo) {
    if (!arr || !Array.isArray(arr)) return [];
    return arr
      .map(function(e) {
        var s = parseDate(e.data, e.ora_inizio);
        var f = parseDate(e.data, e.ora_fine);
        if (!s || !f) return null;
        if (f <= s) {
          console.warn('[Calendario] "' + e.titolo + '" (' + e.data + '): ora_fine (' + e.ora_fine + ') non successiva a ora_inizio (' + e.ora_inizio + ') — evento ignorato.');
          return null;
        }
        return { start:s, end:f, titolo:e.titolo, link:e.link, oi:e.ora_inizio, of:e.ora_fine, tipo:tipo };
      })
      .filter(function(e) { return e !== null; });
  }

  /* ── Modalità vacanze ── */
  function inVacanze(now) {
    if (typeof VACANZE === 'undefined' || !VACANZE) return false;
    if (!VACANZE.inizio || !VACANZE.fine) return false;
    var i = parseDate(VACANZE.inizio, '00:00');
    var f = parseDate(VACANZE.fine, '23:59');
    if (!i || !f) return false;
    return now >= i && now <= f;
  }

  function buildVacanze() {
    return ''
      + '<div style="position:relative;flex-shrink:0;">'
      + '<svg viewBox="0 0 736 210" preserveAspectRatio="xMidYMax slice" style="display:block;width:100%;height:210px;" aria-hidden="true">'
      +   '<defs>'
      +     '<linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#3D2B8C"/><stop offset="30%" stop-color="#8B3A9E"/>'
      +       '<stop offset="55%" stop-color="#E85A8A"/><stop offset="78%" stop-color="#FF8C5A"/>'
      +       '<stop offset="100%" stop-color="#FFC170"/>'
      +     '</linearGradient>'
      +     '<linearGradient id="vsun" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#FFF3A0"/><stop offset="55%" stop-color="#FFD05C"/>'
      +       '<stop offset="100%" stop-color="#FF7A45"/>'
      +     '</linearGradient>'
      +     '<linearGradient id="vsea" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#FF9E6B"/><stop offset="25%" stop-color="#D96A9B"/>'
      +       '<stop offset="70%" stop-color="#7A4BA8"/><stop offset="100%" stop-color="#4A3492"/>'
      +     '</linearGradient>'
      +     '<linearGradient id="vsand" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#F2D9A0"/><stop offset="100%" stop-color="#E8C382"/>'
      +     '</linearGradient>'
      +     '<clipPath id="vsunclip"><circle cx="368" cy="118" r="52"/></clipPath>'
      +   '</defs>'
      +   '<rect x="0" y="0" width="736" height="140" fill="url(#vsky)"/>'
      +   '<circle cx="368" cy="118" r="52" fill="url(#vsun)"/>'
      +   '<g clip-path="url(#vsunclip)">'
      +     '<rect x="300" y="124" width="140" height="4" fill="#8B3A9E" opacity=".5"/>'
      +     '<rect x="300" y="134" width="140" height="6" fill="#8B3A9E" opacity=".5"/>'
      +     '<rect x="300" y="146" width="140" height="8" fill="#8B3A9E" opacity=".5"/>'
      +     '<rect x="300" y="160" width="140" height="12" fill="#8B3A9E" opacity=".5"/>'
      +   '</g>'
      +   '<ellipse cx="150" cy="45" rx="55" ry="6" fill="#FF9EC4" opacity=".45"/>'
      +   '<ellipse cx="190" cy="58" rx="35" ry="4" fill="#FF9EC4" opacity=".35"/>'
      +   '<ellipse cx="580" cy="38" rx="60" ry="6" fill="#FFB08A" opacity=".4"/>'
      +   '<ellipse cx="545" cy="52" rx="38" ry="4" fill="#FFB08A" opacity=".3"/>'
      +   '<rect x="0" y="140" width="736" height="42" fill="url(#vsea)"/>'
      +   '<g opacity=".7">'
      +     '<rect x="338" y="144" width="60" height="3" rx="1.5" fill="#FFD05C" opacity=".8"/>'
      +     '<rect x="348" y="151" width="44" height="3" rx="1.5" fill="#FFC050" opacity=".65"/>'
      +     '<rect x="332" y="158" width="70" height="3" rx="1.5" fill="#FFB048" opacity=".5"/>'
      +     '<rect x="352" y="165" width="38" height="3" rx="1.5" fill="#FFA040" opacity=".4"/>'
      +     '<rect x="340" y="172" width="56" height="3" rx="1.5" fill="#FF9038" opacity=".3"/>'
      +   '</g>'
      +   '<path d="M0 148 Q30 145 60 148 T120 148 T180 148 T240 148" stroke="#FFB0D0" stroke-width="1.5" fill="none" opacity=".4"/>'
      +   '<path d="M480 155 Q510 152 540 155 T600 155 T660 155 T736 155" stroke="#FFB0D0" stroke-width="1.5" fill="none" opacity=".35"/>'
      +   '<path d="M60 168 Q90 165 120 168 T180 168" stroke="#C08AD0" stroke-width="1.5" fill="none" opacity=".4"/>'
      +   '<path d="M540 172 Q570 169 600 172 T660 172" stroke="#C08AD0" stroke-width="1.5" fill="none" opacity=".35"/>'
      +   '<path d="M0 210 L0 186 Q120 174 280 182 Q460 191 736 178 L736 210 Z" fill="url(#vsand)"/>'
      +   '<path d="M0 186 Q120 174 280 182 Q460 191 736 178" stroke="#FFF4DC" stroke-width="2.5" fill="none" opacity=".85"/>'
      +   '<g fill="#D4A96A" opacity=".5">'
      +     '<circle cx="90" cy="196" r="1.3"/><circle cx="150" cy="200" r="1"/><circle cx="220" cy="193" r="1.2"/>'
      +     '<circle cx="320" cy="199" r="1"/><circle cx="420" cy="201" r="1.3"/><circle cx="500" cy="195" r="1"/>'
      +     '<circle cx="580" cy="199" r="1.2"/><circle cx="660" cy="192" r="1"/><circle cx="60" cy="203" r="1"/>'
      +   '</g>'
      +   '<g transform="translate(600 194) scale(.9)">'
      +     '<path d="M0 -7 L2 -2 L7 -2 L3 1.5 L4.5 7 L0 3.5 L-4.5 7 L-3 1.5 L-7 -2 L-2 -2 Z" fill="#E8845A"/>'
      +   '</g>'
      +   '<g transform="translate(70 0)">'
      +     '<path d="M28 196 C30 170 34 140 44 112 C50 96 58 82 70 72 L76 78 C65 88 58 101 53 116 C44 142 41 170 40 196 Z" fill="#4A2E1E"/>'
      +     '<g stroke="#2E1B10" stroke-width="1.6" opacity=".65" fill="none">'
      +       '<path d="M29 186 Q35 184 40 186"/><path d="M31 172 Q37 170 41 172"/>'
      +       '<path d="M33 156 Q39 154 44 157"/><path d="M37 140 Q43 138 47 141"/>'
      +       '<path d="M42 124 Q48 122 52 126"/><path d="M49 108 Q55 106 59 110"/>'
      +       '<path d="M57 94 Q63 92 67 96"/>'
      +     '</g>'
      +     '<g fill="#1E4D2B">'
      +       '<path d="M72 74 C50 70 28 76 14 92 C20 84 32 79 44 79 C36 84 28 92 24 100 C34 89 48 81 62 79 C56 84 51 91 49 98 C55 89 64 82 72 79 Z"/>'
      +       '<path d="M72 72 C56 56 34 50 16 56 C30 52 44 55 55 62 C46 60 35 62 27 67 C40 64 54 66 65 72 C58 67 52 61 49 54 C57 60 66 66 73 70 Z"/>'
      +       '<path d="M74 70 C70 52 74 34 86 22 C79 32 77 44 79 55 C81 46 86 37 93 31 C86 40 83 52 84 63 C86 55 90 48 96 43 C90 51 85 61 83 70 Z"/>'
      +       '<path d="M76 72 C94 58 116 54 134 62 C120 57 106 59 96 65 C105 64 116 66 124 72 C111 68 97 69 86 74 C93 70 99 64 102 58 C94 63 84 68 77 71 Z"/>'
      +       '<path d="M76 76 C98 74 120 82 132 98 C124 88 112 82 100 81 C108 87 115 95 119 104 C109 92 95 84 82 81 C88 87 92 94 94 101 C88 92 80 84 74 80 Z"/>'
      +       '<path d="M78 78 C92 84 102 96 106 112 C101 100 92 91 82 87 C88 94 92 103 93 113 C88 101 80 91 72 85 Z"/>'
      +     '</g>'
      +     '<circle cx="70" cy="79" r="4.5" fill="#5C3A24"/>'
      +     '<circle cx="79" cy="82" r="4" fill="#4A2E1E"/>'
      +     '<circle cx="74" cy="86" r="3.6" fill="#6B4530"/>'
      +   '</g>'
      +   '<g stroke="#3D2B5C" stroke-width="1.8" fill="none" stroke-linecap="round">'
      +     '<path d="M490 52 Q495 47 500 52 Q505 47 510 52"/>'
      +     '<path d="M530 68 Q534 64 538 68 Q542 64 546 68"/>'
      +   '</g>'
      + '</svg>'
      + '</div>'
      + '<div style="flex:1;background:linear-gradient(180deg,#E8C382 0%,#F4E2B8 26%,#FBF3DE 100%);'
      +   'padding:14px 22px 12px;display:flex;flex-direction:column;justify-content:center;text-align:center;margin-top:-1px;">'
      +   '<div style="font-size:23px;font-weight:800;color:#E0457B;letter-spacing:1.5px;'
      +     'text-shadow:2px 2px 0 rgba(255,211,110,.9);margin-bottom:6px;">BUONE VACANZE!</div>'
      +   '<div style="font-size:12px;color:#5A4A3A;line-height:1.5;max-width:540px;margin:0 auto;">'
      +     'La programmazione dei webinar Genya e degli Academy Talks va in pausa estiva. '
      +     'Ci rivediamo a <strong style="color:#007AC3;">settembre</strong> con nuovi appuntamenti formativi. '
      +     'Nel frattempo, tutti i <strong style="color:#85BC20;">contenuti on-demand</strong> restano disponibili in Academy.'
      +   '</div>'
      +   '<div style="font-size:11px;color:#8A7A66;margin-top:7px;font-style:italic;">'
      +     'Buona estate dal team Wolters Kluwer Academy \u2600\uFE0F'
      +   '</div>'
      + '</div>';
  }

  /* ── Header comune ── */
  function buildHeader(sottotitolo) {
    return ''
      + '<div class="cal-header">'
      +   '<div class="cal-title">' + ICONS.calendar(18) + 'Calendario webinar Genya</div>'
      +   '<div class="cal-accent"></div>'
      +   '<div class="cal-sub">' + sottotitolo + '</div>'
      + '</div>';
  }

  /* ── Costruisce l'HTML interno della vista VACANZE ── */
  function viewVacanze() {
    return buildHeader('Pausa estiva') + buildVacanze();
  }

  /* ── Costruisce l'HTML interno della vista CALENDARIO ──
     Mostra sempre i prossimi eventi futuri, anche durante le
     vacanze (nella fase "calendario" dell'animazione: settembre). ── */
  function viewCalendario(now) {
    var mostraQa = (typeof MOSTRA_QA !== 'undefined') && MOSTRA_QA === true;

    var webinars = prepareList(typeof WEBINAR !== 'undefined' ? WEBINAR : [], 'webinar');
    var qas      = mostraQa ? prepareList(typeof QA !== 'undefined' ? QA : [], 'qa') : [];
    var talks    = prepareList(typeof TALKS !== 'undefined' ? TALKS : [], 'talk');

    var activeTalk = talks
      .filter(function(e) { return e.end > now; })
      .sort(function(a,b) { return a.start - b.start; })[0] || null;

    var maxRolling = activeTalk ? 5 : 6;

    var rolling = webinars.concat(qas)
      .filter(function(e) { return e.end > now; })
      .sort(function(a,b) { return a.start - b.start; })
      .slice(0, maxRolling);

    var rows = '';
    rolling.forEach(function(e) {
      rows += buildRow(e, now, mostraQa);
    });

    if (!rows && !activeTalk) {
      rows = '<div class="empty">Nessun webinar in programma</div>';
    }

    var talkSection = activeTalk
      ? '<div class="talk-section">' + buildTalk(activeTalk, now) + '</div>'
      : '';

    return ''
      + buildHeader('Prossimi eventi in programma')
      + '<div class="cal-body">' + rows + '</div>'
      + talkSection;
  }

  /* ── Stato animazione (solo durante le vacanze) ── */
  var VAC_IMG_MS  = 20000;   /* durata fase immagine   : 20s */
  var VAC_CAL_MS  = 60000;   /* durata fase calendario : 60s */
  var VAC_SLIDE_MS = 600;    /* durata transizione slide */

  var vacTimer = null;       /* timer del ciclo animazione */
  var vacPhase = null;       /* 'img' | 'cal' — fase corrente */

  function stopVacCycle() {
    if (vacTimer) { clearTimeout(vacTimer); vacTimer = null; }
    vacPhase = null;
  }

  /* Inietta una vista dentro il wrapper con slide orizzontale.
     direction: 'in-from-right' (entra da dx) o 'in-from-left'. */
  function slideTo(innerHTML, fromRight) {
    var cal = document.getElementById('cal');
    var wrap = cal.querySelector('.cal-wrap');
    if (!wrap) {
      cal.innerHTML = '<div class="cal-wrap">' + innerHTML + '</div>';
      return;
    }
    /* nuovo strato che entra */
    var incoming = document.createElement('div');
    incoming.className = 'cal-slide';
    incoming.style.transform = 'translateX(' + (fromRight ? '100%' : '-100%') + ')';
    incoming.innerHTML = innerHTML;

    /* strato uscente = contenuto attuale */
    var outgoing = document.createElement('div');
    outgoing.className = 'cal-slide';
    outgoing.style.transform = 'translateX(0)';
    while (wrap.firstChild) { outgoing.appendChild(wrap.firstChild); }

    wrap.style.position = 'relative';
    wrap.appendChild(outgoing);
    wrap.appendChild(incoming);

    /* forza reflow poi anima */
    void incoming.offsetWidth;
    incoming.style.transition = 'transform ' + VAC_SLIDE_MS + 'ms ease';
    outgoing.style.transition = 'transform ' + VAC_SLIDE_MS + 'ms ease';
    incoming.style.transform = 'translateX(0)';
    outgoing.style.transform = 'translateX(' + (fromRight ? '-100%' : '100%') + ')';

    setTimeout(function(){
      /* al termine, incoming diventa l'unico contenuto */
      wrap.innerHTML = '';
      wrap.style.position = '';
      while (incoming.firstChild) { wrap.appendChild(incoming.firstChild); }
    }, VAC_SLIDE_MS + 30);
  }

  /* Avvia/continua il ciclo immagine↔calendario durante le vacanze */
  function vacCycle() {
    var now = nowRome();

    /* se nel frattempo le vacanze sono finite, torna al render normale */
    if (!inVacanze(now)) {
      stopVacCycle();
      render();
      return;
    }

    if (vacPhase === 'img') {
      /* passa al calendario: entra da destra */
      slideTo(viewCalendario(now), true);
      vacPhase = 'cal';
      vacTimer = setTimeout(vacCycle, VAC_CAL_MS);
    } else {
      /* passa all'immagine: entra da sinistra */
      slideTo(viewVacanze(), false);
      vacPhase = 'img';
      vacTimer = setTimeout(vacCycle, VAC_IMG_MS);
    }
  }

  /* ── Render principale ── */
  function render() {
    var now = nowRome();

    /* ══ MODALITÀ VACANZE ══ */
    if (inVacanze(now)) {
      /* Se il ciclo è già attivo, non ridisegnare: lascia animare.
         Aggiorna solo i badge se siamo in fase calendario. */
      if (vacPhase) {
        if (vacPhase === 'cal') {
          var wrap = document.getElementById('cal').querySelector('.cal-wrap');
          if (wrap && !wrap.querySelector('.cal-slide')) {
            wrap.innerHTML = viewCalendario(now);
          }
        }
        return;
      }
      /* Primo ingresso: mostra l'immagine e avvia il ciclo */
      document.getElementById('cal').innerHTML =
        '<div class="cal-wrap">' + viewVacanze() + '</div>';
      vacPhase = 'img';
      vacTimer = setTimeout(vacCycle, VAC_IMG_MS);
      return;
    }

    /* ══ MODALITÀ NORMALE ══ */
    stopVacCycle();
    document.getElementById('cal').innerHTML =
      '<div class="cal-wrap">' + viewCalendario(now) + '</div>';
  }

  render();

  /* Aggiorna badge/lista ogni 30 secondi con i dati in memoria */
  setInterval(render, 30000);

  /* Ricarica completa ogni 60 minuti: pagine lasciate aperte a lungo
     scaricano così anche gli aggiornamenti di events.js */
  setTimeout(function(){ location.reload(); }, 60 * 60 * 1000);

})();
