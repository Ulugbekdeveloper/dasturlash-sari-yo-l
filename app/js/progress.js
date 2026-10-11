(function(){
  var $ = function(id){ return document.getElementById(id); };
  var root = document.documentElement;
  var THEME_KEY = 'frontendga-sari-theme';
  var dark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // ---------- Rang rejimi ----------
  function themeMeta(){
    var isDark = root.getAttribute('data-theme') === 'dark' || (!root.getAttribute('data-theme') && dark && dark.matches);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', isDark ? '#111418' : '#FFFFFF');
  }
  function applyTheme(t){
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    document.querySelectorAll('[data-theme-set]').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === (t || 'auto') ? 'true' : 'false'); });
    themeMeta();
    window.dispatchEvent(new Event('resize'));
  }
  var saved = 'auto';
  try { saved = localStorage.getItem(THEME_KEY) || 'auto'; } catch(e) {}
  applyTheme(saved);
  document.querySelectorAll('[data-theme-set]').forEach(function(b){
    b.addEventListener('click', function(){
      var t = b.getAttribute('data-theme-set');
      applyTheme(t);
      try { localStorage.setItem(THEME_KEY, t); } catch(e) {}
    });
  });
  if (dark && dark.addEventListener) dark.addEventListener('change', themeMeta);

  // ---------- Joriy bo'lim nomi ----------
  var crumbText = $('crumb-text');
  function syncCrumb(){
    var t = document.querySelector('.tab[aria-selected="true"]');
    if (t && crumbText) crumbText.textContent = t.querySelector('.tab-name').textContent;
  }
  var tabsEl = $('tabs');
  if (tabsEl && window.MutationObserver) new MutationObserver(syncCrumb).observe(tabsEl, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
  syncCrumb();
  document.querySelector('.brand').addEventListener('click', function(e){ e.preventDefault(); window.scrollTo({ top: 0 }); });

  // ---------- O'qish progressi va "tepaga" ----------
  var bar = $('read-bar'), toTop = $('to-top'), ticking = false;
  function onScroll(){
    ticking = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%';
    toTop.classList.toggle('show', window.scrollY > 900);
  }
  window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  toTop.addEventListener('click', function(){ window.scrollTo({ top: 0 }); });
  onScroll();

  // ---------- Umumiy progress ----------
  var ALL = [['frontendga-sari-lesson1-v2', 23], ['frontendga-sari-lesson2', 9], ['frontendga-sari-lesson3', 16], ['frontendga-sari-lesson4', 16], ['frontendga-sari-lesson5', 16], ['frontendga-sari-lesson6', 16], ['frontendga-sari-lesson7', 16]];
  function overall(){
    var done = 0, total = 0;
    ALL.forEach(function(L, idx){
      var s = {}, d = 0;
      try { s = JSON.parse(localStorage.getItem(L[0]) || '{}') || {}; } catch(e) {}
      for (var i = 1; i <= L[1]; i++) if (s['step' + i]) d++;
      done += d; total += L[1];
      var f = document.querySelector('[data-fill="' + (idx + 1) + '"]');
      if (f) f.style.width = (d / L[1] * 100) + '%';
    });
    var txt = done + ' / ' + total, w = (done / total * 100) + '%';
    $('all-done').textContent = txt; $('all-bar').style.width = w;
    if ($('dr-done')) { $('dr-done').textContent = txt; $('dr-bar').style.width = w; }
  }
  document.addEventListener('change', function(e){ if (/^l\d+-step\d+$/.test(e.target.id || '')) setTimeout(overall, 0); }, true);
  overall();
})();
