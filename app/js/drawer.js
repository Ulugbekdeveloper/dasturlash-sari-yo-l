(function(){
  var $ = function(id){ return document.getElementById(id); };
  var root = document.documentElement;
  var drawer = $('drawer'), scrim = $('drawer-scrim'), page = document.querySelector('.page');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastFocus = null;
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  // Tarix boblari uchun kichik portretlar
  document.querySelectorAll('.tab-ico[data-av]').forEach(function(ic){
    var im = document.querySelector('#panel-' + ic.getAttribute('data-av') + ' .hero-card img');
    if (im && im.src) ic.innerHTML = '<img src="' + im.src + '" alt="">';
  });

  // ---------- "Shu sahifada" ro'yxati ----------
  var toc = $('toc'), tocTitle = $('toc-title');
  function buildToc(){
    var panel = document.querySelector('.panel:not([hidden])');
    if (!panel) return;
    var key = panel.getAttribute('data-lesson'), html = '', items = [];
    var isLesson = /^\d+$/.test(key);
    tocTitle.textContent = isLesson ? 'Shu darsdagi qadamlar' : "Shu bobdagi bo'limlar";
    if (isLesson) {
      panel.querySelectorAll('.part-head, .step').forEach(function(el, i){
        if (!el.id) el.id = 'toc-' + key + '-' + i;
        if (el.classList.contains('part-head')) {
          var h = el.querySelector('h3');
          html += '<a href="#' + el.id + '" class="grp" data-to="' + el.id + '"><span>' + esc(h ? h.textContent : '') + '</span></a>';
        } else {
          var num = el.querySelector('.step-num'), title = el.querySelector('.step-title'), cb = el.querySelector('.step-head input');
          var t = title ? title.textContent.replace(num ? num.textContent : '', '').trim() : '';
          html += '<a href="#' + el.id + '" data-to="' + el.id + '"' + (cb && cb.checked ? ' class="done"' : '') + '><span class="tn">' + (cb && cb.checked ? '✓' : esc(num ? num.textContent : '')) + '</span><span>' + esc(t) + '</span></a>';
        }
        items.push(el);
      });
    } else {
      panel.querySelectorAll('.chapter').forEach(function(el, i){
        var h = el.querySelector('h3');
        if (!h) return;
        if (!el.id) el.id = 'toc-' + key + '-' + i;
        html += '<a href="#' + el.id + '" data-to="' + el.id + '"><span>' + esc(h.textContent) + '</span></a>';
        items.push(el);
      });
    }
    toc.innerHTML = html;
    // Hozir ekrandagi bo'limni belgilash
    var cur = null;
    items.forEach(function(el){ if (el.getBoundingClientRect().top < 160) cur = el; });
    if (cur) { var a = toc.querySelector('[data-to="' + cur.id + '"]'); if (a) a.classList.add('on'); }
  }
  toc.addEventListener('click', function(e){
    var a = e.target.closest('a[data-to]');
    if (!a) return;
    e.preventDefault();
    var el = $(a.getAttribute('data-to'));
    close(false);
    setTimeout(function(){ if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 30);
  });

  // ---------- Ochish / yopish ----------
  function open(){
    lastFocus = document.activeElement;
    buildToc();
    root.classList.add('drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (page) page.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('[data-open-drawer]').forEach(function(b){ b.setAttribute('aria-expanded', 'true'); });
    var cur = drawer.querySelector('.tab[aria-selected="true"]') || $('drawer-close');
    setTimeout(function(){
      cur.focus({ preventScroll: true });
      cur.scrollIntoView({ block: 'nearest' });
      var on = toc.querySelector('a.on');
      if (on && on.getBoundingClientRect().top > window.innerHeight - 60) on.scrollIntoView({ block: 'center' });
    }, 60);
  }
  function close(restore){
    if (!root.classList.contains('drawer-open')) return;
    root.classList.remove('drawer-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (page) page.removeAttribute('aria-hidden');
    document.querySelectorAll('[data-open-drawer]').forEach(function(b){ b.setAttribute('aria-expanded', 'false'); });
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-open-drawer]').forEach(function(b){ b.addEventListener('click', open); });
  $('drawer-close').addEventListener('click', function(){ close(); });
  scrim.addEventListener('click', function(){ close(); });
  document.addEventListener('keydown', function(e){
    if (!root.classList.contains('drawer-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var f = drawer.querySelectorAll('button:not([disabled]), a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Dars tanlanganda panel yopiladi
  $('tabs').addEventListener('click', function(e){ if (e.target.closest('.tab')) setTimeout(function(){ close(false); }, 120); });

  // Barmoq bilan chapga surib yopish
  var sx = null, dx = 0;
  drawer.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; dx = 0; }, { passive: true });
  drawer.addEventListener('touchmove', function(e){
    if (sx === null) return;
    dx = Math.min(0, e.touches[0].clientX - sx);
    if (dx < -8) { drawer.classList.add('dragging'); drawer.style.transform = 'translateX(' + dx + 'px)'; }
  }, { passive: true });
  drawer.addEventListener('touchend', function(){
    drawer.classList.remove('dragging');
    drawer.style.transform = '';
    if (dx < -70) close();
    sx = null; dx = 0;
  });

  // Chap chetdan o'ngga surib ochish (telefonda)
  var ex = null;
  document.addEventListener('touchstart', function(e){ var x = e.touches[0].clientX; ex = (!root.classList.contains('drawer-open') && x < 18) ? x : null; }, { passive: true });
  document.addEventListener('touchmove', function(e){ if (ex !== null && e.touches[0].clientX - ex > 60) { ex = null; open(); } }, { passive: true });

  // "Davom ettirish"
  var cont = $('hero-continue');
  if (cont) cont.addEventListener('click', function(){ $('content-top').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); });
  function syncContinue(){
    var t = document.querySelector('.tab[aria-selected="true"] .tab-name');
    var l = $('hero-continue-label');
    if (t && l) l.textContent = t.textContent;
  }
  if (window.MutationObserver) new MutationObserver(syncContinue).observe($('tabs'), { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
  syncContinue();
})();
