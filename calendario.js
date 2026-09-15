/* ══════════════════════════════════════════════════════════════════
   MOTORE CALENDARIO — NON MODIFICARE QUESTO FILE
   Modificare solo events.js
   v3.0 — canale Genya/Arca, tre finestre vacanze (estate/natale/pasqua)
   ══════════════════════════════════════════════════════════════════ */

(function(){

  var MESI = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  var GIORNI = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];

  /* ── Canale corrente: "genya" (default) o "arca" ──
     Impostato da una variabile CANALE nell'HTML che carica il motore. */
  var canale = (typeof CANALE !== 'undefined' && CANALE === 'arca') ? 'arca' : 'genya';
  var TITOLO = (canale === 'arca') ? 'Calendario webinar Arca' : 'Calendario webinar Genya';

  /* ── Sorgenti dati per canale ──
     Genya legge WEBINAR / QA / TALKS.
     Arca legge WEBINAR_ARCA / QA_ARCA / TALKS_ARCA. */
  function srcWebinar() {
    if (canale === 'arca') return (typeof WEBINAR_ARCA !== 'undefined') ? WEBINAR_ARCA : [];
    return (typeof WEBINAR !== 'undefined') ? WEBINAR : [];
  }
  function srcQa() {
    if (canale === 'arca') return (typeof QA_ARCA !== 'undefined') ? QA_ARCA : [];
    return (typeof QA !== 'undefined') ? QA : [];
  }
  function srcTalks() {
    if (canale === 'arca') return (typeof TALKS_ARCA !== 'undefined') ? TALKS_ARCA : [];
    return (typeof TALKS !== 'undefined') ? TALKS : [];
  }

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

  /* ══════════════════════════════════════════════════════════════
     MODALITÀ VACANZE
     Finestre condivise definite in events.js come array VACANZE:
       [{ tipo:"estate", inizio:"01/08/2026", fine:"31/08/2026" }, ...]
     Ogni "tipo" ha un banner dedicato (estate/natale/pasqua).
     ══════════════════════════════════════════════════════════════ */

  /* Ritorna la finestra vacanze attiva ora, oppure null.
     Retro-compatibile: se VACANZE è ancora un oggetto singolo
     { inizio, fine } lo tratta come finestra "estate". */
  function finestraVacanzeAttiva(now) {
    if (typeof VACANZE === 'undefined' || !VACANZE) return null;

    var lista = VACANZE;
    if (!Array.isArray(VACANZE)) {
      /* vecchio formato oggetto singolo → estate */
      lista = [{ tipo:'estate', inizio:VACANZE.inizio, fine:VACANZE.fine }];
    }

    for (var k = 0; k < lista.length; k++) {
      var v = lista[k];
      if (!v || !v.inizio || !v.fine) continue;
      var i = parseDate(v.inizio, '00:00');
      var f = parseDate(v.fine, '23:59');
      if (!i || !f) continue;
      if (now >= i && now <= f) {
        return { tipo: (v.tipo || 'estate') };
      }
    }
    return null;
  }

  /* ── Banner ESTATE (spiaggia, palma, tramonto) ── */
  function bannerEstate() {
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
      +     'La programmazione dei webinar e degli Academy Talks va in pausa estiva. '
      +     'Ci rivediamo a <strong style="color:#007AC3;">settembre</strong> con nuovi appuntamenti formativi. '
      +     'Nel frattempo, tutti i <strong style="color:#85BC20;">contenuti on-demand</strong> restano disponibili in Academy.'
      +   '</div>'
      +   '<div style="font-size:11px;color:#8A7A66;margin-top:7px;font-style:italic;">'
      +     'Buona estate dal team Wolters Kluwer Academy \u2600\uFE0F'
      +   '</div>'
      + '</div>';
  }

  /* ── Banner NATALE (notte, neve, abete) ── */
  function bannerNatale() {
    return ''
      + '<div style="position:relative;flex-shrink:0;">'
      + '<svg viewBox="0 0 736 215" preserveAspectRatio="xMidYMax slice" style="display:block;width:100%;height:215px;" aria-hidden="true">'
      +   '<defs>'
      +     '<linearGradient id="n2sky" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#0A1834"/><stop offset="35%" stop-color="#16305C"/>'
      +       '<stop offset="65%" stop-color="#2E5385"/><stop offset="100%" stop-color="#5B84B0"/>'
      +     '</linearGradient>'
      +     '<radialGradient id="n2glow" cx="50%" cy="40%" r="60%">'
      +       '<stop offset="0%" stop-color="#7FA8D8" stop-opacity=".5"/><stop offset="100%" stop-color="#7FA8D8" stop-opacity="0"/>'
      +     '</radialGradient>'
      +     '<radialGradient id="n2moon" cx="42%" cy="38%" r="60%">'
      +       '<stop offset="0%" stop-color="#FFFEF6"/><stop offset="80%" stop-color="#E4EDF7"/><stop offset="100%" stop-color="#C9D8EC"/>'
      +     '</radialGradient>'
      +     '<linearGradient id="n2snow" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#F4F9FE"/><stop offset="100%" stop-color="#D3E4F4"/>'
      +     '</linearGradient>'
      +     '<linearGradient id="n2snow2" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#E8F1FA"/>'
      +     '</linearGradient>'
      +     '<linearGradient id="n2tree" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#2A6E47"/><stop offset="100%" stop-color="#14472B"/>'
      +     '</linearGradient>'
      +   '</defs>'
      +   '<rect x="0" y="0" width="736" height="160" fill="url(#n2sky)"/>'
      +   '<ellipse cx="368" cy="70" rx="360" ry="90" fill="url(#n2glow)"/>'
      +   '<circle cx="602" cy="52" r="40" fill="#8FB0D6" opacity=".25"/>'
      +   '<circle cx="602" cy="52" r="30" fill="url(#n2moon)"/>'
      +   '<circle cx="594" cy="46" r="4.5" fill="#D4E0EF" opacity=".6"/>'
      +   '<circle cx="609" cy="58" r="3" fill="#D4E0EF" opacity=".5"/>'
      +   '<circle cx="600" cy="62" r="2.5" fill="#D4E0EF" opacity=".4"/>'
      +   '<g fill="#FFFFFF">'
      +     '<circle cx="70" cy="34" r="1.6"/><circle cx="150" cy="24" r="1"/><circle cx="215" cy="44" r="1.3"/>'
      +     '<circle cx="300" cy="28" r="1.1"/><circle cx="110" cy="66" r="1.4"/><circle cx="360" cy="52" r="1"/>'
      +     '<circle cx="430" cy="34" r="1.5"/><circle cx="255" cy="66" r="1"/><circle cx="480" cy="60" r="1.2"/>'
      +     '<circle cx="180" cy="90" r="1"/><circle cx="40" cy="96" r="1.3"/><circle cx="330" cy="80" r="1"/>'
      +     '<circle cx="668" cy="98" r="1.2"/><circle cx="700" cy="60" r="1"/><circle cx="520" cy="28" r="1.1"/>'
      +   '</g>'
      +   '<g fill="#FFFFFF" opacity=".9">'
      +     '<path d="M90 50 L91.2 53 L94 54.2 L91.2 55.4 L90 58.4 L88.8 55.4 L86 54.2 L88.8 53 Z"/>'
      +     '<path d="M410 68 L411 70.5 L413.5 71.5 L411 72.5 L410 75 L409 72.5 L406.5 71.5 L409 70.5 Z"/>'
      +     '<path d="M270 40 L271 42.2 L273.2 43 L271 43.8 L270 46 L269 43.8 L266.8 43 L269 42.2 Z"/>'
      +   '</g>'
      +   '<g fill="#FFFFFF">'
      +     '<circle cx="120" cy="120" r="2.4" opacity=".95"/><circle cx="300" cy="112" r="2.6" opacity=".95"/>'
      +     '<circle cx="470" cy="124" r="2.3" opacity=".9"/><circle cx="640" cy="118" r="2.5" opacity=".9"/>'
      +   '</g>'
      +   '<g fill="#DCEAF8">'
      +     '<circle cx="200" cy="132" r="1.7" opacity=".8"/><circle cx="390" cy="140" r="1.8" opacity=".8"/>'
      +     '<circle cx="560" cy="134" r="1.6" opacity=".75"/><circle cx="80" cy="140" r="1.7" opacity=".8"/>'
      +     '<circle cx="690" cy="142" r="1.6" opacity=".7"/>'
      +   '</g>'
      +   '<g fill="#C4D8EE">'
      +     '<circle cx="250" cy="150" r="1.2" opacity=".6"/><circle cx="440" cy="152" r="1.3" opacity=".6"/>'
      +     '<circle cx="600" cy="148" r="1.2" opacity=".55"/><circle cx="150" cy="154" r="1.2" opacity=".6"/>'
      +   '</g>'
      +   '<path d="M0 215 L0 168 Q150 150 340 164 Q520 176 736 152 L736 215 Z" fill="url(#n2snow)"/>'
      +   '<path d="M0 215 L0 184 Q180 168 380 180 Q560 190 736 172 L736 215 Z" fill="url(#n2snow2)"/>'
      +   '<g fill="#1C3A55" opacity=".55">'
      +     '<path d="M70 168 L86 200 L54 200 Z"/><path d="M70 180 L90 206 L50 206 Z"/>'
      +     '<path d="M690 172 L704 200 L676 200 Z"/><path d="M690 182 L708 206 L672 206 Z"/>'
      +   '</g>'
      +   '<g transform="translate(368 92)">'
      +     '<rect x="-7" y="88" width="14" height="20" rx="1" fill="#6B4A2E"/>'
      +     '<path d="M0 -4 L22 30 L13 30 L30 58 L18 58 L38 88 L-38 88 L-18 58 L-30 58 L-13 30 L-22 30 Z" fill="url(#n2tree)"/>'
      +     '<path d="M0 -4 L22 30 L13 30 Z" fill="#FFFFFF" opacity=".18"/>'
      +     '<path d="M-30 58 L-13 30 L-22 30 Z" fill="#FFFFFF" opacity=".14"/>'
      +     '<path d="M18 58 L30 58 L38 88 Z" fill="#FFFFFF" opacity=".12"/>'
      +     '<circle cx="-10" cy="44" r="2.6" fill="#FFD98A"/><circle cx="12" cy="38" r="2.6" fill="#FFE7A8"/>'
      +     '<circle cx="-18" cy="70" r="2.6" fill="#FFD98A"/><circle cx="20" cy="66" r="2.6" fill="#FFE7A8"/>'
      +     '<circle cx="2" cy="58" r="2.6" fill="#FFEDBE"/><circle cx="-4" cy="80" r="2.6" fill="#FFD98A"/>'
      +     '<circle cx="10" cy="82" r="2.6" fill="#FFE7A8"/>'
      +     '<g opacity=".5">'
      +       '<circle cx="-10" cy="44" r="5" fill="#FFD98A" opacity=".3"/>'
      +       '<circle cx="12" cy="38" r="5" fill="#FFE7A8" opacity=".3"/>'
      +       '<circle cx="2" cy="58" r="5" fill="#FFEDBE" opacity=".3"/>'
      +     '</g>'
      +     '<circle cx="0" cy="-10" r="9" fill="#FFE07A" opacity=".35"/>'
      +     '<path d="M0 -20 L2.6 -12.5 L10 -12 L4 -7 L6 0.5 L0 -4 L-6 0.5 L-4 -7 L-10 -12 L-2.6 -12.5 Z" fill="#FFEBA0"/>'
      +   '</g>'
      +   '<g transform="translate(120 130) scale(.6)">'
      +     '<rect x="-5" y="76" width="10" height="14" fill="#5C3A24"/>'
      +     '<path d="M0 0 L24 40 L-24 40 Z" fill="#237A3E"/><path d="M0 30 L30 78 L-30 78 Z" fill="#1E5233"/>'
      +   '</g>'
      +   '<g transform="translate(620 138) scale(.5)">'
      +     '<rect x="-5" y="76" width="10" height="14" fill="#5C3A24"/>'
      +     '<path d="M0 0 L24 40 L-24 40 Z" fill="#237A3E"/><path d="M0 30 L30 78 L-30 78 Z" fill="#1E5233"/>'
      +   '</g>'
      + '</svg>'
      + '</div>'
      + '<div style="flex:1;background:linear-gradient(180deg,#EAF3FC 0%,#F3F9FE 45%,#FCFEFF 100%);'
      +   'padding:12px 22px 12px;display:flex;flex-direction:column;justify-content:center;text-align:center;margin-top:-1px;">'
      +   '<div style="font-size:23px;font-weight:800;color:#C41E2E;letter-spacing:1px;'
      +     'text-shadow:1px 1px 0 rgba(255,255,255,.6);margin-bottom:5px;">BUONE FESTE!</div>'
      +   '<div style="font-size:12px;color:#3A4A5A;line-height:1.5;max-width:540px;margin:0 auto;">'
      +     'La programmazione dei webinar e degli Academy Talks \u00e8 in pausa per le festivit\u00e0. '
      +     'Ci rivediamo a <strong style="color:#007AC3;">gennaio</strong> con nuovi appuntamenti formativi. '
      +     'Nel frattempo, tutti i <strong style="color:#85BC20;">contenuti on-demand</strong> restano disponibili in Academy.'
      +   '</div>'
      +   '<div style="font-size:11px;color:#7A8A9A;margin-top:6px;font-style:italic;">'
      +     'Buone feste dal team Wolters Kluwer Academy'
      +   '</div>'
      + '</div>';
  }

  /* ── Banner PASQUA (primavera, sole, prato) ── */
  function bannerPasqua() {
    return ''
      + '<div style="position:relative;flex-shrink:0;">'
      + '<svg viewBox="0 0 736 215" preserveAspectRatio="xMidYMax slice" style="display:block;width:100%;height:215px;" aria-hidden="true">'
      +   '<defs>'
      +     '<linearGradient id="p2sky" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#B7E0F2"/><stop offset="40%" stop-color="#DCF0F7"/>'
      +       '<stop offset="72%" stop-color="#FDEFD6"/><stop offset="100%" stop-color="#FCE3C4"/>'
      +     '</linearGradient>'
      +     '<radialGradient id="p2sun" cx="50%" cy="45%" r="55%">'
      +       '<stop offset="0%" stop-color="#FFFBEA"/><stop offset="55%" stop-color="#FFE9A0"/><stop offset="100%" stop-color="#FFD873"/>'
      +     '</radialGradient>'
      +     '<radialGradient id="p2halo" cx="50%" cy="50%" r="50%">'
      +       '<stop offset="0%" stop-color="#FFF0C0" stop-opacity=".7"/><stop offset="100%" stop-color="#FFF0C0" stop-opacity="0"/>'
      +     '</radialGradient>'
      +     '<linearGradient id="p2hill1" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#BEE07E"/><stop offset="100%" stop-color="#95C755"/>'
      +     '</linearGradient>'
      +     '<linearGradient id="p2hill2" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#9FD06A"/><stop offset="100%" stop-color="#72AF3E"/>'
      +     '</linearGradient>'
      +   '</defs>'
      +   '<rect x="0" y="0" width="736" height="160" fill="url(#p2sky)"/>'
      +   '<circle cx="368" cy="66" r="70" fill="url(#p2halo)"/>'
      +   '<circle cx="368" cy="66" r="34" fill="url(#p2sun)"/>'
      +   '<g stroke="#6B7A8A" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".65">'
      +     '<path d="M120 44 Q126 38 132 44 Q138 38 144 44"/>'
      +     '<path d="M170 60 Q175 55 180 60 Q185 55 190 60"/>'
      +   '</g>'
      +   '<g fill="#FFFFFF">'
      +     '<ellipse cx="560" cy="42" rx="46" ry="15" opacity=".9"/>'
      +     '<ellipse cx="592" cy="50" rx="32" ry="12" opacity=".9"/>'
      +     '<ellipse cx="528" cy="50" rx="26" ry="10" opacity=".85"/>'
      +     '<ellipse cx="90" cy="96" rx="38" ry="12" opacity=".8"/>'
      +     '<ellipse cx="118" cy="102" rx="26" ry="9" opacity=".8"/>'
      +   '</g>'
      +   '<path d="M0 215 L0 150 Q220 120 470 142 Q600 152 736 128 L736 215 Z" fill="url(#p2hill1)"/>'
      +   '<path d="M0 215 L0 176 Q200 150 420 170 Q580 184 736 160 L736 215 Z" fill="url(#p2hill2)"/>'
      +   '<g transform="translate(636 150)">'
      +     '<path d="M0 40 L0 8" stroke="#7A5A3A" stroke-width="4" stroke-linecap="round"/>'
      +     '<path d="M0 20 Q-10 12 -16 16 M0 26 Q10 20 15 24" stroke="#7A5A3A" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      +     '<circle cx="0" cy="4" r="14" fill="#F6C8DE"/><circle cx="-12" cy="12" r="10" fill="#F4BAD6"/>'
      +     '<circle cx="12" cy="12" r="10" fill="#F9D2E6"/><circle cx="0" cy="16" r="9" fill="#F6C8DE"/>'
      +     '<circle cx="-4" cy="2" r="2" fill="#fff" opacity=".8"/><circle cx="8" cy="10" r="1.6" fill="#fff" opacity=".7"/>'
      +   '</g>'
      +   '<g transform="translate(150 176)">'
      +     '<line x1="0" y1="0" x2="0" y2="16" stroke="#5E9A34" stroke-width="2"/>'
      +     '<g transform="translate(0 -4)">'
      +       '<circle cx="0" cy="-4" r="4" fill="#F2A0C8"/><circle cx="-4" cy="0" r="4" fill="#F2A0C8"/>'
      +       '<circle cx="4" cy="0" r="4" fill="#F2A0C8"/><circle cx="0" cy="4" r="4" fill="#F2A0C8"/>'
      +       '<circle cx="0" cy="0" r="2.6" fill="#FFD05C"/>'
      +     '</g>'
      +   '</g>'
      +   '<g transform="translate(240 190)">'
      +     '<line x1="0" y1="0" x2="0" y2="14" stroke="#5E9A34" stroke-width="2"/>'
      +     '<g transform="translate(0 -3)">'
      +       '<circle cx="0" cy="-3.5" r="3.5" fill="#B8A8E8"/><circle cx="-3.5" cy="0" r="3.5" fill="#B8A8E8"/>'
      +       '<circle cx="3.5" cy="0" r="3.5" fill="#B8A8E8"/><circle cx="0" cy="3.5" r="3.5" fill="#B8A8E8"/>'
      +       '<circle cx="0" cy="0" r="2.2" fill="#FFD05C"/>'
      +     '</g>'
      +   '</g>'
      +   '<g transform="translate(470 196)">'
      +     '<line x1="0" y1="0" x2="0" y2="14" stroke="#5E9A34" stroke-width="2"/>'
      +     '<g transform="translate(0 -3)">'
      +       '<circle cx="0" cy="-3.5" r="3.5" fill="#FFFFFF"/><circle cx="-3.5" cy="0" r="3.5" fill="#FFFFFF"/>'
      +       '<circle cx="3.5" cy="0" r="3.5" fill="#FFFFFF"/><circle cx="0" cy="3.5" r="3.5" fill="#FFFFFF"/>'
      +       '<circle cx="0" cy="0" r="2.2" fill="#FFD05C"/>'
      +     '</g>'
      +   '</g>'
      +   '<g transform="translate(90 188)">'
      +     '<ellipse cx="0" cy="0" rx="13" ry="17" fill="#5FB4E0"/>'
      +     '<path d="M-13 -3 Q0 -8 13 -3" stroke="#FFFFFF" stroke-width="2.4" fill="none"/>'
      +     '<path d="M-13 5 Q0 0 13 5" stroke="#FFD87A" stroke-width="2.4" fill="none"/>'
      +     '<circle cx="-5" cy="-9" r="2.2" fill="#F2A0C8"/><circle cx="5" cy="-7" r="2.2" fill="#95C755"/>'
      +     '<ellipse cx="-5" cy="-10" rx="3" ry="5" fill="#fff" opacity=".25"/>'
      +   '</g>'
      +   '<g transform="translate(410 200) rotate(-10)">'
      +     '<ellipse cx="0" cy="0" rx="11" ry="15" fill="#F2A0C8"/>'
      +     '<path d="M-11 -2 Q0 -7 11 -2" stroke="#FFFFFF" stroke-width="2.2" fill="none"/>'
      +     '<path d="M-11 5 Q0 0 11 5" stroke="#95C755" stroke-width="2.2" fill="none"/>'
      +     '<circle cx="0" cy="-8" r="2" fill="#FFD87A"/>'
      +     '<ellipse cx="-4" cy="-8" rx="2.5" ry="4.5" fill="#fff" opacity=".25"/>'
      +   '</g>'
      +   '<g transform="translate(560 204) rotate(8)">'
      +     '<ellipse cx="0" cy="0" rx="10" ry="14" fill="#FFD87A"/>'
      +     '<path d="M-10 -2 Q0 -6 10 -2" stroke="#E2231A" stroke-width="2" fill="none" opacity=".8"/>'
      +     '<path d="M-10 5 Q0 1 10 5" stroke="#5FB4E0" stroke-width="2" fill="none"/>'
      +     '<ellipse cx="-3" cy="-7" rx="2.2" ry="4" fill="#fff" opacity=".3"/>'
      +   '</g>'
      + '</svg>'
      + '</div>'
      + '<div style="flex:1;background:linear-gradient(180deg,#FCE9CE 0%,#FAF3E4 45%,#FBFDF6 100%);'
      +   'padding:12px 22px 12px;display:flex;flex-direction:column;justify-content:center;text-align:center;margin-top:-1px;">'
      +   '<div style="font-size:23px;font-weight:800;color:#5FA338;letter-spacing:1px;'
      +     'text-shadow:1px 1px 0 rgba(255,255,255,.7);margin-bottom:5px;">BUONA PASQUA!</div>'
      +   '<div style="font-size:12px;color:#5A5A45;line-height:1.5;max-width:540px;margin:0 auto;">'
      +     'La programmazione dei webinar e degli Academy Talks \u00e8 in pausa per le festivit\u00e0 pasquali. '
      +     'Riprendiamo <strong style="color:#007AC3;">a breve</strong> con nuovi appuntamenti formativi. '
      +     'Nel frattempo, tutti i <strong style="color:#85BC20;">contenuti on-demand</strong> restano disponibili in Academy.'
      +   '</div>'
      +   '<div style="font-size:11px;color:#8A8A6A;margin-top:6px;font-style:italic;">'
      +     'Buona Pasqua dal team Wolters Kluwer Academy'
      +   '</div>'
      + '</div>';
  }

  /* Sceglie il banner in base al tipo di finestra */
  function bannerPerTipo(tipo) {
    if (tipo === 'natale') return bannerNatale();
    if (tipo === 'pasqua') return bannerPasqua();
    return bannerEstate();
  }

  /* Sottotitolo header per tipo vacanza */
  function sottotitoloVacanza(tipo) {
    if (tipo === 'natale') return 'Pausa festivit\u00e0';
    if (tipo === 'pasqua') return 'Pausa festivit\u00e0';
    return 'Pausa estiva';
  }

  /* ── Header comune ── */
  function buildHeader(sottotitolo) {
    return ''
      + '<div class="cal-header">'
      +   '<div class="cal-title">' + ICONS.calendar(18) + esc(TITOLO) + '</div>'
      +   '<div class="cal-accent"></div>'
      +   '<div class="cal-sub">' + sottotitolo + '</div>'
      + '</div>';
  }

  /* ── Vista VACANZE (per il tipo di finestra attiva) ── */
  function viewVacanze(tipo) {
    return buildHeader(sottotitoloVacanza(tipo)) + bannerPerTipo(tipo);
  }

  /* ── Vista CALENDARIO ──
     Mostra sempre i prossimi eventi futuri, anche durante le vacanze
     (fase "calendario" dell'animazione). ── */
  function viewCalendario(now) {
    var mostraQa = (typeof MOSTRA_QA !== 'undefined') && MOSTRA_QA === true;

    var webinars = prepareList(srcWebinar(), 'webinar');
    var qas      = mostraQa ? prepareList(srcQa(), 'qa') : [];
    var talks    = prepareList(srcTalks(), 'talk');

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

  var vacTimer = null;
  var vacPhase = null;       /* 'img' | 'cal' */
  var vacTipo  = 'estate';   /* tipo finestra attiva */

  function stopVacCycle() {
    if (vacTimer) { clearTimeout(vacTimer); vacTimer = null; }
    vacPhase = null;
  }

  function slideTo(innerHTML, fromRight) {
    var cal = document.getElementById('cal');
    var wrap = cal.querySelector('.cal-wrap');
    if (!wrap) {
      cal.innerHTML = '<div class="cal-wrap">' + innerHTML + '</div>';
      return;
    }
    var incoming = document.createElement('div');
    incoming.className = 'cal-slide';
    incoming.style.transform = 'translateX(' + (fromRight ? '100%' : '-100%') + ')';
    incoming.innerHTML = innerHTML;

    var outgoing = document.createElement('div');
    outgoing.className = 'cal-slide';
    outgoing.style.transform = 'translateX(0)';
    while (wrap.firstChild) { outgoing.appendChild(wrap.firstChild); }

    wrap.style.position = 'relative';
    wrap.appendChild(outgoing);
    wrap.appendChild(incoming);

    void incoming.offsetWidth;
    incoming.style.transition = 'transform ' + VAC_SLIDE_MS + 'ms ease';
    outgoing.style.transition = 'transform ' + VAC_SLIDE_MS + 'ms ease';
    incoming.style.transform = 'translateX(0)';
    outgoing.style.transform = 'translateX(' + (fromRight ? '-100%' : '100%') + ')';

    setTimeout(function(){
      wrap.innerHTML = '';
      wrap.style.position = '';
      while (incoming.firstChild) { wrap.appendChild(incoming.firstChild); }
    }, VAC_SLIDE_MS + 30);
  }

  function vacCycle() {
    var now = nowRome();
    var fin = finestraVacanzeAttiva(now);

    if (!fin) {
      stopVacCycle();
      render();
      return;
    }
    vacTipo = fin.tipo;

    if (vacPhase === 'img') {
      slideTo(viewCalendario(now), true);
      vacPhase = 'cal';
      vacTimer = setTimeout(vacCycle, VAC_CAL_MS);
    } else {
      slideTo(viewVacanze(vacTipo), false);
      vacPhase = 'img';
      vacTimer = setTimeout(vacCycle, VAC_IMG_MS);
    }
  }

  /* ── Render principale ── */
  function render() {
    var now = nowRome();
    var fin = finestraVacanzeAttiva(now);

    /* ══ MODALITÀ VACANZE ══ */
    if (fin) {
      vacTipo = fin.tipo;
      if (vacPhase) {
        if (vacPhase === 'cal') {
          var wrap = document.getElementById('cal').querySelector('.cal-wrap');
          if (wrap && !wrap.querySelector('.cal-slide')) {
            wrap.innerHTML = viewCalendario(now);
          }
        }
        return;
      }
      document.getElementById('cal').innerHTML =
        '<div class="cal-wrap">' + viewVacanze(vacTipo) + '</div>';
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
  setInterval(render, 30000);
  setTimeout(function(){ location.reload(); }, 60 * 60 * 1000);

})();
