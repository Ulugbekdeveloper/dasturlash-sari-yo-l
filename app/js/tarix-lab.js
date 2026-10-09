(function(){
  var $ = function(id){ return document.getElementById(id); };
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function isEN(){ return document.documentElement.lang === 'en'; }
  function L(uz, en){ return isEN() ? en : uz; }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var redraw = [];
  document.addEventListener('i18n:change', function(){ redraw.forEach(function(f){ f(); }); });

  // ================= O'quv mashinasi: assembler va ishga tushirish =================
  var OPS = { LOAD: 1, ADD: 2, SUB: 3, STORE: 4, JMP: 5, JZ: 6, HALT: 15 };
  var NAMES = {}; Object.keys(OPS).forEach(function(k){ NAMES[OPS[k]] = k; });
  function bin8(v){ var s = (v & 255).toString(2); while (s.length < 8) s = '0' + s; return s.slice(0, 4) + ' ' + s.slice(4); }

  function assemble(src){
    var items = [], labels = {}, errors = [];
    src.split('\n').forEach(function(raw, i){
      var line = raw.replace(/;.*$/, '').trim(), lab = null;
      if (!line) return;
      var m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
      if (m) {
        lab = m[1].toUpperCase(); line = m[2].trim();
        if (Object.prototype.hasOwnProperty.call(labels, lab)) errors.push({ ln: i + 1, k: 'dup', a: lab });
        else labels[lab] = items.length;
      }
      if (!line) return;
      var p = line.split(/\s+/);
      items.push({ ln: i + 1, label: lab, op: p[0].toUpperCase(), arg: p[1] || '' });
    });
    var mem = [], bad = {};
    items.forEach(function(it, addr){
      var word = null;
      if (it.op === 'DAT') {
        var v = it.arg === '' ? 0 : +it.arg;
        if (!/^\d+$/.test(it.arg || '0') || v > 255) errors.push({ ln: it.ln, k: 'range' });
        else word = v;
      } else if (Object.prototype.hasOwnProperty.call(OPS, it.op)) {
        var operand = 0;
        if (it.op !== 'HALT') {
          if (!it.arg) errors.push({ ln: it.ln, k: 'noarg', a: it.op });
          else if (/^\d+$/.test(it.arg)) { operand = +it.arg; if (operand > 15) { errors.push({ ln: it.ln, k: 'addr' }); operand = null; } }
          else if (Object.prototype.hasOwnProperty.call(labels, it.arg.toUpperCase())) { operand = labels[it.arg.toUpperCase()]; it.ref = it.arg.toUpperCase(); }
          else { errors.push({ ln: it.ln, k: 'nolabel', a: it.arg }); operand = null; }
        }
        if (operand !== null && (it.op === 'HALT' || it.arg)) word = (OPS[it.op] << 4) | (operand & 15);
      } else errors.push({ ln: it.ln, k: 'unknown', a: it.op });
      if (word === null) bad[addr] = true;
      mem.push(word === null ? 0 : word);
    });
    if (items.length > 16) errors.push({ k: 'full', a: items.length });
    while (mem.length < 16) mem.push(0);
    return { items: items, labels: labels, errors: errors, mem: mem.slice(0, 16), bad: bad };
  }
  function errText(e){
    var n = e.ln;
    switch (e.k) {
      case 'dup': return L(n + '-qator: "' + e.a + '" belgisi ikki marta yozilgan.', 'Line ' + n + ': the label "' + e.a + '" is defined twice.');
      case 'range': return L(n + "-qator: DAT uchun son 0 dan 255 gacha bo'lishi kerak.", 'Line ' + n + ': a DAT value must be a number from 0 to 255.');
      case 'noarg': return L(n + '-qator: ' + e.a + " buyrug'iga manzil yoki belgi kerak.", 'Line ' + n + ': ' + e.a + ' needs an address or a label.');
      case 'addr': return L(n + "-qator: manzil 0 dan 15 gacha bo'lishi kerak — mashinamizda 16 ta katak bor.", 'Line ' + n + ': an address must be 0 to 15 — our machine has 16 cells.');
      case 'nolabel': return L(n + '-qator: "' + e.a + '" degan belgi topilmadi.', 'Line ' + n + ': no label called "' + e.a + '" was found.');
      case 'unknown': return L(n + '-qator: "' + e.a + "\" degan buyruq yo'q. Lug'atdagi buyruqlar: LOAD, ADD, SUB, STORE, JMP, JZ, HALT, DAT.", 'Line ' + n + ': there is no instruction "' + e.a + '". The dictionary has: LOAD, ADD, SUB, STORE, JMP, JZ, HALT, DAT.');
      case 'full': return L("Dastur 16 katakka sig'madi: " + e.a + " ta buyruq va ma'lumot bor.", "The program doesn't fit in 16 cells: it has " + e.a + ' instructions and data.');
    }
    return '';
  }
  function run(mem, limit){
    mem = mem.slice(); limit = limit || 500;
    var pc = 0, acc = 0, steps = 0, why = 'halt';
    while (true) {
      if (steps >= limit) { why = 'limit'; break; }
      if (pc > 15) { why = 'end'; break; }
      var w = mem[pc], op = w >> 4, a = w & 15;
      steps++; pc++;
      if (op === 1) acc = mem[a];
      else if (op === 2) acc = (acc + mem[a]) & 255;
      else if (op === 3) acc = (acc - mem[a] + 256) & 255;
      else if (op === 4) mem[a] = acc;
      else if (op === 5) pc = a;
      else if (op === 6) { if (acc === 0) pc = a; }
      else if (op === 15) break;
      else { why = 'unknown'; break; }
    }
    return { mem: mem, acc: acc, steps: steps, why: why };
  }
  window.ToyMachine = { assemble: assemble, run: run, bin8: bin8 };

  // ================= 2-bob: Assembler laboratoriyasi =================
  (function(){
    var src = $('asm-src'), out = $('asm-out'), log = $('asm-log');
    if (!src) return;
    var EX = {
      add: ['; 5 + 7 ni hisoblaymiz', '; Compute 5 + 7'],
      loop: ["; 4 ni 3 marta qo'shamiz: 4 × 3", '; Add 4 three times: 4 × 3'],
      bug: ['; Bu dasturda ikkita xato bor', '; This program has two bugs']
    };
    var BODY = {
      add: '        LOAD  A\n        ADD   B\n        STORE NATIJA\n        HALT\nA:      DAT   5\nB:      DAT   7\nNATIJA: DAT   0',
      loop: 'SIKL:   LOAD  SANOQ\n        JZ    TAMOM\n        SUB   BIR\n        STORE SANOQ\n        LOAD  NATIJA\n        ADD   SON\n        STORE NATIJA\n        JMP   SIKL\nTAMOM:  HALT\nSON:    DAT   4\nSANOQ:  DAT   3\nBIR:    DAT   1\nNATIJA: DAT   0',
      bug: '        LOAD  A\n        ADD   C\n        STORE NATIJA\n        HLT\nA:      DAT   5\nNATIJA: DAT   0'
    };
    function preset(k, en){ return EX[k][en ? 1 : 0] + '\n' + BODY[k]; }
    var last = null, after = null;
    function render(){
      var r = last;
      if (!r) return;
      var html = '';
      if (r.errors.length) html += r.errors.map(function(e){ return '<p class="asm-err">' + esc(errText(e)) + '</p>'; }).join('');
      if (!r.items.length) html += '<p class="asm-empty">' + esc(L("Dastur bo'sh.", 'The program is empty.')) + '</p>';
      r.items.slice(0, 16).forEach(function(it, addr){
        var isData = it.op === 'DAT';
        var val = after ? after.mem[addr] : r.mem[addr];
        var changed = after && isData && after.mem[addr] !== r.mem[addr];
        var s = (it.label ? '<em>' + esc(it.label) + ':</em> ' : '') + esc(it.op) + (it.arg ? ' ' + esc(it.arg) : '');
        if (it.ref) s += ' <em>→ ' + r.labels[it.ref] + '</em>';
        if (changed) s += ' <em>→ ' + val + '</em>';
        html += '<div class="asm-row' + (isData ? ' data' : '') + (changed ? ' changed hot' : '') + '"><span class="ad">' + addr + '</span><span class="src">' + s + '</span><span class="bin">' + (r.bad[addr] ? '???? ????' : bin8(val)) + '</span></div>';
      });
      var labs = Object.keys(r.labels);
      if (labs.length) html += '<div class="asm-labels">' + labs.map(function(k){ return '<span><b>' + esc(k) + '</b> = ' + r.labels[k] + '</span>'; }).join('') + '</div>';
      out.innerHTML = html;
      if (after) {
        var a = after, msg;
        if (a.why === 'halt') msg = L('Mashina ' + a.steps + ' ta buyruqni bajarib, HALT da to\'xtadi.', 'The machine ran ' + a.steps + ' instructions and stopped at HALT.');
        else if (a.why === 'limit') msg = L("500 qadamdan keyin mashinani to'xtatdik — bu cheksiz sikl bo'lishi mumkin. JZ qatorini tekshiring.", 'We stopped the machine after 500 steps — this may be an infinite loop. Check the JZ line.');
        else if (a.why === 'unknown') msg = L("Mashina buyruq o'rniga ma'lumotga duch keldi va to'xtadi. HALT ni unutmadingizmi?", 'The machine ran into data instead of an instruction and stopped. Did you forget HALT?');
        else msg = L("Mashina xotiraning oxiriga yetib to'xtadi. HALT ni unutmadingizmi?", 'The machine reached the end of memory. Did you forget HALT?');
        var res = labs.filter(function(k){ var it = r.items[r.labels[k]]; return it && it.op === 'DAT'; }).map(function(k){ return '<code>' + esc(k) + ' = ' + a.mem[r.labels[k]] + '</code>'; });
        log.innerHTML = esc(msg) + (res.length ? ' ' + esc(L("Ma'lumot kataklari:", 'Data cells:')) + ' ' + res.join(', ') : '');
      } else if (r.errors.length) {
        log.textContent = L("Assembler xato topdi — mashina kodi tayyor emas. Qizil qatorlarni tuzating.", 'The assembler found errors — the machine code is not ready. Fix the red lines.');
      } else {
        log.textContent = L(r.items.length + ' qator ' + r.items.length + " ta mashina so'ziga aylandi: bir qator — bir so'z. Endi \"Ishga tushirish\" ni bosing.", r.items.length + ' lines became ' + r.items.length + ' machine words: one line — one word. Now press "Run".');
      }
    }
    function build(){ last = assemble(src.value); after = null; render(); }
    function go(){ build(); if (last.errors.length) return; after = run(last.mem); render(); }
    $('asm-build').addEventListener('click', build);
    $('asm-run').addEventListener('click', go);
    src.addEventListener('input', function(){ if (last) { last = assemble(src.value); after = null; render(); } });
    document.querySelectorAll('[data-asm-ex]').forEach(function(b){
      b.addEventListener('click', function(){ src.value = preset(b.getAttribute('data-asm-ex'), isEN()); build(); });
    });
    src.value = preset('add', false);
    build();
    redraw.push(function(){
      Object.keys(BODY).forEach(function(k){ if (src.value === preset(k, !isEN())) src.value = preset(k, isEN()); });
      if (last) render(); else log.textContent = L('"Yig\'ish" ni bosing.', 'Press "Assemble".');
    });
  })();

  // ================= 3-bob: Kompilyator laboratoriyasi =================
  (function(){
    var srcEl = $('kmp-src');
    if (!srcEl) return;
    var valsEl = $('kmp-vals'), tokEl = $('kmp-tokens'), treeEl = $('kmp-tree'), asmEl = $('kmp-asm'), binEl = $('kmp-bin'), logEl = $('kmp-log');
    var VALS = { A: 5, B: 7, C: 2, SON: 20, CHEGIRMA: 3 };
    function tokenize(s){
      var out = [], re = /\s*([A-Za-z_][A-Za-z0-9_]*|\d+|[=+\-()]|\S)/g, m;
      while ((m = re.exec(s)) && m[1]) {
        var t = m[1];
        out.push({ v: t.toUpperCase(), t: /^\d+$/.test(t) ? 'num' : /^[A-Za-z_]/.test(t) ? 'id' : /^[=+\-()]$/.test(t) ? 'op' : 'bad' });
      }
      return out;
    }
    function parse(toks){
      var i = 0;
      function peek(){ return toks[i]; }
      function fail(k, a){ throw { k: k, a: a }; }
      function term(){
        var t = toks[i++];
        if (!t) fail('end');
        if (t.t === 'id') return { t: 'id', v: t.v };
        if (t.t === 'num') { if (+t.v > 255) fail('big', t.v); return { t: 'num', v: +t.v }; }
        if (t.v === '(') { var e = expr(); var c = toks[i++]; if (!c || c.v !== ')') fail('close'); return e; }
        if (t.t === 'bad') fail('bad', t.v);
        fail('term', t.v);
      }
      function expr(){
        var l = term();
        while (peek() && (peek().v === '+' || peek().v === '-')) { var op = toks[i++].v; l = { t: 'bin', op: op, l: l, r: term() }; }
        return l;
      }
      var first = toks[i++];
      if (!first || first.t !== 'id') fail('target');
      if (!toks[i] || toks[i].v !== '=') fail('eq');
      i++;
      var e = expr();
      if (i < toks.length) fail(toks[i].t === 'bad' ? 'bad' : 'extra', toks[i].v);
      return { target: first.v, expr: e };
    }
    function errMsg(e){
      switch (e.k) {
        case 'bad': return L('Kompilyatorimiz "' + e.a + "\" belgisini bilmaydi. Mashinamizda faqat qo'shish va ayirish bor, shuning uchun til ham faqat + va − ni taniydi.", 'Our compiler doesn\'t know the "' + e.a + '" symbol. Our machine can only add and subtract, so the language only knows + and −.');
        case 'target': return L("Formula nom bilan boshlanishi kerak: NATIJA = ...", 'The formula must start with a name: RESULT = ...');
        case 'eq': return L("Nomdan keyin \"=\" belgisi kutilgan edi.", 'An "=" sign was expected after the name.');
        case 'close': return L("Qavs yopilmagan: \")\" kutilgan edi.", 'A bracket was not closed: ")" was expected.');
        case 'end': return L("Formula chala qoldi: oxirida nom yoki son kutilgan edi.", 'The formula is unfinished: a name or number was expected at the end.');
        case 'term': return L('Nom, son yoki "(" kutilgan edi, lekin "' + e.a + '" keldi.', 'A name, number or "(" was expected, but got "' + e.a + '".');
        case 'extra': return L('Ortiqcha belgi: "' + e.a + '".', 'Unexpected symbol: "' + e.a + '".');
        case 'big': return L(e.a + " — juda katta son. 8 bitli mashinamiz 0–255 oralig'idagi sonlarni saqlaydi.", e.a + ' is too big. Our 8-bit machine stores numbers from 0 to 255.');
        case 'full': return L("Dastur 16 katakli mashinamizga sig'madi. Formulani qisqartiring.", "The program doesn't fit in our 16-cell machine. Make the formula shorter.");
      }
      return '';
    }
    function treeHTML(n){
      if (n.t === 'bin') return '<li><span class="op">' + (n.op === '-' ? '−' : '+') + '</span><ul>' + treeHTML(n.l) + treeHTML(n.r) + '</ul></li>';
      return '<li><span>' + esc(n.v) + '</span></li>';
    }
    function evalTree(n, vals){ if (n.t === 'num') return n.v; if (n.t === 'id') return vals[n.v] || 0; var a = evalTree(n.l, vals), b = evalTree(n.r, vals); return n.op === '+' ? a + b : a - b; }
    function pad(s, n){ while (s.length < n) s += ' '; return s; }
    var state = null;
    function compile(){
      var toks = tokenize(srcEl.value);
      state = { toks: toks };
      try { state.ast = parse(toks); } catch (e) { state.err = e; return; }
      var ast = state.ast, vars = [], consts = [], temps = 0, code = [];
      function use(n){ if (n.t === 'id' && vars.indexOf(n.v) < 0) vars.push(n.v); if (n.t === 'num' && consts.indexOf(n.v) < 0) consts.push(n.v); if (n.t === 'bin') { use(n.l); use(n.r); } }
      use(ast.expr);
      function opnd(n){ return n.t === 'id' ? n.v : 'K' + n.v; }
      function gen(n){
        if (n.t !== 'bin') { code.push(['LOAD', opnd(n)]); return; }
        var mn = n.op === '+' ? 'ADD' : 'SUB';
        if (n.r.t !== 'bin') { gen(n.l); code.push([mn, opnd(n.r)]); }
        else { gen(n.r); var t = 'T' + (++temps); code.push(['STORE', t]); gen(n.l); code.push([mn, t]); }
      }
      gen(ast.expr);
      code.push(['STORE', ast.target]); code.push(['HALT']);
      state.vars = vars;
      var lines = code.map(function(c){ return '        ' + pad(c[0], 6) + (c[1] || ''); });
      var data = [];
      vars.forEach(function(v){ data.push([v, VALS.hasOwnProperty(v) ? VALS[v] : (VALS[v] = 1)]); });
      if (vars.indexOf(ast.target) < 0) data.push([ast.target, 0]);
      consts.forEach(function(k){ data.push(['K' + k, k]); });
      for (var i = 1; i <= temps; i++) data.push(['T' + i, 0]);
      data.forEach(function(d){ lines.push(pad(d[0] + ':', 8) + pad('DAT', 6) + d[1]); });
      state.asm = lines.join('\n');
      state.nCode = code.length;
      var r = assemble(state.asm);
      if (r.errors.length) { state.err = { k: 'full' }; return; }
      state.asmRes = r;
      state.run = run(r.mem);
      state.result = state.run.mem[r.labels[ast.target]];
      var vals = {}; data.forEach(function(d){ vals[d[0]] = d[1]; });
      state.real = evalTree(ast.expr, vals);
    }
    function render(){
      if (!state) return;
      tokEl.innerHTML = state.toks.length ? state.toks.map(function(t){
        var kind = t.t === 'id' ? L('nom', 'name') : t.t === 'num' ? L('son', 'number') : t.t === 'op' ? L('belgi', 'symbol') : '?';
        return '<span class="' + (t.t === 'op' ? 'op' : t.t === 'num' ? 'num' : '') + '">' + esc(t.v === '-' ? '−' : t.v) + '<small>' + esc(kind) + '</small></span>';
      }).join('') : '<span>—</span>';
      if (state.err) {
        treeEl.innerHTML = '<p class="kmp-err">' + esc(L('Sintaksis xatosi', 'Syntax error')) + '</p>';
        asmEl.textContent = '—'; binEl.textContent = '—';
        logEl.innerHTML = '<span class="kmp-err">' + esc(errMsg(state.err)) + '</span>';
        valsEl.innerHTML = '';
        return;
      }
      treeEl.innerHTML = '<ul><li><span class="op">=</span><ul><li><span>' + esc(state.ast.target) + '</span></li>' + treeHTML(state.ast.expr) + '</ul></li></ul>';
      asmEl.textContent = state.asm;
      binEl.textContent = state.asmRes.items.map(function(it, a){ return pad(String(a), 3) + bin8(state.asmRes.mem[a]); }).join('\n');
      var t = state.ast.target, msg = L('1 qator formula → ' + state.nCode + " ta mashina buyrug'i. Mashina ishladi: ", '1 line of formula → ' + state.nCode + ' machine instructions. The machine ran: ');
      var extra = '';
      if (state.real !== state.result) extra = L(' (Haqiqiy javob ' + state.real + ", lekin 8 bitli mashinamizda son 0–255 oralig'ida aylanib ketadi.)", ' (The true answer is ' + state.real + ', but in our 8-bit machine numbers wrap around within 0–255.)');
      logEl.innerHTML = esc(msg) + '<code>' + esc(t) + ' = ' + state.result + '</code>' + esc(extra);
      var have = Array.prototype.map.call(valsEl.querySelectorAll('input'), function(i){ return i.getAttribute('data-v'); }).join(',');
      if (have !== state.vars.join(',')) {
        valsEl.innerHTML = state.vars.length ? '<span>' + esc(L('Qiymatlar:', 'Values:')) + '</span>' + state.vars.map(function(v){
          return '<label>' + esc(v) + ' <input type="number" min="0" max="255" data-v="' + esc(v) + '" value="' + VALS[v] + '"></label>';
        }).join('') : '';
      } else {
        var lab = valsEl.querySelector('span'); if (lab) lab.textContent = L('Qiymatlar:', 'Values:');
      }
    }
    function update(){ compile(); render(); }
    srcEl.addEventListener('input', update);
    valsEl.addEventListener('input', function(e){
      var v = e.target.getAttribute && e.target.getAttribute('data-v');
      if (!v) return;
      var n = Math.max(0, Math.min(255, parseInt(e.target.value, 10) || 0));
      VALS[v] = n; compile(); render();
    });
    document.querySelectorAll('[data-kmp-ex]').forEach(function(b){
      b.addEventListener('click', function(){ srcEl.value = b.getAttribute('data-kmp-ex'); update(); });
    });
    valsEl.setAttribute('data-no-i18n', '');
    update();
    redraw.push(render);
  })();

  // ================= 4-bob: Paket laboratoriyasi =================
  (function(){
    var svg = $('pkt-net'), layer = $('pkt-layer');
    if (!svg) return;
    var msgEl = $('pkt-msg'), sendBtn = $('pkt-send'), brk = $('pkt-break'), lose = $('pkt-lose');
    var sentEl = $('pkt-sent'), arrEl = $('pkt-arr'), logEl = $('pkt-log');
    var POS = { S: [78, 150], R1: [215, 65], R2: [215, 235], R3: [420, 65], R4: [420, 235], D: [562, 150] };
    var ADJ = {};
    svg.querySelectorAll('.pkt-links line').forEach(function(l){
      var p = l.getAttribute('data-l').split('-');
      (ADJ[p[0]] = ADJ[p[0]] || []).push(p[1]); (ADJ[p[1]] = ADJ[p[1]] || []).push(p[0]);
    });
    var PATHS = [];
    (function dfs(node, path){
      if (node === 'D') { PATHS.push(path.slice()); return; }
      (ADJ[node] || []).forEach(function(nx){ if (path.indexOf(nx) < 0 && path.length < 5) { path.push(nx); dfs(nx, path); path.pop(); } });
    })('S', ['S']);
    function down(){ return brk.checked; }
    function syncDown(){
      var d = down();
      svg.querySelector('[data-n="R3"]').classList.toggle('down', d);
      svg.querySelectorAll('.pkt-links line').forEach(function(l){ l.classList.toggle('down', d && /(^|-)R3(-|$)/.test(l.getAttribute('data-l'))); });
    }
    brk.addEventListener('change', syncDown);
    function pickPath(){
      var ok = PATHS.filter(function(p){ return !down() || p.indexOf('R3') < 0; });
      var w = ok.map(function(p){ return 1 / (p.length * p.length); }), sum = w.reduce(function(a, b){ return a + b; }, 0), r = Math.random() * sum;
      for (var i = 0; i < ok.length; i++) { r -= w[i]; if (r <= 0) return ok[i]; }
      return ok[ok.length - 1];
    }
    var NS = 'http://www.w3.org/2000/svg';
    function pktEl(n, cls){
      var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'pkt' + (cls ? ' ' + cls : ''));
      var r = document.createElementNS(NS, 'rect'); r.setAttribute('x', -19); r.setAttribute('y', -12); r.setAttribute('width', 38); r.setAttribute('height', 24); r.setAttribute('rx', 6);
      var t = document.createElementNS(NS, 'text'); t.setAttribute('y', 4.5); t.textContent = '#' + n;
      g.appendChild(r); g.appendChild(t); layer.appendChild(g);
      return g;
    }
    function busy(node, on){ var el = svg.querySelector('[data-n="' + node + '"]'); if (el) el.classList.toggle('busy', on); }
    var K = reduce ? 0.3 : 1;
    function travel(g, path, loseAt, done){
      var seg = 0, t0 = null, from, to, dur;
      function setSeg(){ from = POS[path[seg]]; to = POS[path[seg + 1]]; var len = Math.hypot(to[0] - from[0], to[1] - from[1]); dur = len / (0.16 + Math.random() * 0.16) * K; t0 = null; }
      function frame(ts){
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur);
        var x = from[0] + (to[0] - from[0]) * k, y = from[1] + (to[1] - from[1]) * k;
        g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')');
        if (loseAt === seg && k > 0.5) { g.classList.add('lost'); g.style.transition = 'opacity 0.6s'; g.style.opacity = '0'; setTimeout(function(){ g.remove(); done(false); }, 600); return; }
        if (k < 1) { requestAnimationFrame(frame); return; }
        seg++;
        if (seg >= path.length - 1) { g.remove(); done(true); return; }
        var node = path[seg]; busy(node, true);
        setTimeout(function(){ busy(node, false); setSeg(); requestAnimationFrame(frame); }, (60 + Math.random() * 420) * K);
      }
      setSeg(); requestAnimationFrame(frame);
    }
    var S = null;
    function viaText(p){ return p.slice(1, -1).join(' · '); }
    function render(){
      if (!S) return;
      sentEl.innerHTML = S.packets.map(function(p){
        return '<div class="pkt-item"><b>№' + p.n + '/' + S.packets.length + '</b><span class="hd">203.0.113.5 → 198.51.100.7</span><span class="dt">' + esc(p.data) + '</span></div>';
      }).join('');
      arrEl.innerHTML = S.events.map(function(e){
        var p = S.packets[e.n - 1];
        if (e.lost) return '<div class="pkt-item lost"><b>№' + e.n + '</b><span class="hd">' + esc(L("yo'lda yo'qoldi", 'lost on the way')) + ' (' + esc(viaText(e.path)) + ')</span><span class="dt">' + esc(p.data) + '</span></div>';
        return '<div class="pkt-item' + (e.re ? ' re' : '') + '"><b>№' + e.n + '</b><span class="hd">' + esc((e.re ? L('qayta: ', 'resent: ') : L('orqali: ', 'via: ')) + viaText(e.path)) + '</span><span class="dt">' + esc(p.data) + '</span></div>';
      }).join('') || '<div class="pkt-item"><span></span><span class="hd">' + esc(L('kutilmoqda...', 'waiting...')) + '</span><span></span></div>';
      var html = '';
      if (S.phase === 'go') html = esc(L('Paketlar yo\'lda. Har biri yo\'lini o\'zi tanlayapti...', 'Packets are on their way. Each one chooses its own route...'));
      else if (S.phase === 'resend') html = esc(L('Server: №' + S.lostN + ' paket kelmadi! TCP uni qayta yuborishni so\'radi...', 'Server: packet №' + S.lostN + ' did not arrive! TCP asked for it to be sent again...'));
      else if (S.phase === 'done') {
        var order = S.events.filter(function(e){ return !e.lost; }).map(function(e){ return e.n; });
        html = esc(L('Hammasi yetib keldi. Kelish tartibi: ' + order.join(', ') + '. TCP raqamlarga qarab tartibladi va xabarni yig\'di:', 'Everything arrived. Arrival order: ' + order.join(', ') + '. TCP sorted them by number and rebuilt the message:')) +
          '<span class="pkt-final">' + S.packets.map(function(p){ return '<span>' + esc(p.data) + '</span>'; }).join('') + '</span>';
      }
      logEl.innerHTML = html;
    }
    function finishIfReady(){
      if (S.pending > 0) return;
      if (S.lostN && !S.resent) {
        S.phase = 'resend'; S.resent = true; render();
        setTimeout(function(){
          S.pending = 1;
          var path = pickPath(), g = pktEl(S.lostN, 're');
          travel(g, path, -1, function(){ S.events.push({ n: S.lostN, path: path, re: true }); S.pending--; finishIfReady(); });
        }, 700 * K);
        return;
      }
      S.phase = 'done'; sendBtn.disabled = false; render();
    }
    function send(){
      var text = (msgEl.value || '').toUpperCase().slice(0, 24);
      if (!text.trim()) text = 'SALOM';
      msgEl.value = text;
      layer.textContent = '';
      var packets = [];
      for (var i = 0; i < text.length; i += 4) packets.push({ n: packets.length + 1, data: text.slice(i, i + 4) });
      var lostN = lose.checked ? 1 + Math.floor(Math.random() * packets.length) : 0;
      S = { packets: packets, events: [], pending: packets.length, lostN: lostN, resent: false, phase: 'go' };
      sendBtn.disabled = true;
      render();
      packets.forEach(function(p, idx){
        setTimeout(function(){
          var path = pickPath(), g = pktEl(p.n, '');
          travel(g, path, p.n === lostN ? 1 : -1, function(ok){
            S.events.push({ n: p.n, path: path, lost: !ok });
            S.pending--; render(); finishIfReady();
          });
        }, idx * 380 * K);
      });
    }
    sendBtn.addEventListener('click', send);
    msgEl.addEventListener('keydown', function(e){ if (e.key === 'Enter' && !sendBtn.disabled) send(); });
    [sentEl, arrEl, logEl].forEach(function(el){ el.setAttribute('data-no-i18n', ''); });
    syncDown();
    redraw.push(function(){ if (S) render(); else logEl.textContent = L('Xabarni yozing va "Yuborish" ni bosing.', 'Type a message and press "Send".'); });
  })();
})();
