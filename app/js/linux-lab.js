// 7-bob: "Vaqt mashinasi" — commit, tarix, farq va eski versiyaga qaytish
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var file = $('l-git-file');
  if (!file) return;
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function L(uz, en){ return document.documentElement.lang === 'en' ? en : uz; }
  var msgEl = $('l-git-msg'), logEl = $('l-git-log'), diffEl = $('l-git-diff'), statusEl = $('l-git-status');
  var commits = [], sel = -1;

  // Commitning "barmoq izi": mazmun + izoh + oldingi commitdan hisoblanadi
  function fingerprint(text, msg, parent){
    var s = parent + '\n' + msg + '\n' + text, h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-7);
  }
  function lineDiff(a, b){
    a = a.split('\n'); b = b.split('\n');
    var n = a.length, m = b.length, t = [];
    for (var i = 0; i <= n; i++) { t.push([]); for (var j = 0; j <= m; j++) t[i].push(0); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
    var out = []; i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { out.push(['  ', a[i]]); i++; j++; }
      else if (t[i + 1][j] >= t[i][j + 1]) out.push(['- ', a[i++]]);
      else out.push(['+ ', b[j++]]);
    }
    while (i < n) out.push(['- ', a[i++]]);
    while (j < m) out.push(['+ ', b[j++]]);
    return out;
  }
  function commit(text, msg){
    var parent = commits.length ? commits[commits.length - 1].hash : '';
    commits.push({ hash: fingerprint(text, msg, parent), msg: msg, text: text, time: new Date() });
  }
  function renderLog(){
    logEl.innerHTML = commits.map(function(c, i){ return { c: c, i: i }; }).reverse().map(function(x){
      return '<button type="button" class="tm-item' + (x.i === sel ? ' sel' : '') + '" data-i="' + x.i + '"><b>' + x.c.hash + '</b><span>' + esc(x.c.msg) + '</span><small>' + (x.i === commits.length - 1 ? 'HEAD' : '') + '</small></button>';
    }).join('');
  }
  function show(i){
    sel = i;
    var c = commits[i], prev = i > 0 ? commits[i - 1].text : '';
    diffEl.innerHTML = '<span>commit ' + c.hash + '  ' + esc(c.msg) + '</span>\n\n' + lineDiff(prev, c.text).map(function(d){
      return d[0] === '  ' ? '  ' + esc(d[1]) : '<span class="' + (d[0] === '+ ' ? 'add' : 'del') + '">' + d[0] + esc(d[1]) + '</span>';
    }).join('\n');
    statusEl.innerHTML = esc(L('Bu commitda nima o\'zgarganini ko\'ryapsiz: yashil — qo\'shilgan, qizil — o\'chirilgan qatorlar. ', 'This is what changed in this commit: green lines were added, red lines removed. ')) +
      (i < commits.length - 1 ? '<button type="button" class="btn" id="l-git-restore">' + esc(L('Faylni shu versiyaga qaytarish', 'Restore the file to this version')) + '</button>' : '');
    var rb = $('l-git-restore');
    if (rb) rb.addEventListener('click', function(){
      file.value = c.text;
      statusEl.textContent = L('Fayl ' + c.hash + ' holatiga qaytdi. Tarix o\'chmadi — xohlasangiz, buni yangi commit qilib saqlang.', 'The file is back to ' + c.hash + '. History was not erased — save this as a new commit if you like.');
      file.focus();
    });
    renderLog();
  }
  logEl.addEventListener('click', function(e){
    var b = e.target.closest('.tm-item');
    if (b) show(+b.getAttribute('data-i'));
  });
  function doCommit(){
    var text = file.value, msg = msgEl.value.trim();
    if (text === commits[commits.length - 1].text) { statusEl.textContent = L('O\'zgarish yo\'q — saqlash uchun avval faylni tahrirlang.', 'Nothing changed — edit the file before committing.'); return; }
    if (!msg) { statusEl.textContent = L('Izoh yozing: bu commitda nima qildingiz?', 'Write a message: what did you do in this commit?'); msgEl.focus(); return; }
    commit(text, msg);
    msgEl.value = '';
    show(commits.length - 1);
    if (commits.length === 3) statusEl.innerHTML = esc(L('Barakalla! Endi tarixdagi birinchi commitni bosing va faylni o\'sha holatga qaytarib ko\'ring.', 'Well done! Now click the first commit in the history and try restoring the file to it.'));
  }
  $('l-git-commit').addEventListener('click', doCommit);
  msgEl.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); doCommit(); } });
  commit('Salom!\nMen frontend o\'rganyapman.', 'Birinchi versiya');
  file.value = commits[0].text;
  show(0);
  statusEl.textContent = L('Faylni o\'zgartiring, izoh yozing va "Commit" ni bosing.', 'Edit the file, write a message and press "Commit".');
  document.addEventListener('i18n:change', function(){ if (sel >= 0) show(sel); });
})();
