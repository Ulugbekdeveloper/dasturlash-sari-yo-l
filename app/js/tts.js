(function(){
  if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
  var synth = window.speechSynthesis;
  var $ = function(id){ return document.getElementById(id); };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HL = !!(window.CSS && CSS.highlights && window.Highlight);
  var VOICE_KEY = 'frontendga-sari-tts-voice', RATE_KEY = 'frontendga-sari-tts-rate';
  var RATES = [0.8, 1, 1.2, 1.5];
  var rate = 1;
  try { rate = +localStorage.getItem(RATE_KEY) || 1; } catch(e) {}
  if (RATES.indexOf(rate) < 0) rate = 1;

  // ---------- Ikonkalar ----------
  function svg(inner, cls, fill){ return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="0 0 24 24" fill="' + (fill ? 'currentColor' : 'none') + '" stroke="' + (fill ? 'none' : 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>'; }
  var I_SPK = svg('<path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>', 'i-play');
  var I_PLAY = svg('<path d="M8 5.5v13a1 1 0 0 0 1.5.87l10.2-6.5a1 1 0 0 0 0-1.74L9.5 4.63A1 1 0 0 0 8 5.5z"/>', 'i-play', true);
  var I_PAUSE = svg('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 'i-pause', true);
  var I_HEAD = svg('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="7" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="7" rx="1.5"/>');
  var I_PREV = svg('<path d="M18 6L9 12l9 6V6z"/><rect x="5" y="6" width="2.5" height="12" rx="1"/>', '', true);
  var I_NEXT = svg('<path d="M6 6l9 6-9 6V6z"/><rect x="16.5" y="6" width="2.5" height="12" rx="1"/>', '', true);
  var I_SET = svg('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>');
  var I_X = svg('<path d="M6 6l12 12M18 6L6 18"/>');

  // ---------- O'zbekcha sonlar ----------
  var ONES = ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"];
  var TENS = ['', "o'n", 'yigirma', "o'ttiz", 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', "to'qson"];
  function n999(n){
    var p = [], h = Math.floor(n / 100), r = n % 100;
    if (h) p.push(h > 1 ? ONES[h] + ' yuz' : 'yuz');
    if (r >= 10) p.push(TENS[Math.floor(r / 10)]);
    if (r % 10) p.push(ONES[r % 10]);
    return p.join(' ');
  }
  function numUz(n){
    if (!isFinite(n) || n >= 1e12) return String(n).split('').map(function(d){ return ONES[+d] || ''; }).join(' ');
    if (n === 0) return 'nol';
    var parts = [];
    [[1e9, 'milliard'], [1e6, 'million'], [1e3, 'ming']].forEach(function(u){
      if (n >= u[0]) { var k = Math.floor(n / u[0]); n %= u[0]; parts.push((k === 1 && u[1] === 'ming' ? '' : n999(k) + ' ') + u[1]); }
    });
    if (n) parts.push(n999(n));
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }
  function ordinal(words){ return words + (/[aeiou]$/.test(words) ? 'nchi' : 'inchi'); }
  function decimalUz(intPart, frac){
    var den = { 1: "o'ndan", 2: 'yuzdan', 3: 'mingdan' }[frac.length];
    return numUz(+intPart) + ' butun ' + (den ? den + ' ' + numUz(+frac) : frac.split('').map(function(d){ return ONES[+d]; }).join(' '));
  }

  // ---------- Turkcha ovoz uchun o'zbekcha yozuvni moslash ----------
  function toTr(w){
    if (/^[A-Z0-9]{2,}s?$/.test(w)) return w;
    return w.replace(/[ʻʼ‘’`´]/g, "'").toLowerCase()
      .replace(/o'/g, 'o').replace(/g'/g, 'g').replace(/sh/g, 'ş').replace(/ch/g, 'ç')
      .replace(/q/g, 'k').replace(/x/g, 'h').replace(/j/g, 'c').replace(/w/g, 'v').replace(/'/g, '');
  }

  var MODE = 'uz';
  var SYM = { '+': 'plyus', '=': 'teng', '×': "ko'paytirish", '≈': 'taxminan', '&': 'va' };
  function speakToken(raw){
    if (SYM[raw]) return MODE === 'tr' ? toTr(SYM[raw]) : SYM[raw];
    if (/^[-–—−→←↑↓·•|/]+$/.test(raw)) return '';
    var t = raw.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '')
      .replace(/[<>\/{}\[\]()=#*_|~→←↑↓·•"“”«»„◀▶✓✕]/g, ' ')
      .replace(/%/g, ' foiz ');
    var punct = (t.match(/[.,!?:;…]+\s*$/) || [''])[0].trim();
    t = t.replace(/[.,!?:;…]+\s*$/, '').trim();
    if (!t) return punct === '.' || punct === '!' || punct === '?' ? punct : '';
    if (MODE === 'tr' || MODE === 'raw') {
      t = t.replace(/(\d)[\s ](?=\d{3}\b)/g, '$1');
      t = t.replace(/(\d+)[,.](\d+)/g, function(_, a, b){ return decimalUz(a, b); });
      t = t.replace(/(\d+)-([A-Za-zʻʼ'‘’]+)/g, function(_, n, rest){ return ordinal(numUz(+n)) + ' ' + rest; });
      t = t.replace(/\d+/g, function(n){ return ' ' + numUz(+n) + ' '; });
    }
    t = t.replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!t) return '';
    if (MODE === 'tr') t = t.split(' ').map(toTr).join(' ');
    return t + punct;
  }

  // ---------- Matnni bo'laklarga ajratish ----------
  var SKIP = '.un-msg,.git-sim,.git-places,.git-flow,.tm-lab,.l5-onoff,.css-anat,.color-lab,.box-lab,.flow-demo,.page-map,.flex-lab,.seg-btns,.frame-fit,.mouse-lab,.cli-lab,.unix-lab,#asm-lab,#kmp-lab,#pkt-lab,.form-demo,.sent-box,.tbl-anat,.inp-grid,pre,svg,button,input,textarea,select,script,style,.word-grid,.quiz,.play,.cpu-sim,.gate-lab,.gates,.adder,.bin-lab,.arch,.slot-box,.tl-chips,.net,.trip,.typer,.demo-grid,.game,.kb-wrap,.kgame,.lab,.drag-zone,.typing,.og,.wgame,.sorter,.progress-track,.progress-label,.meta,.step-num,.isa,.hier,.old-web,.mac,.check-row,.anatomy,.tiles,.acts,.flow,.cmp,.mem,.ipo,.layers,.tree,.crumbs,.play-actions,.quiz-foot,[aria-hidden="true"],[hidden]';
  var BLOCKS = '.hero-card,.chapter,.lesson-head,.part-head,.step,.disclaimer,.quote-inline,.quote,.next-up';
  var dispCache = new WeakMap();
  function disp(el){ var d = dispCache.get(el); if (!d) { d = getComputedStyle(el).display; dispCache.set(el, d); } return d; }
  function blockOf(node, container){
    var el = node.parentElement;
    while (el && el !== container && disp(el).indexOf('inline') === 0) el = el.parentElement;
    return el || container;
  }
  function chunksOf(container){
    var out = [], cur = null;
    var tw = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, { acceptNode: function(n){
      if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      var p = n.parentElement;
      if (!p || p.closest(SKIP) || !p.getClientRects().length) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    } });
    var n;
    while ((n = tw.nextNode())) {
      var b = blockOf(n, container);
      if (!cur || cur.el !== b) { cur = { el: b, nodes: [], text: '' }; out.push(cur); }
      var v = n.nodeValue.replace(/\s/g, ' ');
      cur.nodes.push({ node: n, start: cur.text.length, end: cur.text.length + v.length });
      cur.text += v;
    }
    return out.filter(function(c){ return /[\p{L}\p{N}]/u.test(c.text); });
  }
  var WORD_RE = /\d{1,3}(?:[  ]\d{3})+[^\s ]*|[^\s ]+/g;
  function plan(ch){
    var words = [], m;
    WORD_RE.lastIndex = 0;
    while ((m = WORD_RE.exec(ch.text))) {
      var sp = speakToken(m[0]);
      if (sp) words.push({ ws: m.index, we: m.index + m[0].length, sp: sp, raw: m[0] });
    }
    var sents = [], cur = [], len = 0;
    words.forEach(function(w){
      cur.push(w); len += w.sp.length + 1;
      if (/[.!?…]["”»)]*$/.test(w.raw) || (len > 180 && /[,;:]$/.test(w.raw)) || len > 260) { sents.push(cur); cur = []; len = 0; }
    });
    if (cur.length) sents.push(cur);
    return sents.map(function(ws){
      var s = '', map = [];
      ws.forEach(function(w){ if (s) s += ' '; map.push({ s: s.length, w: w }); s += w.sp; });
      return { text: s, map: map };
    }).filter(function(se){ return /[\p{L}\p{N}]/u.test(se.text); });
  }
  function rangeFor(ch, a, b){
    var sa = null, sb = null;
    for (var i = 0; i < ch.nodes.length; i++) {
      var n = ch.nodes[i];
      if (!sa && a >= n.start && a < n.end) sa = [n.node, a - n.start];
      if (sa && b > n.start && b <= n.end) { sb = [n.node, b - n.start]; break; }
    }
    if (!sa || !sb) return null;
    var r = document.createRange();
    try { r.setStart(sa[0], sa[1]); r.setEnd(sb[0], sb[1]); } catch(e) { return null; }
    return r;
  }

  // ---------- Ovozlar ----------
  var voices = [], voice = null;
  function isEN(){ return document.documentElement.lang === 'en'; }
  function score(v){
    var l = (v.lang || '').toLowerCase().replace('_', '-'), s = 0;
    if (isEN()) { s = l.indexOf('en-us') === 0 ? 100 : l.indexOf('en-gb') === 0 ? 96 : l.indexOf('en') === 0 ? 90 : 0; if (s && /natural|online|neural|premium|enhanced/i.test(v.name)) s += 4; if (s && v.localService) s += 2; return s; }
    if (l.indexOf('uz') === 0) s = 100; else if (l.indexOf('tr') === 0) s = 80; else if (l.indexOf('az') === 0) s = 70;
    else if (l.indexOf('kk') === 0) s = 40; else if (l.indexOf('ru') === 0) s = 30; else if (l.indexOf('en') === 0) s = 10;
    if (s && /natural|online|neural|premium|enhanced/i.test(v.name)) s += 4;
    if (s && v.localService) s += 2;
    return s;
  }
  function modeOf(v){
    if (isEN()) return 'en';
    var l = v ? (v.lang || '').toLowerCase() : 'uz';
    return l.indexOf('uz') === 0 ? 'uz' : (l.indexOf('tr') === 0 || l.indexOf('az') === 0) ? 'tr' : 'raw';
  }
  function loadVoices(){
    voices = synth.getVoices() || [];
    var saved = '';
    try { saved = localStorage.getItem(VOICE_KEY + (isEN() ? '-en' : '')) || ''; } catch(e) {}
    var list = voices.filter(function(v){ return score(v) > 0; }).sort(function(a, b){ return score(b) - score(a); });
    if (!list.length) list = voices.slice();
    voice = list.filter(function(v){ return v.voiceURI === saved; })[0] || list[0] || null;
    var sel = $('tts-voice');
    if (sel) {
      sel.innerHTML = list.map(function(v, i){ return '<option value="' + i + '"' + (v === voice ? ' selected' : '') + '>' + v.name.replace(/</g, '') + ' — ' + v.lang + '</option>'; }).join('') || '<option>Ovoz topilmadi</option>';
      sel._list = list;
    }
    MODE = modeOf(voice);
    updateNote();
  }
  function updateNote(){
    var note = $('tts-note'), sub = $('tts-sub');
    if (!note) return;
    var name = voice ? voice.name.replace(/^(Microsoft|Google)\s+/, '').replace(/\s*\(.*$/, '').replace(/\s+Online$/, '') : 'standart';
    if (MODE === 'en') { note.innerHTML = voice ? 'English voice: ' + name + '.' : 'No English voice found on this device.'; sub.dataset.voice = name; return; }
    if (MODE === 'uz') note.innerHTML = "O'zbekcha ovoz ishlatilmoqda.";
    else if (MODE === 'tr') note.innerHTML = "Qurilmada o'zbekcha ovoz topilmadi, shuning uchun turkcha ovoz o'zbekchaga moslab o'qiydi. Eng tiniq o'zbekcha ovoz uchun sahifani <b>Microsoft Edge</b> brauzerida oching (Madina yoki Sardor ovozi).";
    else note.innerHTML = "O'zbekcha va turkcha ovoz topilmadi. Tiniqroq o'qish uchun <b>Microsoft Edge</b> brauzerida oching yoki qurilma sozlamalaridan turkcha ovoz yuklab oling.";
    sub.dataset.voice = name + (MODE === 'uz' ? " · o'zbekcha" : MODE === 'tr' ? ' · turkcha' : '');
  }

  // ---------- UI ----------
  function titleOf(block){
    var h = block.querySelector('.step-title, h2, h3, .quote-text');
    if (!h) return (block.textContent || '').trim().slice(0, 60);
    var num = h.querySelector('.step-num');
    return h.textContent.replace(num ? num.textContent : '', '').replace(/\s+/g, ' ').trim();
  }
  document.querySelectorAll('.panel').forEach(function(panel){
    panel.querySelectorAll('.step, .chapter, .hero-card, .lesson-head').forEach(function(b){
      if (b.querySelector(':scope > .tts-btn')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tts-btn';
      btn.setAttribute('aria-label', "Ovoz chiqarib o'qish: " + titleOf(b));
      btn.title = "Ovoz chiqarib o'qish";
      btn.innerHTML = I_SPK + I_PAUSE;
      btn.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if (root.classList.contains('tts-on') && S.blocks[S.bi] === b) { toggle(); return; }
        start(b);
      });
      b.insertBefore(btn, b.firstChild);
    });
  });
  var tools = document.querySelector('.topbar .tools');
  if (tools) {
    var tb = document.createElement('button');
    tb.type = 'button'; tb.className = 'tts-top'; tb.id = 'tts-top';
    tb.setAttribute('aria-label', "Shu sahifani ovoz chiqarib o'qish"); tb.title = "Tinglash";
    tb.innerHTML = I_HEAD;
    tb.addEventListener('click', function(){
      if (root.classList.contains('tts-on')) { toggle(); return; }
      var panel = document.querySelector('.panel:not([hidden])');
      var first = panel && blocksOf(panel)[0];
      if (first) start(first);
    });
    tools.insertBefore(tb, tools.firstChild);
  }
  var bar = document.createElement('div');
  bar.className = 'tts-bar'; bar.id = 'tts-bar';
  bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', "Ovozli o'qish");
  bar.innerHTML =
    '<div class="tts-row">' +
      '<button type="button" class="tts-ctl tts-hide-sm" id="tts-prev" aria-label="Oldingi bo\'lak" title="Oldingi bo\'lak">' + I_PREV + '</button>' +
      '<button type="button" class="tts-ctl main" id="tts-play" aria-label="Pauza yoki davom ettirish">' + I_PLAY + I_PAUSE + '</button>' +
      '<button type="button" class="tts-ctl" id="tts-next" aria-label="Keyingi bo\'lak" title="Keyingi bo\'lak">' + I_NEXT + '</button>' +
      '<div class="tts-info"><b id="tts-title">—</b><span id="tts-sub"></span></div>' +
      '<button type="button" class="tts-ctl tts-speed" id="tts-speed" aria-label="O\'qish tezligi" title="Tezlik">1×</button>' +
      '<button type="button" class="tts-ctl" id="tts-gear" aria-expanded="false" aria-controls="tts-set" aria-label="Ovoz sozlamalari" title="Ovoz">' + I_SET + '</button>' +
      '<button type="button" class="tts-ctl" id="tts-stop" aria-label="To\'xtatish" title="To\'xtatish">' + I_X + '</button>' +
    '</div>' +
    '<div class="tts-prog"><i id="tts-prog"></i></div>' +
    '<div class="tts-set" id="tts-set" hidden><label for="tts-voice">Ovoz:</label><select id="tts-voice"></select><p class="tts-note" id="tts-note"></p></div>';
  document.body.appendChild(bar);
  var st = document.createElement('style');
  st.textContent = '.tts-set[hidden]{display:none!important}.tts-note{flex-basis:100%}';
  document.head.appendChild(st);

  // ---------- O'qish holati ----------
  var S = { blocks: [], bi: 0, chunks: null, ci: 0, sents: null, si: 0, playing: false, uid: 0, curEl: null, est: [] };
  function blocksOf(panel){
    return Array.prototype.filter.call(panel.querySelectorAll(BLOCKS), function(el){
      return !el.parentElement.closest(BLOCKS) && el.getClientRects().length;
    });
  }
  function clearWord(){ if (HL) CSS.highlights.delete('tts-word'); }
  function setBlockUI(){
    document.querySelectorAll('.tts-btn.on').forEach(function(b){ b.classList.remove('on', 'playing'); });
    var blk = S.blocks[S.bi];
    if (!blk) return;
    var btn = blk.querySelector(':scope > .tts-btn');
    if (btn) { btn.classList.add('on'); btn.classList.toggle('playing', S.playing); }
    $('tts-title').textContent = titleOf(blk) || "O'qilmoqda";
  }
  function setSub(){
    var sub = $('tts-sub');
    sub.textContent = (S.playing ? "O'qilmoqda" : 'Pauza') + (sub.dataset.voice ? ' · ' + sub.dataset.voice : '');
  }
  function setPlaying(p){
    S.playing = p;
    root.classList.toggle('tts-playing', p);
    setBlockUI(); setSub();
  }
  function setChunkEl(el){
    if (S.curEl === el) return;
    if (S.curEl) S.curEl.classList.remove('tts-reading');
    S.curEl = el;
    if (!el) return;
    el.classList.add('tts-reading');
    var r = el.getBoundingClientRect(), topH = 70, botH = bar.offsetHeight + 30;
    if (r.top < topH || r.bottom > window.innerHeight - botH) {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: r.height > window.innerHeight * 0.6 ? 'start' : 'center' });
    }
  }
  function progress(){
    var n = S.blocks.length || 1, cf = 0;
    if (S.chunks && S.chunks.length) cf = (S.ci + (S.sents && S.sents.length ? S.si / S.sents.length : 0)) / S.chunks.length;
    $('tts-prog').style.width = Math.min(100, (S.bi + cf) / n * 100) + '%';
  }
  function ensure(){
    while (S.bi < S.blocks.length) {
      if (!S.chunks) { S.chunks = chunksOf(S.blocks[S.bi]); S.ci = 0; S.sents = null; setBlockUI(); }
      while (S.ci < S.chunks.length) {
        if (!S.sents) { S.sents = plan(S.chunks[S.ci]); S.si = 0; }
        if (S.si < S.sents.length) return true;
        S.ci++; S.sents = null;
      }
      S.bi++; S.chunks = null;
    }
    return false;
  }
  function hlWord(ch, se, idx){
    if (!HL) return;
    var hit = null;
    for (var i = 0; i < se.map.length; i++) { if (se.map[i].s <= idx) hit = se.map[i]; else break; }
    if (!hit) return;
    var r = rangeFor(ch, hit.w.ws, hit.w.we);
    if (r) CSS.highlights.set('tts-word', new Highlight(r));
  }
  function stopEst(){ S.est.forEach(clearTimeout); S.est = []; }
  function estimate(ch, se, id){
    var msPerChar = 1000 / (13.5 * rate), t = 0;
    se.map.forEach(function(m){
      S.est.push(setTimeout(function(){ if (id === S.uid) hlWord(ch, se, m.s); }, t));
      t += (m.w.sp.length + 1) * msPerChar;
    });
  }
  function speakCur(){
    stopEst();
    if (!S.playing) return;
    if (!ensure()) { stop(); return; }
    var ch = S.chunks[S.ci], se = S.sents[S.si];
    setChunkEl(ch.el); progress();
    var u = new SpeechSynthesisUtterance(se.text);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'uz-UZ';
    u.rate = rate;
    var id = ++S.uid, gotB = false, started = false;
    u.onstart = function(){
      if (id !== S.uid) return;
      started = true;
      hlWord(ch, se, 0);
      S.est.push(setTimeout(function(){ if (id === S.uid && !gotB) estimate(ch, se, id); }, 450));
    };
    u.onboundary = function(e){
      if (id !== S.uid || (e.name && e.name !== 'word')) return;
      if (!gotB) { gotB = true; stopEst(); }
      hlWord(ch, se, e.charIndex);
    };
    u.onend = function(){ if (id !== S.uid) return; S.si++; speakCur(); };
    u.onerror = function(e){
      if (id !== S.uid) return;
      if (e.error === 'interrupted' || e.error === 'canceled') { pause(); return; }
      S.si++; speakCur();
    };
    synth.speak(u);
    setTimeout(function(){ if (id === S.uid && S.playing && !started && !synth.speaking) { synth.cancel(); speakCur(); } }, 1800);
  }
  function start(block){
    var panel = block.closest('.panel');
    S.uid++; synth.cancel(); stopEst(); clearWord();
    S.blocks = blocksOf(panel);
    S.bi = Math.max(0, S.blocks.indexOf(block)); S.chunks = null; S.sents = null; S.ci = 0; S.si = 0;
    if (!voices.length) loadVoices();
    root.classList.add('tts-on');
    setPlaying(true);
    speakCur();
  }
  function pause(){
    S.uid++; synth.cancel(); stopEst();
    setPlaying(false);
  }
  function resume(){ setPlaying(true); speakCur(); }
  function toggle(){ if (S.playing) pause(); else resume(); }
  function stop(){
    S.uid++; synth.cancel(); stopEst(); clearWord();
    setChunkEl(null);
    S.playing = false;
    root.classList.remove('tts-on', 'tts-playing');
    document.querySelectorAll('.tts-btn.on').forEach(function(b){ b.classList.remove('on', 'playing'); });
  }
  function jump(dir){
    var was = S.playing;
    S.uid++; synth.cancel(); stopEst(); clearWord();
    if (dir > 0) { S.ci++; S.sents = null; }
    else if (S.si > 0 || (S.ci === 0 && S.bi === 0)) { S.sents = null; }
    else if (S.ci > 0) { S.ci--; S.sents = null; }
    else { S.bi--; S.chunks = chunksOf(S.blocks[S.bi]); S.ci = Math.max(0, S.chunks.length - 1); S.sents = null; setBlockUI(); }
    S.playing = was;
    if (was) speakCur();
    else if (ensure()) { setChunkEl(S.chunks[S.ci].el); progress(); }
  }
  function restartSentence(){ if (S.playing) { S.uid++; synth.cancel(); speakCur(); } }

  $('tts-play').addEventListener('click', toggle);
  $('tts-stop').addEventListener('click', stop);
  $('tts-next').addEventListener('click', function(){ jump(1); });
  $('tts-prev').addEventListener('click', function(){ jump(-1); });
  var speedBtn = $('tts-speed');
  function showRate(){ speedBtn.textContent = String(rate).replace('.', ',') + '×'; }
  speedBtn.addEventListener('click', function(){
    rate = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    try { localStorage.setItem(RATE_KEY, String(rate)); } catch(e) {}
    showRate(); restartSentence();
  });
  showRate();
  $('tts-gear').addEventListener('click', function(){
    var set = $('tts-set'), open = set.hidden;
    set.hidden = !open;
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $('tts-voice').addEventListener('change', function(){
    var v = this._list && this._list[+this.value];
    if (!v) return;
    voice = v; MODE = modeOf(v);
    try { localStorage.setItem(VOICE_KEY + (isEN() ? '-en' : ''), v.voiceURI); } catch(e) {}
    updateNote(); setSub();
    if (S.sents) S.sents = null;
    restartSentence();
  });
  document.addEventListener('keydown', function(e){
    if (!root.classList.contains('tts-on') || root.classList.contains('drawer-open')) return;
    if (e.key === 'Escape') stop();
  });

  // Boshqa dars ochilsa — to'xtatamiz
  var tabsEl = $('tabs');
  if (tabsEl && window.MutationObserver) new MutationObserver(function(){
    var panel = document.querySelector('.panel:not([hidden])');
    if (root.classList.contains('tts-on') && S.blocks.length && !panel.contains(S.blocks[0])) stop();
  }).observe(tabsEl, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
  window.addEventListener('pagehide', function(){ synth.cancel(); });

  document.addEventListener('i18n:change', function(){ stop(); loadVoices(); setSub(); });
  loadVoices();
  if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', loadVoices);
  setSub();
})();
