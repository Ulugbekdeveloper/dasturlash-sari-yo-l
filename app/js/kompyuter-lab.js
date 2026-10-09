(function(){
  var $ = function(id){ return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function pad(n, w){ var s = n.toString(2); while (s.length < w) s = '0' + s; return s; }
  function nib(n){ var s = pad(n, 8); return s.slice(0, 4) + ' ' + s.slice(4); }

  // ---------- Emoji rasmlar ----------
  document.querySelectorAll('img[data-im]').forEach(function(im){
    var k = im.getAttribute('data-im');
    im.src = (window.IMGS_ALL && window.IMGS_ALL[k]) || ('media/emoji/' + k + '.png');
    im.setAttribute('draggable', 'false');
  });

  // ---------- Kalitlar va darvozalar ----------
  var gl = $('gate-lab');
  if (gl) {
    var A = 0, B = 0;
    var GATES = [
      { id: 'AND', uz: 'VA', f: function(a, b){ return a & b; }, desc: "Ikkala kirish ham 1 bo'lsagina 1 chiqadi.",
        body: '<path class="body" d="M60 15 H95 A30 30 0 0 1 95 75 H60 Z"/>', inEnd: 60, out: 125 },
      { id: 'OR', uz: 'YOKI', f: function(a, b){ return a | b; }, desc: "Kamida bittasi 1 bo'lsa, 1 chiqadi.",
        body: '<path class="body" d="M55 15 Q75 45 55 75 Q105 75 130 45 Q105 15 55 15 Z"/>', inEnd: 64, out: 130 },
      { id: 'NOT', uz: 'EMAS', one: true, f: function(a){ return a ? 0 : 1; }, desc: 'Kirishni teskarisiga aylantiradi. Faqat A ga ulangan.',
        body: '<path class="body" d="M60 20 L60 70 L112 45 Z"/><circle class="body" cx="118" cy="45" r="6"/>', inEnd: 60, out: 124 },
      { id: 'XOR', uz: 'FAQAT BIRI', f: function(a, b){ return a ^ b; }, desc: "Kirishlar har xil bo'lsa 1. Qo'shishning kaliti.",
        body: '<path class="body" d="M53 15 Q73 45 53 75" style="fill:none"/><path class="body" d="M63 15 Q83 45 63 75 Q113 75 138 45 Q113 15 63 15 Z"/>', inEnd: 70, out: 138 }
    ];
    var gatesEl = $('gates');
    gatesEl.innerHTML = GATES.map(function(g){
      var ins = g.one
        ? '<line class="w" data-in="a" x1="10" y1="45" x2="' + g.inEnd + '" y2="45"/><text x="10" y="37">A</text>'
        : '<line class="w" data-in="a" x1="10" y1="30" x2="' + g.inEnd + '" y2="30"/><line class="w" data-in="b" x1="10" y1="60" x2="' + g.inEnd + '" y2="60"/><text x="10" y="22">A</text><text x="10" y="80">B</text>';
      var rows = g.one ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
      var table = '<table class="tt"><thead><tr><th>A</th>' + (g.one ? '' : '<th>B</th>') + '<th>' + g.id + '</th></tr></thead><tbody>' +
        rows.map(function(r){ return '<tr data-r="' + r.join('') + '"><td>' + r.join('</td><td>') + '</td><td class="out">' + g.f(r[0], r[1]) + '</td></tr>'; }).join('') + '</tbody></table>';
      return '<div class="gate" data-g="' + g.id + '"><div class="gate-top"><b>' + g.id + '</b><span>' + g.uz + '</span></div>' +
        '<svg viewBox="0 0 200 90" aria-hidden="true">' + ins + g.body +
        '<line class="w" data-out="1" x1="' + g.out + '" y1="45" x2="176" y2="45"/><circle class="lamp" cx="186" cy="45" r="10"/></svg>' +
        '<p class="gate-desc">' + g.desc + '</p>' + table + '</div>';
    }).join('');
    var adder = $('adder');
    function upd(){
      $('g-a').textContent = 'A = ' + A; $('g-a').setAttribute('aria-pressed', A ? 'true' : 'false');
      $('g-b').textContent = 'B = ' + B; $('g-b').setAttribute('aria-pressed', B ? 'true' : 'false');
      gl.querySelectorAll('.knife').forEach(function(k){ k.classList.toggle('on', (k.getAttribute('data-sw') === 'a' ? A : B) === 1); });
      $('bulb-and').classList.toggle('on', !!(A & B));
      $('bulb-or').classList.toggle('on', !!(A | B));
      GATES.forEach(function(g){
        var el = gatesEl.querySelector('[data-g="' + g.id + '"]'), v = g.f(A, B);
        el.querySelectorAll('[data-in="a"]').forEach(function(w){ w.classList.toggle('on', A === 1); });
        el.querySelectorAll('[data-in="b"]').forEach(function(w){ w.classList.toggle('on', B === 1); });
        el.querySelector('[data-out]').classList.toggle('on', v === 1);
        el.querySelector('.lamp').classList.toggle('on', v === 1);
        var key = g.one ? String(A) : '' + A + B;
        el.querySelectorAll('tbody tr').forEach(function(tr){ tr.classList.toggle('cur', tr.getAttribute('data-r') === key); });
      });
      var s = A ^ B, c = A & B;
      adder.innerHTML = '<span class="ab">' + A + ' + ' + B + '</span><span>=</span><span class="res">' + c + s + '</span>' +
        '<small>Ko\'chirish (AND) = ' + c + ', yig\'indi (XOR) = ' + s + '. Ikkilikdagi ' + c + s + ' — o\'nlikda ' + (A + B) + '.</small>';
    }
    $('g-a').addEventListener('click', function(){ A = A ? 0 : 1; upd(); });
    $('g-b').addEventListener('click', function(){ B = B ? 0 : 1; upd(); });
    upd();
  }

  // ---------- Ikkilik kalitlar ----------
  var bitsEl = $('bits');
  if (bitsEl) {
    var val = 65;
    var PLACES = [128, 64, 32, 16, 8, 4, 2, 1];
    bitsEl.innerHTML = PLACES.map(function(p, i){ return '<button type="button" class="bit" data-i="' + i + '" aria-pressed="false" aria-label="' + p + ' xonasi"><b>0</b><small>' + p + '</small></button>'; }).join('');
    var btns = bitsEl.querySelectorAll('.bit'), binIn = $('bin-in'), sumEl = $('bin-sum');
    function chr(v){
      if (v === 32) return '␣';
      if (v > 32 && v < 127) return String.fromCharCode(v);
      if (v < 32 || v === 127) return 'boshqaruv';
      return '—';
    }
    function draw(msg){
      PLACES.forEach(function(p, i){
        var on = (val & p) !== 0;
        btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        btns[i].querySelector('b').textContent = on ? '1' : '0';
      });
      $('bin-bin').textContent = pad(val, 8);
      $('bin-dec').textContent = val;
      $('bin-chr').textContent = chr(val);
      if (msg) { sumEl.textContent = msg; return; }
      var parts = PLACES.filter(function(p){ return val & p; });
      sumEl.textContent = (parts.length ? parts.join(' + ') : '0') + ' = ' + val +
        (val > 127 ? "  ·  128 dan katta: bu 7 bitli ASCII'ga sig'maydi" : '');
    }
    btns.forEach(function(b){
      b.addEventListener('click', function(){ val ^= PLACES[+b.getAttribute('data-i')]; binIn.value = ''; draw(); });
    });
    binIn.addEventListener('input', function(){
      var ch = binIn.value;
      if (!ch) { draw(); return; }
      var code = ch.codePointAt(0);
      if (code <= 255) { val = code; draw(); }
      else draw('"' + ch + '" belgisining kodi ' + code + ' — u 1 baytga (0–255) sig\'maydi. Bunday belgilar uchun UTF-8 bir nechta bayt ishlatadi.');
    });
    draw();
  }

  // ---------- Me'morchilik sxemasi ----------
  var arch = $('arch');
  if (arch) {
    var INFO = {
      cpu: ['CPU — markaziy protsessor', "Mashinaning \"miyasi\". Uchta qismi bor: CU (boshqaruv qurilmasi) buyruqni o'qib, kim nima qilishini aytadi; ALU hisoblaydi va taqqoslaydi; registrlar — hozir kerak bo'lgan sonlar turadigan juda tez, juda kichik kataklar."],
      ram: ['RAM — tezkor xotira', "Raqamlangan kataklar qatori, har birining manzili bor. Mening sxemamning asosiy belgisi: dastur buyruqlari ham, ma'lumotlar ham shu yerda birga saqlanadi. Tok o'chsa, RAM'dagi hamma narsa o'chadi — shuning uchun fayllar diskda saqlanadi."],
      'in': ['Kiritish qurilmalari (Input)', "Tashqi dunyodan ma'lumot olib keladi: klaviatura, sichqoncha, mikrofon, kamera, tarmoq kartasi. 1945-yilda bu teshikli lenta va kartalar edi."],
      out: ['Chiqarish qurilmalari (Output)', "Natijani odamga qaytaradi: ekran, karnay, printer. Siz hozir o'qiyotgan matn ham — protsessor hisoblab, RAM orqali ekranga yuborgan sonlar."],
      bus: ['Tizim shinasi (System Bus)', "Qismlarni bog'laydigan simlar to'plami. Manzil shinasi (sariq) — qaysi katak kerakligini aytadi. Ma'lumot shinasi (yashil) — sonning o'zini tashiydi. Boshqaruv shinasi (kulrang) — \"o'qi\" yoki \"yoz\" buyrug'ini beradi. Hamma narsa shu bitta yo'ldan o'tadi — \"to'siq\" ham aynan shu yerda."]
    };
    var info = $('arch-info'), parts = arch.querySelectorAll('.arch-part');
    function pick(p){
      parts.forEach(function(x){ x.classList.toggle('sel', x === p); });
      var d = INFO[p.getAttribute('data-part')];
      info.innerHTML = '<p class="kb-info-title">' + esc(d[0]) + '</p><p>' + esc(d[1]) + '</p>';
    }
    parts.forEach(function(p){
      p.addEventListener('click', function(){ pick(p); });
      p.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p); } });
    });
  }

  // ---------- Protsessor simulyatori ----------
  var sim = $('cpu-sim');
  if (sim) {
    var OPS = { 1: 'LOAD', 2: 'ADD', 3: 'SUB', 4: 'STORE', 15: 'HALT' };
    var PH = ['fetch', 'decode', 'execute', 'writeback'];
    var S, runT = null;
    var regsEl = $('cpu-regs'), memEl = $('cpu-mem'), logEl = $('cpu-log'), aluEl = $('cpu-alu');
    var inA = $('cpu-a'), inB = $('cpu-b'), runBtn = $('cpu-run');
    function clamp(v){ v = Math.round(+v || 0); return Math.max(0, Math.min(120, v)); }
    function reset(){
      stopRun();
      var mem = []; for (var i = 0; i < 16; i++) mem.push(0);
      mem[0] = 0x1D; mem[1] = 0x2E; mem[2] = 0x4F; mem[3] = 0xF0;
      mem[13] = clamp(inA.value); mem[14] = clamp(inB.value);
      inA.value = mem[13]; inB.value = mem[14];
      S = { mem: mem, pc: 0, ir: 0, acc: 0, mar: 0, mdr: 0, ph: -1, halted: false, op: 0, arg: 0, res: 0, hot: {}, hotMem: -1, alu: '' };
      logEl.innerHTML = 'Boshlash uchun "Keyingi qadam" ni bosing. PC = 0: mashina birinchi buyruqni 0-katakdan oladi.';
      render();
    }
    function meaning(i, v){
      if (i <= 3) { var o = v >> 4, a = v & 15; return OPS[o] ? (OPS[o] + (o === 15 ? '' : ' ' + a)) : '—'; }
      if (i === 13 || i === 14) return "ma'lumot: " + v;
      if (i === 15) return 'natija: ' + v;
      return '';
    }
    function render(){
      var R = [['PC', pad(S.pc, 4), S.pc, 'keyingi manzil'], ['IR', nib(S.ir), S.ir, 'joriy buyruq'], ['ACC', nib(S.acc), S.acc, 'natija'], ['MAR', pad(S.mar, 4), S.mar, 'manzil'], ['MDR', nib(S.mdr), S.mdr, "ma'lumot"]];
      regsEl.innerHTML = R.map(function(r){ return '<div class="reg' + (S.hot[r[0]] ? ' hot' : '') + '"><b>' + r[0] + '</b><code>' + r[1] + '</code><span>= ' + r[2] + ' · ' + r[3] + '</span></div>'; }).join('');
      var html = '';
      for (var i = 0; i < 16; i++) {
        var v = S.mem[i], used = i <= 3 || i >= 13;
        html += '<div class="mrow' + (used ? '' : ' empty') + (i === S.pc && !S.halted ? ' pc' : '') + (i === S.hotMem ? ' hot' : '') + '"><span class="ad">' + i + '</span><span>' + nib(v) + '</span><span class="mn">' + (i === S.pc && !S.halted ? '◀ PC  ' : '') + esc(meaning(i, v)) + '</span></div>';
      }
      memEl.innerHTML = html;
      aluEl.classList.toggle('hot', !!S.alu);
      aluEl.innerHTML = '<b>ALU</b><span>' + (S.alu || 'kutmoqda') + '</span>';
      sim.querySelectorAll('#cpu-phases span').forEach(function(sp, i){ sp.classList.toggle('on', i === S.ph); });
    }
    function step(){
      if (S.halted) { logEl.innerHTML = 'Dastur tugagan. Natija 15-katakda. Sonlarni o\'zgartirib, "Boshidan" ni bosing.'; stopRun(); return; }
      S.ph = (S.ph + 1) % 4; S.hot = {}; S.hotMem = -1; S.alu = '';
      var ph = PH[S.ph], name;
      if (ph === 'fetch') {
        S.mar = S.pc; S.mdr = S.mem[S.mar]; S.ir = S.mdr; var was = S.pc; S.pc = (S.pc + 1) & 15;
        S.hot = { PC: 1, MAR: 1, MDR: 1, IR: 1 }; S.hotMem = S.mar;
        logEl.innerHTML = '<strong>Fetch.</strong> <code>MAR ← PC</code> (' + was + '). Xotiraning ' + was + '-katagidagi <code>' + nib(S.mdr) + '</code> MDR orqali <code>IR</code> ga tushdi. <code>PC ← PC + 1</code>: endi PC = ' + S.pc + '.';
      } else if (ph === 'decode') {
        S.op = S.ir >> 4; S.arg = S.ir & 15; name = OPS[S.op] || "noma'lum";
        S.hot = { IR: 1 };
        logEl.innerHTML = '<strong>Decode.</strong> CU <code>' + nib(S.ir) + '</code> ni ikkiga bo\'ldi: opkod <code>' + pad(S.op, 4) + '</code> = <strong>' + name + '</strong>' +
          (S.op === 15 ? '. Ma\'nosi: to\'xtash.' : ', operand <code>' + pad(S.arg, 4) + '</code> = ' + S.arg + '-katak.');
      } else if (ph === 'execute') {
        if (S.op === 1 || S.op === 2 || S.op === 3) {
          S.mar = S.arg; S.mdr = S.mem[S.arg]; S.hot = { MAR: 1, MDR: 1 }; S.hotMem = S.arg;
          if (S.op === 1) logEl.innerHTML = '<strong>Execute.</strong> <code>MAR ← ' + S.arg + '</code>, <code>MDR ← RAM[' + S.arg + ']</code> = ' + S.mdr + '. Son akkumulyatorga yozilishga tayyor.';
          else {
            S.res = S.op === 2 ? (S.acc + S.mdr) & 255 : (S.acc - S.mdr) & 255;
            S.alu = S.acc + (S.op === 2 ? ' + ' : ' − ') + S.mdr + ' = ' + S.res; S.hot.ACC = 1;
            logEl.innerHTML = '<strong>Execute.</strong> <code>MDR ← RAM[' + S.arg + ']</code> = ' + S.mdr + '. <strong>ALU</strong> ishladi: ACC ' + (S.op === 2 ? '+' : '−') + ' MDR = ' + S.alu + '.';
          }
        } else if (S.op === 4) {
          S.mar = S.arg; S.mdr = S.acc; S.hot = { MAR: 1, MDR: 1, ACC: 1 };
          logEl.innerHTML = '<strong>Execute.</strong> <code>MAR ← ' + S.arg + '</code>, <code>MDR ← ACC</code> (' + S.acc + '). Son xotiraga yozilishga tayyor.';
        } else {
          S.halted = true;
          logEl.innerHTML = '<strong>Execute.</strong> ' + (S.op === 15 ? 'HALT — mashina to\'xtadi.' : "Noma'lum buyruq — mashina to'xtadi.") + ' 15-katakka qarang: <strong>' + S.mem[13] + ' + ' + S.mem[14] + ' = ' + S.mem[15] + '</strong>. Natija xotirada!';
          stopRun();
        }
      } else {
        if (S.op === 1) { S.acc = S.mdr; S.hot = { ACC: 1 }; logEl.innerHTML = '<strong>Writeback.</strong> <code>ACC ← MDR</code>: akkumulyatorda endi ' + S.acc + '. Sikl boshiga qaytamiz.'; }
        else if (S.op === 2 || S.op === 3) { S.acc = S.res; S.hot = { ACC: 1 }; logEl.innerHTML = '<strong>Writeback.</strong> ALU natijasi <code>ACC</code> ga yozildi: ' + S.acc + '. Sikl boshiga qaytamiz.'; }
        else if (S.op === 4) { S.mem[S.mar] = S.mdr; S.hotMem = S.mar; S.hot = { MDR: 1 }; logEl.innerHTML = '<strong>Writeback.</strong> <code>RAM[' + S.mar + '] ← MDR</code>: ' + S.mdr + ' soni ' + S.mar + '-katakka yozildi.'; }
      }
      render();
    }
    function stopRun(){ if (runT) { clearInterval(runT); runT = null; } if (runBtn) runBtn.textContent = 'Avtomatik'; }
    $('cpu-step').addEventListener('click', function(){ stopRun(); step(); });
    runBtn.addEventListener('click', function(){
      if (runT) { stopRun(); return; }
      if (S.halted) reset();
      runBtn.textContent = "To'xtatish";
      step();
      runT = setInterval(step, reduce ? 1400 : 1100);
    });
    $('cpu-reset').addEventListener('click', reset);
    [inA, inB].forEach(function(el){ el.addEventListener('change', reset); });
    reset();
  }

  // ---------- Kerakli rasmlar ro'yxati ----------
  document.querySelectorAll('.wanted-list').forEach(function(wl){
    var slots = Array.prototype.slice.call(wl.closest('.panel').querySelectorAll('.photo-slot'));
    if (!slots.length) wl.closest('section').hidden = true;
    slots.sort(function(a, b){ return a.getAttribute('data-slot') < b.getAttribute('data-slot') ? -1 : 1; });
    wl.innerHTML = slots.map(function(s){
      var t = s.querySelectorAll('.slot-box span')[1], q = s.querySelector('.slot-box code');
      return '<li><b>' + esc(s.getAttribute('data-slot')) + '</b><span>' + esc(t ? t.textContent : '') + '</span><code>' + esc(q ? q.textContent : '') + '</code></li>';
    }).join('');
  });
})();
