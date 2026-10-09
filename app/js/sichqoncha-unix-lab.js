(function(){
  var $ = function(id){ return document.getElementById(id); };
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function L(uz, en){ return document.documentElement.lang === 'en' ? en : uz; }

  // ================= 5-bob: sichqoncha ichida =================
  (function(){
    var pad = $('e-mouse-pad');
    if (!pad) return;
    var cur = $('e-mouse-cur'), wx = $('e-wheel-x'), wy = $('e-wheel-y'), log = $('e-mouse-log');
    var last = null, ax = 0, ay = 0, sx = 0, sy = 0, raf = 0, pos = { x: 0, y: 0 };
    function draw(){
      raf = 0;
      wx.setAttribute('transform', 'rotate(' + ax.toFixed(1) + ' 50 50)');
      wy.setAttribute('transform', 'rotate(' + ay.toFixed(1) + ' 50 50)');
      cur.style.left = pos.x + 'px'; cur.style.top = pos.y + 'px';
      log.textContent = L('Kursor: X = ', 'Cursor: X = ') + Math.round(pos.x) + ', Y = ' + Math.round(pos.y) +
        L(' · g\'ildiraklar aylandi: X ', ' · wheels turned: X ') + (sx >= 0 ? '+' : '') + Math.round(sx) + ', Y ' + (sy >= 0 ? '+' : '') + Math.round(sy);
    }
    pad.addEventListener('pointermove', function(e){
      var r = pad.getBoundingClientRect();
      pos.x = Math.max(0, Math.min(r.width, e.clientX - r.left));
      pos.y = Math.max(0, Math.min(r.height, e.clientY - r.top));
      if (last) { var dx = e.clientX - last.x, dy = e.clientY - last.y; ax += dx * 3; ay += dy * 3; sx += dx; sy += dy; }
      last = { x: e.clientX, y: e.clientY };
      pad.classList.add('on');
      if (!raf) raf = requestAnimationFrame(draw);
    });
    pad.addEventListener('pointerleave', function(){ last = null; pad.classList.remove('on'); });
  })();

  // ================= 5-bob: buyruq va oyna =================
  (function(){
    var inp = $('e-cli-in');
    if (!inp) return;
    var out = $('e-cli-out'), log = $('e-cli-log');
    var files = ['hisobot.txt', 'rasm.jpg'], docs = [], cmds = 0, chars = 0, cliDone = false, guiDone = false;
    function print(html){ out.innerHTML += html + '\n'; out.scrollTop = out.scrollHeight; }
    function summary(){
      if (cliDone && guiDone) {
        log.textContent = L('Buyruq qatorida: ' + cmds + ' ta buyruq, ' + chars + ' ta belgi, buyruqlarni eslab qolish kerak. Grafik interfeysda: bitta harakat, hech narsani yodlash shart emas.',
          'Command line: ' + cmds + ' commands, ' + chars + ' characters, and you had to remember the commands. Graphical interface: one gesture, nothing to memorize.');
      } else if (cliDone) log.textContent = L('Buyruq bilan bajarildi. Endi o\'ng tomonda sichqoncha bilan sinab ko\'ring.', 'Done with a command. Now try it with the mouse on the right.');
      else if (guiDone) log.textContent = L('Sichqoncha bilan bajarildi. Endi chap tomonda buyruq bilan sinab ko\'ring.', 'Done with the mouse. Now try it with a command on the left.');
    }
    print('<span class="ok">' + esc(L('Salom! Buyruq yozing va Enter\'ni bosing. Yordam: help', 'Hi! Type a command and press Enter. Help: help')) + '</span>');
    inp.addEventListener('keydown', function(e){
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var line = inp.value.trim(); inp.value = '';
      if (!line) return;
      cmds++; chars += line.length;
      print('<span class="cmd">$ ' + esc(line) + '</span>');
      var p = line.split(/\s+/), c = p[0].toLowerCase();
      if (c === 'help') print(esc(L('ls — fayllar ro\'yxati\nls Hujjatlar — papka ichi\nmv FAYL PAPKA — ko\'chirish\nclear — ekranni tozalash', 'ls — list files\nls Hujjatlar — inside the folder\nmv FILE FOLDER — move\nclear — clear the screen')));
      else if (c === 'clear') out.innerHTML = '';
      else if (c === 'ls' || c === 'dir') {
        if (p[1] && /^hujjatlar\/?$/i.test(p[1])) print(esc(docs.join('  ') || L('(bo\'sh)', '(empty)')));
        else if (p[1]) print('<span class="err">' + esc(L('ls: ' + p[1] + ': bunday papka yo\'q', 'ls: ' + p[1] + ': no such folder')) + '</span>');
        else print(esc(['Hujjatlar/'].concat(files).join('  ')));
      } else if (c === 'mv' || c === 'move') {
        if (p.length < 3) print('<span class="err">' + esc(L('mv: qaysi faylni va qayerga? Masalan: mv fayl.txt Papka', 'mv: which file and where to? Example: mv file.txt Folder')) + '</span>');
        else if (files.indexOf(p[1]) < 0) print('<span class="err">' + esc(L('mv: ' + p[1] + ': bunday fayl yo\'q. Harflarga e\'tibor bering — kompyuter bitta harfni ham kechirmaydi.', 'mv: ' + p[1] + ': no such file. Watch the letters — the computer forgives nothing.')) + '</span>');
        else if (!/^hujjatlar\/?$/i.test(p[2])) print('<span class="err">' + esc(L('mv: ' + p[2] + ': bunday papka yo\'q', 'mv: ' + p[2] + ': no such folder')) + '</span>');
        else {
          files.splice(files.indexOf(p[1]), 1); docs.push(p[1]);
          print('<span class="ok">' + esc(L(p[1] + ' → Hujjatlar/ ko\'chirildi', p[1] + ' → Hujjatlar/ moved')) + '</span>');
          if (p[1] === 'hisobot.txt') { cliDone = true; summary(); }
        }
      } else print('<span class="err">' + esc(L(c + ': buyruq topilmadi. Yordam: help', c + ': command not found. Help: help')) + '</span>');
    });

    var desk = $('e-gui'), file = $('e-gui-file'), folder = $('e-gui-folder'), drag = null;
    function over(){
      var a = file.getBoundingClientRect(), b = folder.getBoundingClientRect();
      var x = a.left + a.width / 2, y = a.top + a.height / 2;
      return x > b.left && x < b.right && y > b.top && y < b.bottom;
    }
    function drop(){
      file.hidden = true; guiDone = true;
      folder.querySelector('span').textContent = 'Hujjatlar (1)';
      summary();
    }
    file.addEventListener('pointerdown', function(e){
      e.preventDefault();
      var r = file.getBoundingClientRect();
      drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      try { file.setPointerCapture(e.pointerId); } catch(err) {}
      file.classList.add('dragging');
    });
    file.addEventListener('pointermove', function(e){
      if (!drag) return;
      var d = desk.getBoundingClientRect();
      file.style.left = Math.max(0, Math.min(d.width - file.offsetWidth, e.clientX - d.left - drag.dx)) + 'px';
      file.style.top = Math.max(0, Math.min(d.height - file.offsetHeight, e.clientY - d.top - drag.dy)) + 'px';
      folder.classList.toggle('over', over());
    });
    function end(){
      if (!drag) return;
      drag = null;
      file.classList.remove('dragging');
      folder.classList.remove('over');
      if (over()) drop();
    }
    file.addEventListener('pointerup', end);
    file.addEventListener('pointercancel', end);
    file.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(); } });
  })();

  // ================= 6-bob: Unix terminali =================
  (function(){
    var inp = $('u-term-in');
    if (!inp) return;
    var out = $('u-term-out'), log = $('u-term-log'), tasksEl = $('u-tasks');
    var FS = {
      'mevalar.txt': 'olma\nbanan\nolma\nnok\nuzum\nolma\nanor\nbanan\nshaftoli\nnok',
      'eslatma.txt': 'Unix falsafasi: har bir dastur bitta ishni yaxshi qilsin.\nDasturlar matn orqali gaplashsin.',
      'salom.c': '#include <stdio.h>\n\nint main(void) {\n    printf("Salom, dunyo!\\n");\n    return 0;\n}'
    };
    var hist = [], hi = 0, done = {};
    function print(t, cls){ out.innerHTML += (cls ? '<span class="' + cls + '">' + esc(t) + '</span>' : esc(t)) + '\n'; out.scrollTop = out.scrollHeight; }
    function lines(s){ return s === '' ? [] : s.split('\n'); }
    function fileOr(arg, input, name){
      if (arg == null) { if (input == null) throw L(name + ': fayl nomini yozing', name + ': give a file name'); return input; }
      if (!Object.prototype.hasOwnProperty.call(FS, arg)) throw L(name + ': ' + arg + ': bunday fayl yo\'q', name + ': ' + arg + ': no such file');
      return FS[arg];
    }
    var CMD = {
      help: function(){ return L('Buyruqlar:\n  ls              fayllar ro\'yxati\n  cat FAYL        faylni o\'qish\n  grep SO\'Z       so\'z bor qatorlarni ajratish\n  wc -l           qatorlarni sanash\n  sort            alifbo tartibida\n  uniq            yonma-yon takrorlarni olib tashlash\n  head -n 3       birinchi 3 qator\n  echo MATN       matnni chiqarish\n  pwd, whoami, date, clear\nQuvur: buyruq1 | buyruq2', 'Commands:\n  ls              list files\n  cat FILE        print a file\n  grep WORD       keep lines containing a word\n  wc -l           count lines\n  sort            sort alphabetically\n  uniq            remove adjacent duplicates\n  head -n 3       first 3 lines\n  echo TEXT       print text\n  pwd, whoami, date, clear\nPipe: command1 | command2'); },
      ls: function(){ done.ls = true; return Object.keys(FS).join('  '); },
      pwd: function(){ return '/home/talaba'; },
      whoami: function(){ return 'talaba'; },
      date: function(){ return new Date().toString(); },
      echo: function(a){ return a.join(' ').replace(/^["']|["']$/g, ''); },
      cat: function(a, input){ if (!a.length) return fileOr(null, input, 'cat'); return a.map(function(f){ return fileOr(f, null, 'cat'); }).join('\n'); },
      grep: function(a, input){
        if (!a.length) throw L('grep: qaysi so\'zni qidiray?', 'grep: which word should I search for?');
        var w = a[0].replace(/^["']|["']$/g, '');
        return lines(fileOr(a[1], input, 'grep')).filter(function(l){ return l.indexOf(w) !== -1; }).join('\n');
      },
      wc: function(a, input){
        var flag = a[0] && a[0][0] === '-' ? a.shift() : '';
        var t = fileOr(a[0], input, 'wc'), n = lines(t).length;
        if (flag === '-l') return String(n);
        return n + ' ' + (t.split(/\s+/).filter(Boolean).length) + ' ' + t.length;
      },
      sort: function(a, input){ return lines(fileOr(a[0], input, 'sort')).sort().join('\n'); },
      uniq: function(a, input){ return lines(fileOr(a[0], input, 'uniq')).filter(function(l, i, arr){ return i === 0 || l !== arr[i - 1]; }).join('\n'); },
      head: function(a, input){
        var n = 10;
        if (a[0] === '-n') { n = parseInt(a[1], 10) || 10; a = a.slice(2); }
        else if (/^-\d+$/.test(a[0] || '')) { n = +a[0].slice(1); a = a.slice(1); }
        return lines(fileOr(a[0], input, 'head')).slice(0, n).join('\n');
      }
    };
    function mark(){
      tasksEl.querySelectorAll('[data-task]').forEach(function(cb){
        var ok = !!done[cb.getAttribute('data-task')];
        cb.checked = ok; cb.closest('label').classList.toggle('ok', ok);
      });
      var n = Object.keys(done).length;
      log.textContent = n === 4 ? L('Barakalla! Siz Unix falsafasini amalda sinab ko\'rdingiz: kichik dasturlar + quvur = katta natija.', 'Well done! You tried the Unix philosophy in practice: small programs + a pipe = a big result.')
        : L('Bajarildi: ' + n + ' / 4 vazifa.', 'Done: ' + n + ' / 4 tasks.');
      log.className = 'cpu-log';
    }
    function run(line){
      var parts = line.split('|').map(function(s){ return s.trim(); }), data = null, names = [];
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i].split(/\s+/), c = p.shift();
        if (!c) throw L('quvurda bo\'sh buyruq bor', 'there is an empty command in the pipe');
        names.push(c);
        if (c === 'clear') { out.innerHTML = ''; return null; }
        if (!CMD[c]) throw L(c + ': buyruq topilmadi. Yordam: help', c + ': command not found. Help: help');
        data = CMD[c](p, data);
      }
      if (names[0] === 'cat' && /mevalar\.txt/.test(parts[0]) && parts.length === 1) done.cat = true;
      if (parts.length > 1 && names.indexOf('grep') !== -1 && names.indexOf('wc') !== -1 && /olma/.test(line) && data.trim() === '3') done.pipe = true;
      if (parts.length > 1 && names.indexOf('sort') !== -1 && names.indexOf('uniq') !== -1 && data === 'anor\nbanan\nnok\nolma\nshaftoli\nuzum') done.sort = true;
      return data;
    }
    print(L('Unix terminaliga xush kelibsiz. Boshlash uchun: help', 'Welcome to the Unix terminal. To start: help'), 'ok');
    inp.addEventListener('keydown', function(e){
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (!hist.length) return;
        e.preventDefault();
        hi = Math.max(0, Math.min(hist.length, hi + (e.key === 'ArrowUp' ? -1 : 1)));
        inp.value = hist[hi] || '';
        return;
      }
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var line = inp.value.trim(); inp.value = '';
      if (!line) return;
      hist.push(line); hi = hist.length;
      print('$ ' + line, 'cmd');
      try { var r = run(line); if (r != null && r !== '') print(r); }
      catch (err) { print(String(err), 'err'); }
      mark();
    });
  })();
})();
