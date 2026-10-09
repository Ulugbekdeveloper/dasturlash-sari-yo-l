(function(){
  var $ = function(id){ return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Font size ----------
  var FS_KEY = 'frontendga-sari-fs-v3';
  function setFs(v){
    document.documentElement.style.setProperty('--fs', (window.innerWidth <= 720 ? v - 2.5 : v) + 'px');
    curFs = v;
    document.querySelectorAll('.fs-ctrl button').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-fs') === String(v) ? 'true' : 'false'); });
  }
  var saved = 21, curFs = 21;
  window.addEventListener('resize', function(){ setFs(curFs); });
  try { saved = +localStorage.getItem(FS_KEY) || 21; } catch(e) {}
  setFs(saved);
  document.querySelectorAll('.fs-ctrl button').forEach(function(b){
    b.addEventListener('click', function(){
      var v = +b.getAttribute('data-fs');
      setFs(v);
      try { localStorage.setItem(FS_KEY, String(v)); } catch(e) {}
    });
  });

  // ---------- Network ----------
  var net = $('net'), netBtn = $('net-btn'), netState = $('net-state');
  if (net) {
    netBtn.addEventListener('click', function(){
      var on = net.classList.toggle('on');
      netState.textContent = on
        ? "Endi: har bir hujjat havola orqali boshqasiga ulangan. Istalgan joydan istalgan ma'lumotga bir bosishda yetib borasiz. Bu — veb (World Wide Web — butun dunyo o'rgimchak to'ri)."
        : "Hozir: har bir kompyuter o'z orolida. Bir-biridan ma'lumot olib bo'lmaydi.";
      netBtn.textContent = on ? 'Qaytadan ajratish' : 'Havolalar bilan ulang';
    });
  }

  // ---------- Page trip ----------
  var track = $('trip-track'), mover = $('mover'), cap = $('trip-cap'), page = $('mini-page'), tripBtn = $('trip-btn');
  var st = { b: $('st-browser'), n: $('st-net'), s: $('st-server') };
  function centerOf(el){ return el.offsetLeft + el.offsetWidth / 2 - 18; }
  function moveTo(key){ mover.style.transform = 'translateX(' + centerOf(st[key]) + 'px)'; }
  function activate(key){ Object.keys(st).forEach(function(k){ st[k].classList.toggle('act', k === key); }); }
  if (track) {
    moveTo('b');
    window.addEventListener('resize', function(){ if (!tripBtn.disabled) moveTo('b'); });
    var STEPS = [
      ['b', 'envelope', "1. Siz brauzerga manzil yozasiz: info.cern.ch — bu URL."],
      ['n', 'envelope', "2. HTTP pochtachi so'rovni internet orqali olib ketdi: \"Menga shu sahifani bering\"."],
      ['s', 'page_with_curl', "3. Server so'rovni oldi va kerakli HTML faylni topdi."],
      ['n', 'page_with_curl', "4. Pochtachi HTML faylni qaytarib olib kelyapti."],
      ['b', 'page_with_curl', "5. Brauzer HTML'ni o'qib, chiroyli sahifa qilib ko'rsatdi. Bularning hammasi bir soniyadan kam vaqt oladi!"]
    ];
    tripBtn.addEventListener('click', function(){
      tripBtn.disabled = true;
      page.classList.remove('show');
      var i = 0;
      (function step(){
        var s = STEPS[i];
        mover.src = (window.IMGS_ALL && window.IMGS_ALL[s[1]]) || ('media/emoji/' + s[1] + '.png');
        moveTo(s[0]);
        activate(s[0]);
        cap.textContent = s[2];
        i++;
        if (i < STEPS.length) setTimeout(step, reduce ? 900 : 1700);
        else { page.classList.add('show'); tripBtn.disabled = false; tripBtn.textContent = 'Yana bir bor'; }
      })();
    });
  }

  // ---------- Typewriter ----------
  var CODE = '<title>The World Wide Web project</title>\n<h1>World Wide Web</h1>\n<p>The WorldWideWeb (W3) is a wide-area\n<a href="WhatIs.html">hypermedia</a>\ninformation retrieval initiative...</p>';
  var pre = $('typer-code'), view = $('typer-view'), typerBtn = $('typer-btn');
  if (pre) {
    pre.textContent = CODE;
    view.classList.add('show');
    typerBtn.addEventListener('click', function(){
      typerBtn.disabled = true;
      view.classList.remove('show');
      var i = 0, cursor = document.createElement('span');
      cursor.className = 'cursor';
      function done(){ pre.textContent = CODE; view.classList.add('show'); typerBtn.disabled = false; }
      if (reduce) { done(); return; }
      (function tick(){
        i += 2;
        pre.textContent = CODE.slice(0, i);
        pre.appendChild(cursor);
        if (i < CODE.length) setTimeout(tick, 28); else done();
      })();
    });
  }

  // ---------- Timeline chips ----------
  document.querySelectorAll('[data-jump]').forEach(function(b){
    b.addEventListener('click', function(){
      var el = $(b.getAttribute('data-jump'));
      if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // ---------- Demos ----------
  var color = $('d-color'), swatch = $('d-swatch'), range = $('d-range'), rangeText = $('d-range-text');
  if (color) color.addEventListener('input', function(){ swatch.style.background = color.value; });
  if (range) range.addEventListener('input', function(){ rangeText.style.fontSize = range.value + 'px'; });

  // ---------- Canvas game ----------
  var cv = $('game');
  if (cv) {
    var ctx = cv.getContext('2d'), scoreEl = $('game-score'), timeEl = $('game-time'), gameBtn = $('game-btn');
    var W = 0, H = 0, ball = { x: 80, y: 80, r: 24, vx: 2.4, vy: 1.8 }, score = 0, running = false, endAt = 0, pop = [];
    function css(name, fb){ var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v || fb; }
    function size(){
      var r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      W = r.width; H = r.height;
      if (!W) return;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ball.x = Math.min(Math.max(ball.x, ball.r), W - ball.r);
      ball.y = Math.min(Math.max(ball.y, ball.r), H - ball.r);
      draw();
    }
    function draw(){
      if (!W) return;
      ctx.clearRect(0, 0, W, H);
      pop = pop.filter(function(p){ return p.a > 0; });
      pop.forEach(function(p){
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = css('--good', '#1F7A4D'); ctx.globalAlpha = p.a; ctx.lineWidth = 3; ctx.stroke();
        ctx.globalAlpha = 1; p.r += 2; p.a -= 0.05;
      });
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = css('--accent-fill', '#F0B429'); ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = css('--accent', '#B4650A'); ctx.stroke();
      if (!running) {
        ctx.fillStyle = css('--text', '#141B2B');
        ctx.font = '600 15px Manrope, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((window.i18nT || String)(score ? ('Natija: ' + score + ' ball') : 'Boshlash tugmasini bosing'), W / 2, H - 18);
      }
    }
    function loop(){
      if (!running) return;
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.x < ball.r || ball.x > W - ball.r) { ball.vx *= -1; ball.x = Math.min(Math.max(ball.x, ball.r), W - ball.r); }
      if (ball.y < ball.r || ball.y > H - ball.r) { ball.vy *= -1; ball.y = Math.min(Math.max(ball.y, ball.r), H - ball.r); }
      var left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      timeEl.textContent = 'Vaqt: ' + left;
      if (left === 0) {
        running = false;
        gameBtn.disabled = false;
        gameBtn.textContent = "Qayta o'ynash";
      }
      draw();
      if (running) requestAnimationFrame(loop);
    }
    cv.addEventListener('pointerdown', function(e){
      if (!running) return;
      var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (Math.hypot(x - ball.x, y - ball.y) <= ball.r + 6) {
        score++;
        scoreEl.textContent = 'Ball: ' + score;
        pop.push({ x: ball.x, y: ball.y, r: ball.r, a: 1 });
        ball.x = ball.r + Math.random() * (W - 2 * ball.r);
        ball.y = ball.r + Math.random() * (H - 2 * ball.r);
        ball.vx *= 1.08; ball.vy *= 1.08;
      }
    });
    gameBtn.addEventListener('click', function(){
      size();
      score = 0; scoreEl.textContent = 'Ball: 0';
      ball.vx = 2.4 * (Math.random() < 0.5 ? -1 : 1); ball.vy = 1.8 * (Math.random() < 0.5 ? -1 : 1);
      endAt = Date.now() + 20000;
      running = true;
      gameBtn.disabled = true;
      requestAnimationFrame(loop);
    });
    window.addEventListener('resize', size);
    document.querySelectorAll('.tab').forEach(function(t){ t.addEventListener('click', function(){ setTimeout(function(){ size(); if (track && !tripBtn.disabled) moveTo('b'); }, 30); }); });
    size();
  }
})();
