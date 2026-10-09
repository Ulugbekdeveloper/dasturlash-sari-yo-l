(function(){
  var root = document.documentElement;
  var LANG_KEY = 'frontendga-sari-lang';
  var DATA = { h: {}, x: {} };
  try { DATA = JSON.parse(document.getElementById('i18n-data').textContent); } catch(e) {}
  // ---- Tarjima birliklarini topish (ajratib olish va ish vaqtida bir xil ishlatiladi) ----
  var I18N_SKIP = 'script,style,pre,textarea,.preview-page,.typer,.kb,.drawer .toc,.tts-set select,noscript,[data-no-i18n]';
  var I18N_COMPLEX = 'img,svg,button,input,select,textarea,canvas,details,iframe,video,audio,label,[id]';
  var I18N_ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];
  var HAS_WORD = /[A-Za-zʻʼ‘’'][A-Za-zʻʼ‘’'-]*[A-Za-z]/;
  function i18nNorm(s){ return s.replace(/\s+/g, ' ').trim(); }
  function i18nInline(el){ var d = getComputedStyle(el).display; return d.indexOf('inline') === 0 || d === 'contents'; }
  // Har bir matn tuguni aynan bitta birlikka tegishli: eng yaqin "blok" ota-element.
  // 'h' — butun ichki HTML almashtiriladi; 't' — faqat matn tugunlari almashtiriladi.
  function i18nUnits(root){
    var out = [], map = new Map();
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function(n){
      if (!HAS_WORD.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      var p = n.parentElement;
      if (!p || p.closest(I18N_SKIP)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    } });
    var n;
    while ((n = tw.nextNode())) {
      var p = n.parentElement, el, mode;
      if (p.closest('svg')) { el = p.closest('text') || p; mode = 't'; }
      else {
        el = p;
        while (el.parentElement && el !== root && el !== document.body && i18nInline(el)) el = el.parentElement;
        mode = (el.querySelector(I18N_COMPLEX) || /data:/.test(el.innerHTML)) ? 't' : 'h';
      }
      var u = map.get(el);
      if (!u) { u = { el: el, mode: mode, nodes: [] }; map.set(el, u); out.push(u); }
      u.nodes.push(n);
    }
    // Ichki HTML'ni butunlay almashtirsa bo'ladigan eng tashqi birlik ichidagilarni ham qamrab oladi
    var drop = new Set();
    out.forEach(function(v){
      for (var a = v.el.parentElement; a; a = a.parentElement) { var w = map.get(a); if (w && w.mode === 'h') drop.add(v); }
    });
    return out.filter(function(v){ return !drop.has(v); });
  }

  I18N_SKIP += ',.type-target';

  // ---------- Lug'atlar ----------
  var H = DATA.h, X = DATA.x, PT = null;
  function plainMaps(){
    if (PT) return PT;
    PT = {};
    var box = document.createElement('div');
    function plain(html){ box.innerHTML = html; box.querySelectorAll('.step-num').forEach(function(s){ s.remove(); }); return i18nNorm(box.textContent); }
    Object.keys(H).forEach(function(k){
      if (k.length > 400) return;
      var a = plain(k), b = plain(H[k]);
      if (a && b && !(a in PT)) PT[a] = b;
    });
    return PT;
  }
  function exact(t){
    if (Object.prototype.hasOwnProperty.call(X, t)) return X[t];
    var p = plainMaps();
    if (Object.prototype.hasOwnProperty.call(p, t)) return p[t];
    return null;
  }
  var CPU_WORDS = { 'keyingi manzil': 'next address', 'joriy buyruq': 'current instruction', 'natija': 'result', 'manzil': 'address', "ma'lumot": 'data' };
  var RULES = [
    [/^(\d+) \/ (\d+) qadam bajarildi$/, '$1 / $2 steps done'],
    [/^(\d+) \/ (\d+) bajarildi — sichqonchani egalladingiz!$/, "$1 / $2 done — you've mastered the mouse!"],
    [/^(\d+) \/ (\d+) bajarildi$/, '$1 / $2 done'],
    [/^(\d+) \/ (\d+) to'g'ri — barakalla!$/, '$1 / $2 correct — well done!'],
    [/^(\d+) \/ (\d+) to'g'ri$/, '$1 / $2 correct'],
    [/^To'g'ri: (\d+) \/ (\d+) — barakalla!$/, 'Correct: $1 / $2 — well done!'],
    [/^To'g'ri: (\d+) \/ (\d+) — yana bir urinib ko'ring$/, 'Correct: $1 / $2 — give it another try'],
    [/^To'g'ri: (\d+) \/ (\d+)$/, 'Correct: $1 / $2'],
    [/^To'g'ri: (\d+)$/, 'Correct: $1'],
    [/^Natija: (\d+) \/ (\d+)$/, 'Result: $1 / $2'],
    [/^Natija: (\d+) ball$/, 'Result: $1 points'],
    [/^Ball: (\d+)$/, 'Score: $1'],
    [/^Vaqt: (\d+)$/, 'Time: $1'],
    [/^= (\d+) · (keyingi manzil|joriy buyruq|natija|manzil|ma'lumot)$/, function(m, n, w){ return '= ' + n + ' · ' + CPU_WORDS[w]; }],
    [/^(◀ PC\s+)?(ma'lumot|natija): (\d+)$/, function(m, p, w, n){ return (p || '') + (w === 'natija' ? 'result' : 'data') + ': ' + n; }],
    [/^(O'qilmoqda|Pauza)(.*)$/, function(m, s, rest){ return (s === 'Pauza' ? 'Paused' : 'Reading') + rest.replace(" · o'zbekcha", ' · Uzbek').replace(' · turkcha', ' · Turkish'); }],
    [/^Ko'chirish \(AND\) = (\d), yig'indi \(XOR\) = (\d)\. Ikkilikdagi (\d+) — o'nlikda (\d+)\.$/, 'Carry (AND) = $1, sum (XOR) = $2. Binary $3 equals $4 in decimal.'],
    [/^(.*) {2}· {2}128 dan katta: bu 7 bitli ASCII'ga sig'maydi$/, "$1  ·  over 127: doesn't fit in 7-bit ASCII"],
    [/^"(.+)" belgisining kodi (\d+) — u 1 baytga \(0–255\) sig'maydi\. Bunday belgilar uchun UTF-8 bir nechta bayt ishlatadi\.$/, "The code of \"$1\" is $2 — it doesn't fit in 1 byte (0–255). For characters like this, UTF-8 uses several bytes."],
    [/^(.+) — bu boshqa tugma\. Yana urinib ko'ring\.$/, "$1 — that's a different key. Try again."],
    [/^To'g'ri! (\S+) = (.+)$/, function(m, w, g){ return 'Correct! ' + w + ' = ' + (exact(g) || g); }],
    [/^Bu — (\S+) = (.+)$/, function(m, w, g){ return "It's " + w + ' = ' + (exact(g) || g); }],
    [/^Ovoz chiqarib o'qish: (.+)$/, function(m, t){ return 'Read aloud: ' + (exact(t) || t); }],
    [/^Nisbiy manzil: brauzer "(.*)" faylini sizning papkangizdan qidiradi$/, 'Relative address: the browser looks for the file "$1" in your folder'],
    [/^Bu nisbiy manzil: "(.*)"\.\nBrauzer uni internetdan emas, sahifa turgan papkadan qidiradi\.$/, 'This is a relative address: "$1".\nThe browser looks for it in the folder the page is in, not on the internet.'],
    [/^(.+) ✓$/, function(m, t){ var e = exact(t); return e ? e + ' ✓' : null; }],
    [/^([^:]{2,40}): (.+)$/, function(m, a, b){ var ea = exact(a), eb = exact(b); return ea && eb ? ea + ': ' + eb : null; }],
    [/^(\S+) — (.+)$/, function(m, w, g){ var e = exact(g); return e ? w + ' — ' + e : null; }]
  ];
  function tr(t){
    var e = exact(t);
    if (e != null) return e;
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i], m = t.match(r[0]);
      if (!m) continue;
      var out = typeof r[1] === 'function' ? r[1].apply(null, m) : t.replace(r[0], r[1]);
      if (out != null) return out;
    }
    return null;
  }
  window.i18nT = function(s){ return lang === 'en' ? (tr(i18nNorm(String(s))) || s) : s; };

  // CPU simulyatori izohlari HTML ichida — alohida qoidalar
  var CPU_HTML = [
    [/ Xotiraning (\d+)-katagidagi (<code>[^<]+<\/code>) MDR orqali <code>IR<\/code> ga tushdi\./, ' The instruction $2 from cell $1 traveled via MDR into <code>IR</code>.'],
    [/: endi PC = (\d+)\./, ': PC is now $1.'],
    [/CU (<code>[^<]+<\/code>) ni ikkiga bo'ldi: opkod/, 'The CU split $1 in two: opcode'],
    [/<strong>noma'lum<\/strong>/, '<strong>unknown</strong>'],
    [/, operand (<code>[^<]+<\/code>) = (\d+)-katak\./, ', operand $1 = cell $2.'],
    [/\. Ma'nosi: to'xtash\./, '. Meaning: stop.'],
    [/\. Son akkumulyatorga yozilishga tayyor\./, '. The number is ready to go into the accumulator.'],
    [/\. <strong>ALU<\/strong> ishladi: ACC /, '. The <strong>ALU</strong> ran: ACC '],
    [/\. Son xotiraga yozilishga tayyor\./, '. The number is ready to be written to memory.'],
    [/HALT — mashina to'xtadi\./, 'HALT — the machine stopped.'],
    [/Noma'lum buyruq — mashina to'xtadi\./, 'Unknown instruction — the machine stopped.'],
    [/ (\d+)-katakka qarang: /, ' Look at cell $1: '],
    [/\. Natija xotirada!/, '. The result is in memory!'],
    [/: akkumulyatorda endi (\d+)\. Sikl boshiga qaytamiz\./, ': the accumulator now holds $1. Back to the start of the cycle.'],
    [/ALU natijasi <code>ACC<\/code> ga yozildi: (\d+)\. Sikl boshiga qaytamiz\./, 'The ALU result was written to <code>ACC</code>: $1. Back to the start of the cycle.'],
    [/: (\d+) soni (\d+)-katakka yozildi\./, ': the number $1 was written to cell $2.']
  ];

  // ---------- Qo'llash va qaytarish ----------
  var lang = 'uz', touchedEls = [], touchedNodes = [], touchedAttrs = [], mo = null;
  function trNode(n){
    if (n.__uz != null) return;
    var raw = n.nodeValue, t = i18nNorm(raw);
    if (!t) return;
    var en = tr(t);
    if (en == null || en === t) return;
    n.__uz = raw;
    n.nodeValue = raw.match(/^\s*/)[0] + en + raw.match(/\s*$/)[0];
    touchedNodes.push(n);
  }
  function trUnits(scope){
    i18nUnits(scope).forEach(function(u){
      if (u.mode === 'h') {
        if (u.el.__uz != null) return;
        var en = H[i18nNorm(u.el.innerHTML)];
        if (en == null) { u.nodes.forEach(trNode); return; }
        var pres = u.el.querySelectorAll('pre');
        u.el.__uz = u.el.innerHTML;
        u.el.innerHTML = en;
        if (pres.length) u.el.querySelectorAll('pre').forEach(function(p, i){ if (pres[i]) p.replaceWith(pres[i]); });
        touchedEls.push(u.el);
      } else u.nodes.forEach(trNode);
    });
  }
  function trAttrs(scope){
    var list = [scope].concat(Array.prototype.slice.call(scope.querySelectorAll('[aria-label],[title],[placeholder],[alt]')));
    list.forEach(function(el){
      if (!el.getAttribute) return;
      I18N_ATTRS.forEach(function(a){
        var v = el.getAttribute(a);
        if (!v || !HAS_WORD.test(v)) return;
        el.__uzA = el.__uzA || {};
        if (a in el.__uzA) return;
        var en = tr(i18nNorm(v));
        if (en == null || en === v) return;
        el.__uzA[a] = v;
        el.setAttribute(a, en);
        touchedAttrs.push(el);
      });
    });
  }
  function cpuLog(){
    var log = document.getElementById('cpu-log');
    if (!log) return;
    var h = log.innerHTML, n = h;
    CPU_HTML.forEach(function(r){ n = n.replace(r[0], r[1]); });
    if (n !== h) { log.__uz = h; log.innerHTML = n; touchedEls.push(log); }
  }
  function applyEN(){
    cpuLog();
    trUnits(document.body);
    trAttrs(document.body);
    if (!root.__uzTitle) root.__uzTitle = document.title;
    document.title = tr(document.title) || document.title;
    root.lang = 'en';
  }
  function revert(){
    touchedEls.forEach(function(el){ if (el.__uz != null) { el.innerHTML = el.__uz; el.__uz = null; } });
    touchedNodes.forEach(function(n){ if (n.__uz != null) { n.nodeValue = n.__uz; n.__uz = null; } });
    touchedAttrs.forEach(function(el){ if (el.__uzA) { Object.keys(el.__uzA).forEach(function(a){ el.setAttribute(a, el.__uzA[a]); }); el.__uzA = null; } });
    touchedEls = []; touchedNodes = []; touchedAttrs = [];
    if (root.__uzTitle) document.title = root.__uzTitle;
    root.lang = 'uz';
    var cur = document.querySelector('.tab[aria-selected="true"]');
    if (cur) cur.setAttribute('aria-selected', 'true');
  }
  function onMutations(recs){
    if (lang !== 'en') return;
    var els = new Set();
    recs.forEach(function(r){
      if (r.type === 'attributes') { var el = r.target; if (el.__uzA && r.attributeName in el.__uzA) delete el.__uzA[r.attributeName]; trAttrs(el); return; }
      if (r.type === 'characterData') { r.target.__uz = null; if (r.target.parentElement) els.add(r.target.parentElement); return; }
      els.add(r.target);
      r.addedNodes.forEach(function(n){ if (n.nodeType === 1) els.add(n); });
    });
    els.forEach(function(el){
      if (!el.isConnected || el.closest(I18N_SKIP)) return;
      for (var a = el; a; a = a.parentElement) if (a.__uz != null) a.__uz = null;
      if (el.id === 'cpu-log') cpuLog();
      trUnits(el);
      trAttrs(el);
    });
    mo.takeRecords();
  }
  function setLang(l, save){
    l = l === 'en' ? 'en' : 'uz';
    if (mo) mo.takeRecords();
    if (l !== lang) {
      if (l === 'en') { lang = 'en'; applyEN(); }
      else { lang = 'uz'; revert(); }
    }
    if (mo) mo.takeRecords();
    document.querySelectorAll('[data-lang-set]').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-lang-set') === l ? 'true' : 'false'); });
    if (save) { try { localStorage.setItem(LANG_KEY, l); } catch(e) {} }
    root.classList.remove('i18n-pending');
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: l } }));
  }
  window.i18nSetLang = setLang;

  // ---------- Tugmalar ----------
  var tools = document.querySelector('.topbar .tools');
  if (tools) {
    var seg = document.createElement('div');
    seg.className = 'lang-seg'; seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Til / Language');
    seg.innerHTML = '<button type="button" data-lang-set="uz" aria-pressed="true" title="O\'zbekcha">UZ</button><button type="button" data-lang-set="en" aria-pressed="false" title="English">EN</button>';
    tools.insertBefore(seg, tools.firstChild);
  }
  var drView = document.querySelector('.drawer .dr-view');
  if (drView) {
    var row = document.createElement('div');
    row.className = 'dr-view';
    row.innerHTML = '<span>Til · Language</span><div class="lang-seg dr-lang" role="group" aria-label="Til / Language"><button type="button" data-lang-set="uz" aria-pressed="true">O\'zbekcha</button><button type="button" data-lang-set="en" aria-pressed="false">English</button></div>';
    row.setAttribute('data-no-i18n', '');
    drView.parentNode.insertBefore(row, drView);
  }
  document.querySelectorAll('[data-lang-set]').forEach(function(b){
    b.addEventListener('click', function(){ setLang(b.getAttribute('data-lang-set'), true); });
  });

  // ---------- Ishga tushirish ----------
  mo = new MutationObserver(onMutations);
  mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: I18N_ATTRS });
  var want = 'uz';
  try { want = localStorage.getItem(LANG_KEY) || 'uz'; } catch(e) {}
  var q = (location.search.match(/[?&]lang=(uz|en)\b/) || [])[1];
  if (q) want = q;
  setLang(want, !!q);
  setTimeout(function(){ root.classList.remove('i18n-pending'); }, 3000);
})();
