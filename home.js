/* ══════════════════════════════════════════════════════════════════
   MOTORE VISTE HOME — NON MODIFICARE QUESTO FILE
   Modificare solo events.js (lo stesso file del calendario)
   v1.0 — viste per la home Academy "Impara. Applica. Cresci."

   Si usa tramite home.html, con i parametri nell'indirizzo:
     vista   = webinar (default) | talk
     canale  = genya (default)   | arca
     qa      = 1 per mostrare anche le sessioni Q&A (solo vista webinar)

   Esempi:
     home.html?vista=webinar&canale=genya&qa=1   → prossimi webinar, Genya diretta
     home.html?vista=webinar&canale=genya        → prossimi webinar, Genya indiretta
     home.html?vista=webinar&canale=arca&qa=1    → prossimi webinar, Arca
     home.html?vista=talk&canale=genya           → scheda "Il prossimo Talk"
   ══════════════════════════════════════════════════════════════════ */

(function(){

  var MESI   = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
  var MESI_L = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var GG     = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
  var GG_L   = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  var GIORNO = 24 * 60 * 60 * 1000;
  var MAX_SCHEDE = 6;

  /* ── Parametri dall'indirizzo ── */
  var P = new URLSearchParams(location.search);
  var vista    = (P.get('vista') === 'talk') ? 'talk' : 'webinar';
  var canale   = (P.get('canale') === 'arca') ? 'arca' : 'genya';
  var mostraQa = (P.get('qa') === '1');

  var root = document.getElementById('home');
  var stato = { tipo:'tutti', giorno:null };

  /* ── Sorgenti dati per canale (stesse sezioni di events.js) ── */
  function src(nome) {
    var n = (canale === 'arca') ? nome + '_ARCA' : nome;
    try { return (typeof window[n] !== 'undefined' && Array.isArray(window[n])) ? window[n] : null; }
    catch (e) { return null; }
  }

  /* ── Sicurezza: escape per testo e attributi HTML ── */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function safeLink(url) {
    var u = String(url == null ? '' : url).trim();
    if (!/^https?:\/\//i.test(u)) return '#';
    return esc(u);
  }

  /* ── Date: tutto in "ora di Roma", indipendente dal fuso del computer ──
     Ogni istante è un numero ottenuto dall'ora di calendario italiana. */
  function wall(y, m, d, hh, mi) { return Date.UTC(y, m - 1, d, hh || 0, mi || 0, 0); }

  function parse(dataStr, oraStr) {
    var d = String(dataStr || '').split('/');
    var t = String(oraStr || '').split(':');
    if (d.length !== 3 || t.length !== 2) return null;
    var v = wall(+d[2], +d[1], +d[0], +t[0], +t[1]);
    return isNaN(v) ? null : v;
  }

  function adesso() {
    /* Parametro di prova: home.html?...&adesso=2026-11-12T09:00 */
    var prova = P.get('adesso');
    if (prova) {
      var m = prova.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
      if (m) return wall(+m[1], +m[2], +m[3], +m[4], +m[5]);
    }
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone:'Europe/Rome', year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit', hour12:false
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function(p){ o[p.type] = p.value; });
      return wall(+o.year, +o.month, +o.day, (+o.hour) % 24, +o.minute);
    } catch (e) {
      var n = new Date();
      return wall(n.getFullYear(), n.getMonth() + 1, n.getDate(), n.getHours(), n.getMinutes());
    }
  }

  function inizioGiorno(v) { var d = new Date(v); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); }
  function parti(v) {
    var d = new Date(v);
    return { g:d.getUTCDate(), m:d.getUTCMonth(), a:d.getUTCFullYear(), wd:d.getUTCDay() };
  }

  /* ── Lista eventi pronta all'uso ── */
  function prepara(arr, tipo) {
    if (!arr) return [];
    return arr.map(function(e) {
      if (!e) return null;
      var s = parse(e.data, e.ora_inizio);
      var f = parse(e.data, e.ora_fine);
      if (s === null || f === null || f <= s) {
        console.warn('[Home] Evento ignorato (data o orari non validi): ' + (e.titolo || '?') + ' ' + (e.data || ''));
        return null;
      }
      return { start:s, end:f, giorno:inizioGiorno(s), titolo:e.titolo, link:e.link, oi:e.ora_inizio, of:e.ora_fine, tipo:tipo };
    }).filter(function(e){ return e !== null; });
  }

  /* ── Pausa attiva (stesso array VACANZE del calendario) ── */
  function pausaAttiva(now) {
    if (typeof VACANZE === 'undefined' || !VACANZE) return null;
    var lista = Array.isArray(VACANZE) ? VACANZE : [{ tipo:'estate', inizio:VACANZE.inizio, fine:VACANZE.fine }];
    for (var k = 0; k < lista.length; k++) {
      var v = lista[k];
      if (!v || !v.inizio || !v.fine) continue;
      var i = parse(v.inizio, '00:00'), f = parse(v.fine, '23:59');
      if (i === null || f === null) continue;
      if (now >= i && now <= f) return { tipo:(v.tipo || 'estate'), fine:f };
    }
    return null;
  }

  /* ── Etichetta di stato: in diretta / tra poco / oggi / domani ── */
  function badge(now, e) {
    if (now >= e.start && now < e.end) return '<span class="badge badge-live">In diretta</span>';
    if (e.start > now && e.start - now <= 30 * 60 * 1000) return '<span class="badge badge-soon">Tra poco</span>';
    var oggi = inizioGiorno(now);
    if (e.giorno === oggi) return '<span class="badge badge-oggi">Oggi</span>';
    if (e.giorno === oggi + GIORNO) return '<span class="badge badge-oggi">Domani</span>';
    return '';
  }

  function errore() {
    return '<p class="msg">Il calendario non è disponibile in questo momento. Riprova tra poco.</p>';
  }

  /* ══════════════════════════════════════════════════════════════
     VISTA WEBINAR — filtri, prossimi 14 giorni, schede
     Mostra webinar, Q&A (se qa=1) e Academy Talks del canale
     ══════════════════════════════════════════════════════════════ */
  function viewWebinar(now) {
    var w = src('WEBINAR');
    if (w === null) return errore();

    var eventi = prepara(w, 'webinar')
      .concat(mostraQa ? prepara(src('QA'), 'qa') : [])
      .concat(prepara(src('TALKS'), 'talk'))
      .filter(function(e){ return e.end > now; })
      .sort(function(a, b){ return a.start - b.start; });

    var NOMI = { webinar:'Webinar', qa:'Q&A', talk:'Talk' };
    var tipi = ['webinar', 'qa', 'talk'].filter(function(t){ return eventi.some(function(e){ return e.tipo === t; }); });
    if (tipi.indexOf(stato.tipo) < 0) stato.tipo = 'tutti';

    var perTipo = eventi.filter(function(e){ return stato.tipo === 'tutti' || e.tipo === stato.tipo; });

    /* Filtri per tipo: solo se in programma c'è più di un tipo di evento */
    var top = '';
    if (tipi.length > 1) {
      var chips = ['tutti'].concat(tipi).map(function(t) {
        return '<button type="button" class="chip" data-tipo="' + t + '" aria-pressed="' + (stato.tipo === t) + '">' + esc(t === 'tutti' ? 'Tutti' : NOMI[t]) + '</button>';
      }).join('');
      var legenda = tipi.map(function(t){ return '<span><i class="dot dot-' + t + '"></i>' + esc(NOMI[t]) + '</span>'; }).join('');
      top = '<div class="hw-top">'
          +   '<div class="hw-chips" role="group" aria-label="Filtra per tipo di evento">' + chips + '</div>'
          +   '<div class="hw-legend" aria-hidden="true">' + legenda + '</div>'
          + '</div>';
    }

    /* Striscia dei prossimi 14 giorni */
    var oggi = inizioGiorno(now);
    var giorni = '';
    var giornoValido = false;
    for (var i = 0; i < 14; i++) {
      var g = oggi + i * GIORNO;
      var p = parti(g);
      var delGiorno = perTipo.filter(function(e){ return e.giorno === g; });
      var n = delGiorno.length;
      if (stato.giorno === g && n) giornoValido = true;
      var dots = delGiorno.slice(0, 3).map(function(e){ return '<i class="dot dot-' + e.tipo + '"></i>'; }).join('');
      var cls = 'day' + (i === 0 ? ' is-today' : '') + (n ? ' has-ev' : ' is-off');
      var label = GG_L[p.wd] + ' ' + p.g + ' ' + MESI_L[p.m] + (n ? ', ' + n + (n === 1 ? ' evento' : ' eventi') : ', nessun evento');
      giorni += '<button type="button" class="' + cls + '" data-giorno="' + g + '"'
             +  (n ? ' aria-pressed="' + (stato.giorno === g) + '"' : ' disabled')
             +  ' aria-label="' + esc(label) + '">'
             +  '<span class="day-wd">' + GG[p.wd] + '</span>'
             +  '<span class="day-n">' + p.g + '</span>'
             +  '<span class="day-dots">' + dots + '</span>'
             + '</button>';
    }
    if (!giornoValido) stato.giorno = null;
    var striscia = '<div class="hw-days" role="group" aria-label="Prossimi 14 giorni">' + giorni + '</div>';

    /* Avviso di pausa */
    var pausa = pausaAttiva(now);
    var nota = '';
    if (pausa) {
      var pf = parti(pausa.fine);
      nota = '<p class="hw-note">' + (pausa.tipo === 'estate' ? 'Pausa estiva' : 'Pausa per le festività')
           + ' fino al ' + pf.g + ' ' + MESI_L[pf.m] + ': i webinar riprendono subito dopo.</p>';
    }

    /* Schede */
    var lista = perTipo.filter(function(e){ return stato.giorno === null || e.giorno === stato.giorno; });
    var max = pausa ? 3 : MAX_SCHEDE;
    var schede = lista.slice(0, max).map(function(e) {
      var p = parti(e.start);
      var tag = (tipi.length > 1)
        ? '<span class="ev-tag"><i class="dot dot-' + e.tipo + '"></i>' + esc(NOMI[e.tipo]) + '</span>'
        : '';
      return '<a class="ev" href="' + safeLink(e.link) + '" target="_blank" rel="noopener">'
           +   '<span class="ev-head">'
           +     '<span class="ev-date"><span class="ev-dd">' + p.g + '</span><span class="ev-mm">' + MESI[p.m] + '</span>' + badge(now, e) + '</span>'
           +     tag
           +   '</span>'
           +   '<span class="ev-name">' + esc(e.titolo) + '</span>'
           +   '<span class="ev-foot">'
           +     '<span class="ev-time">' + GG[p.wd] + ' · ' + esc(e.oi) + ' – ' + esc(e.of) + '</span>'
           +     '<span class="ev-go">Iscriviti <span aria-hidden="true">→</span></span>'
           +   '</span>'
           + '</a>';
    }).join('');

    var corpo;
    if (!eventi.length && pausa) {
      corpo = '';
    } else if (!eventi.length) {
      corpo = '<p class="msg">Nessun webinar in programma nelle prossime settimane. Nel frattempo trovi i video sugli stessi temi tra i contenuti on demand.</p>';
    } else if (!lista.length) {
      corpo = '<p class="msg">Nessun evento per questo filtro.</p>';
    } else {
      corpo = '<div class="hw-grid">' + schede + '</div>';
      var altri = lista.length - Math.min(lista.length, max);
      if (altri > 0) corpo += '<p class="hw-more">+ ' + altri + (altri === 1 ? ' altro evento' : ' altri eventi') + ' nel calendario completo.</p>';
    }

    return '<div class="hw">' + top + striscia + nota + corpo + '</div>';
  }

  /* ══════════════════════════════════════════════════════════════
     VISTA TALK — scheda "Il prossimo Talk"
     ══════════════════════════════════════════════════════════════ */
  function viewTalk(now) {
    var t = src('TALKS');
    var testa = '<p class="ht-eyebrow"><b>Cresci</b> · Academy Talks</p>';
    if (t === null) {
      return '<div class="ht">' + testa + '<h2>Academy Talks</h2><p class="ht-text">Il calendario dei Talk non è disponibile in questo momento. Riprova tra poco.</p></div>';
    }
    var talk = prepara(t, 'talk')
      .filter(function(e){ return e.end > now; })
      .sort(function(a, b){ return a.start - b.start; })[0] || null;

    if (!talk) {
      return '<div class="ht">' + testa
           + '<h2>Academy Talks</h2>'
           + '<p class="ht-text">Ogni mese un incontro su attualità, innovazione e trend di mercato.</p>'
           + '<p class="ht-text">Il prossimo Talk è in preparazione: lo trovi qui appena entra in calendario.</p>'
           + '</div>';
    }
    var p = parti(talk.start);
    return '<div class="ht">' + testa
         + '<h2>Il prossimo Talk</h2>'
         + '<p class="ht-date">' + p.g + ' ' + MESI[p.m] + badge(now, talk) + '</p>'
         + '<p class="ht-when">' + GG_L[p.wd] + ' · ore ' + esc(talk.oi) + ' – ' + esc(talk.of) + ' · live</p>'
         + '<p class="ht-title">' + esc(talk.titolo) + '</p>'
         + '<p class="ht-actions"><a class="ht-btn" href="' + safeLink(talk.link) + '" target="_blank" rel="noopener">Iscriviti al Talk</a></p>'
         + '</div>';
  }

  /* ── Disegno e interazioni ── */
  function render() {
    var now = adesso();
    var attivo = document.activeElement;
    var chiave = attivo && attivo.getAttribute ? (attivo.getAttribute('data-tipo') ? 'tipo:' + attivo.getAttribute('data-tipo') : (attivo.getAttribute('data-giorno') ? 'giorno:' + attivo.getAttribute('data-giorno') : null)) : null;
    try {
      root.innerHTML = (vista === 'talk') ? viewTalk(now) : viewWebinar(now);
    } catch (e) {
      console.error('[Home] Errore di disegno', e);
      root.innerHTML = errore();
    }
    /* Dopo un clic su un filtro, il fuoco resta sullo stesso controllo */
    if (chiave) {
      var parts = chiave.split(':');
      var el = root.querySelector('[data-' + parts[0] + '="' + parts[1] + '"]');
      if (el && !el.disabled) el.focus();
    }
  }

  root.addEventListener('click', function(ev) {
    var b = ev.target.closest ? ev.target.closest('button') : null;
    if (!b || b.disabled) return;
    if (b.hasAttribute('data-tipo')) {
      stato.tipo = b.getAttribute('data-tipo');
      stato.giorno = null;
      render();
    } else if (b.hasAttribute('data-giorno')) {
      var g = +b.getAttribute('data-giorno');
      stato.giorno = (stato.giorno === g) ? null : g;
      render();
    }
  });

  document.title = (vista === 'talk') ? 'Il prossimo Academy Talk' : 'Prossimi webinar';
  render();
  setInterval(render, 60 * 1000);                               /* aggiorna "Tra poco" e "In diretta" */
  setTimeout(function(){ location.reload(); }, 60 * 60 * 1000); /* rilegge events.js ogni ora */

})();
