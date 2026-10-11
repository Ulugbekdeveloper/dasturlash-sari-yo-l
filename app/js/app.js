(function(){
  var $ = function(id){ return document.getElementById(id); };
  function load(key){ try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch(e){ return {}; } }
  function store(key, obj){ try { localStorage.setItem(key, JSON.stringify(obj)); } catch(e){} }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function shuffle(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function img(name, cls){ var src = (window.IMGS_ALL && window.IMGS_ALL[name]) || ('media/emoji/' + name + '.png'); return '<img class="im ' + (cls || '') + '" src="' + src + '" alt="" draggable="false">'; }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Words ----------
  var WORDS = {
    devices: [
      ['computer','kəmpyutər','kompyuter','desktop_computer'],
      ['laptop','leptop','noutbuk','laptop'],
      ['screen','skrin','ekran','television'],
      ['keyboard','kibord','klaviatura','keyboard'],
      ['mouse','maus','sichqoncha','computer_mouse'],
      ['processor','prosesər','protsessor, "miya"','brain'],
      ['printer','printər','printer','printer'],
      ['speaker','spikər','karnay','speaker_high_volume'],
      ['phone','foun','telefon','mobile_phone'],
      ['power','pauər','quvvat, tok','electric_plug']
    ],
    actions: [
      ['click','klik','bosish','backhand_index_pointing_up'],
      ['select','silekt','tanlash','check_mark_button'],
      ['drag','dreg','sudrash','pinching_hand'],
      ['type','tayp','yozish','writing_hand'],
      ['copy','kopi','nusxa olish','bookmark_tabs'],
      ['paste','peyst',"qo'yish (nusxani)",'clipboard'],
      ['delete','diliyt',"o'chirish",'wastebasket'],
      ['save','seyv','saqlash','floppy_disk'],
      ['undo','andu','ortga qaytarish','right_arrow_curving_left'],
      ['search','sörch','qidirish','magnifying_glass_tilted_left']
    ],
    files: [
      ['file','fayl','fayl','page_facing_up'],
      ['folder','fouldər','papka','file_folder'],
      ['window','vindou','oyna','window'],
      ['menu','menyu','menyu','spiral_notepad'],
      ['program','prougrem','dastur','gear'],
      ['code','koud','kod','technologist'],
      ['input','input',"kirish (ma'lumot)",'inbox_tray'],
      ['output','autput','chiqish (natija)','outbox_tray'],
      ['step','step','qadam','footprints'],
      ['error','erər','xato','warning']
    ],
    web: [
      ['web','veb','internet, veb','globe_with_meridians'],
      ['page','peyj','sahifa','page_with_curl'],
      ['browser','brauzər','brauzer','compass'],
      ['tag','teg','yorliq, teg','label'],
      ['heading','heding','sarlavha','newspaper'],
      ['paragraph','perəgraf',"matn bo'lagi",'scroll'],
      ['open','oupən','ochish','open_file_folder'],
      ['close','klouz','yopish','package'],
      ['text','tekst','matn','input_latin_letters'],
      ['name','neym','nom, ism','identification_card']
    ],
    lesson3: [
      ['list','list',"ro'yxat",'spiral_notepad'],
      ['item','aytəm','band, element','check_mark_button'],
      ['link','link','havola','link'],
      ['image','imij','rasm','framed_picture'],
      ['source','sors','manba','direct_hit'],
      ['attribute','etribyut','atribut, xususiyat','label'],
      ['comment','koment','izoh','speech_balloon'],
      ['editor','editər','muharrir dastur','technologist'],
      ['install','instol',"o'rnatish",'package'],
      ['download','daunloud','yuklab olish','inbox_tray']
    ],
    computer: [
      ['bit','bit','ikkilik raqam: 0 yoki 1','radio_button'],
      ['byte','bayt','bayt = 8 bit','input_numbers'],
      ['binary','baynəri','ikkilik','light_bulb'],
      ['gate','geyt','darvoza','door'],
      ['memory','meməri','xotira','file_cabinet'],
      ['register','rejistər','registr','card_file_box'],
      ['instruction','instrakshən','buyruq','scroll'],
      ['bus','bas',"shina, ma'lumot yo'li",'automobile'],
      ['cache','kesh','kesh, tez xotira','stopwatch'],
      ['switch','svich',"kalit, o'chirgich",'electric_plug']
    ],
    history: [
      ['link','link','havola','link'],
      ['server','sörvər','server','satellite_antenna'],
      ['network','netvörk',"tarmoq, to'r",'spider_web'],
      ['proposal','prəpouzəl','taklif','memo'],
      ['standard','stendərd','standart, qoida','straight_ruler'],
      ['version','vörjən','versiya','input_numbers'],
      ['image','imij','rasm','framed_picture'],
      ['video','vidiou','video','movie_camera'],
      ['game','geym',"o'yin",'video_game'],
      ['free','fri','tekin, erkin','wrapped_gift']
    ],
    lesson4: [
      ['table','teybl','jadval','card_file_box'],
      ['row','rou','qator','straight_ruler'],
      ['column','koləm','ustun','input_numbers'],
      ['cell','sel','katak','check_mark_button'],
      ['form','form',"forma, so'rovnoma",'memo'],
      ['field','fiyld','maydon, yozish joyi','writing_hand'],
      ['button','batən','tugma','backhand_index_pointing_up'],
      ['submit','səbmit','yuborish','outbox_tray'],
      ['required','rikvayərd','majburiy','warning'],
      ['password','pasvörd','parol','locked_with_key']
    ],
    assembler: [
      ['assembler','əsemblər',"yig'uvchi dastur",'gear'],
      ['machine code','məshiyn koud','mashina kodi','input_numbers'],
      ['translate','trensleyt','tarjima qilish','speech_balloon'],
      ['address','ədres','manzil','envelope'],
      ['label','leybl','belgi, yorliq','label'],
      ['load','loud','yuklash','inbox_tray'],
      ['store','stor','saqlash (xotiraga)','floppy_disk'],
      ['jump','jamp','sakrash','right_arrow_curving_left'],
      ['loop','luup','sikl, takrorlash','stopwatch'],
      ['subroutine','sabrutiyn','qism-dastur','package']
    ],
    compiler: [
      ['compiler','kəmpaylər','kompilyator','gear'],
      ['interpreter','intörpritər','interpretator','speech_balloon'],
      ['source code','sors koud','manba kod','page_facing_up'],
      ['language','lenguij','til','globe_with_meridians'],
      ['bug','bag',"xato (so'zma-so'z: qo'ng'iz)",'warning'],
      ['debug','dibag','xatoni tuzatish','magnifying_glass_tilted_left'],
      ['syntax','sintaks','yozilish qoidasi','straight_ruler'],
      ['token','toukən',"bo'lak, so'z",'label'],
      ['tree','triy','daraxt','seedling'],
      ['run','ran','ishga tushirish','rocket']
    ],
    internet: [
      ['internet','intərnet',"tarmoqlar tarmog'i",'globe_with_meridians'],
      ['packet','pekit','paket','package'],
      ['protocol','proutəkol','qoidalar, protokol','scroll'],
      ['router','rautər',"yo'naltirgich",'compass'],
      ['IP address','ay-pi ədres','IP manzil','envelope'],
      ['domain','dəmeyn','domen, sayt nomi','identification_card'],
      ['send','send','yuborish','outbox_tray'],
      ['receive','risiyv','qabul qilish','inbox_tray'],
      ['connection','kənekshən','ulanish','electric_plug'],
      ['message','mesij','xabar','speech_balloon']
    ],
    lesson5: [
      ['style','stayl','uslub','artist_palette'],
      ['color','kalər','rang','droplet'],
      ['background','bekgraund','fon, orqa tomon','framed_picture'],
      ['font','font','shrift','input_latin_letters'],
      ['size','sayz',"o'lcham",'straight_ruler'],
      ['border','bordər','chegara, hoshiya','card_file_box'],
      ['margin','marjin',"tashqi bo'shliq",'page_facing_up'],
      ['padding','pedding',"ichki bo'shliq",'package'],
      ['selector','silektər','tanlovchi, selektor','direct_hit'],
      ['property','propərti','xususiyat','label']
    ],
    lesson6: [
      ['layout','leyaut','joylashuv','framed_picture'],
      ['header','hedər','bosh qism','newspaper'],
      ['footer','futər','pastki qism','footprints'],
      ['flexible','fleksəbl','egiluvchan','pinching_hand'],
      ['wrap','rep',"o'rash, keyingi qatorga o'tkazish",'wrapped_gift'],
      ['direction','dayrekshən',"yo'nalish",'compass'],
      ['width','vidθ','en, kenglik','straight_ruler'],
      ['display','displey',"ko'rsatish, ekran",'television'],
      ['mobile','moubayl','mobil, telefon','mobile_phone'],
      ['responsive','rispónsiv','moslashuvchan','chart_increasing']
    ],
    engelbart: [
      ['interface','intərfeys','interfeys, muloqot oynasi','window'],
      ['icon','aykon','ikonka, belgi','framed_picture'],
      ['pointer','poyntər',"ko'rsatkich, kursor",'backhand_index_pointing_up'],
      ['desktop','desktop','ish stoli','desktop_computer'],
      ['command','kəmend','buyruq','keyboard'],
      ['scroll','skroul','varaqlash, aylantirish','scroll'],
      ['wheel','viyl',"g'ildirak",'automobile'],
      ['demo','demou','namoyish','megaphone'],
      ['augment','ogment','kuchaytirish','chart_increasing'],
      ['collaborate','kəlebəreyt','birga ishlash','busts_in_silhouette']
    ],
    unix: [
      ['operating system','opəreyting sistəm','operatsion tizim','gear'],
      ['kernel','körnəl','yadro','direct_hit'],
      ['shell','shel',"buyruq qobig'i (shell)",'technologist'],
      ['terminal','törminəl','terminal','desktop_computer'],
      ['pipe','payp','quvur','link'],
      ['directory','dayrektəri','katalog, papka','file_folder'],
      ['process','prouses','jarayon, ishlayotgan dastur','stopwatch'],
      ['compile','kəmpayl','kompilyatsiya qilish','gear'],
      ['library','laybrəri','kutubxona','bookmark_tabs'],
      ['portable','portəbl',"ko'chirib bo'ladigan",'package']
    ],
    lesson7: [
      ['repository','ripozitori','repozitoriy, loyiha ombori','file_cabinet'],
      ['commit','kəmit','saqlash nuqtasi, commit','check_mark_button'],
      ['stage','steyj','tayyorlash, sahna','inbox_tray'],
      ['push','push','itarish, yuborish','outbox_tray'],
      ['pull','pul','tortish, olish','right_arrow_curving_left'],
      ['branch','brench','tarmoq, shox','seedling'],
      ['deploy','diploy','internetga chiqarish','rocket'],
      ['track','trek','kuzatish','footprints'],
      ['history','histəri','tarix','scroll'],
      ['message','mesij','xabar, izoh','speech_balloon']
    ],
    linux: [
      ['open source','oupən sors','ochiq kod','open_file_folder'],
      ['license','laysəns','litsenziya, ruxsatnoma','memo'],
      ['contribute','kəntribyut','hissa qo\'shish','wrapped_gift'],
      ['community','kəmyunəti','hamjamiyat','busts_in_silhouette'],
      ['patch','pech','tuzatish, yamoq','package'],
      ['review','rivyu','ko\'rib chiqish','magnifying_glass_tilted_left'],
      ['maintainer','meynteynər','loyiha qo\'riqchisi, mas\'ul','technologist'],
      ['release','riliyz','chiqarish, yangi versiya','rocket'],
      ['hobby','hobi','hobbi, qiziqish','video_game'],
      ['penguin','pengvin','pingvin','hatching_chick']
    ]
  };

  var canSpeak = 'speechSynthesis' in window;
  function say(text){
    if (!canSpeak) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      var voices = window.speechSynthesis.getVoices() || [];
      for (var i = 0; i < voices.length; i++) { if (/^en[-_]US/i.test(voices[i].lang)) { u.voice = voices[i]; break; } }
      window.speechSynthesis.speak(u);
    } catch(e) {}
  }

  document.querySelectorAll('[data-words]').forEach(function(grid){
    var list = WORDS[grid.getAttribute('data-words')] || [];
    grid.innerHTML = list.map(function(w){
      return '<button type="button" class="word-card" data-say="' + esc(w[0]) + '" aria-label="' + esc(w[0] + ' — ' + w[2]) + '">' +
        '<span class="word-pic">' + img(w[3]) + '</span>' +
        '<span class="word-en">' + esc(w[0]) + '</span><span class="word-pron">' + esc(w[1]) + '</span><span class="word-uz">' + esc(w[2]) + '</span>' +
        (canSpeak ? '<span class="word-say">' + img('speaker_high_volume') + '</span>' : '') + '</button>';
    }).join('');
  });
  document.addEventListener('click', function(e){
    var c = e.target.closest && e.target.closest('.word-card');
    if (!c) return;
    say(c.getAttribute('data-say'));
    c.classList.add('speaking');
    setTimeout(function(){ c.classList.remove('speaking'); }, 900);
  });

  // ---------- Lessons, progress ----------
  var LESSONS = [
    { n: 1, steps: 23, key: 'frontendga-sari-lesson1-v2' },
    { n: 2, steps: 9, key: 'frontendga-sari-lesson2' },
    { n: 3, steps: 16, key: 'frontendga-sari-lesson3' },
    { n: 4, steps: 16, key: 'frontendga-sari-lesson4' },
    { n: 5, steps: 16, key: 'frontendga-sari-lesson5' },
    { n: 6, steps: 16, key: 'frontendga-sari-lesson6' },
    { n: 7, steps: 16, key: 'frontendga-sari-lesson7' }
  ];
  var states = {}, keys = {};
  LESSONS.forEach(function(L){
    var state = load(L.key);
    states[L.n] = state;
    keys[L.n] = L.key;
    function update(){
      var done = 0;
      for (var i = 1; i <= L.steps; i++) { if (state['step' + i]) done++; }
      $('l' + L.n + '-bar').style.width = (done / L.steps * 100) + '%';
      $('l' + L.n + '-label').textContent = done + ' / ' + L.steps + ' qadam bajarildi';
      $('tab-' + L.n + '-count').textContent = (done === L.steps ? '✓ ' : '') + done + '/' + L.steps;
      $('tab-' + L.n).classList.toggle('complete', done === L.steps);
    }
    for (var i = 1; i <= L.steps; i++) {
      (function(i){
        var el = $('l' + L.n + '-step' + i);
        if (!el) return;
        el.checked = !!state['step' + i];
        el.addEventListener('change', function(){
          state['step' + i] = el.checked;
          store(L.key, state);
          update();
        });
      })(i);
    }
    update();
  });

  function autoCheck(id){
    var el = $(id);
    if (el && !el.checked) { el.checked = true; el.dispatchEvent(new Event('change')); }
  }
  var NEED = { 'l1-step12': ['path', 'files'], 'l1-step15': ['og', 'missing'] };
  var GOT = {};
  function partDone(step, part){
    if (!step) return;
    var need = NEED[step];
    if (!need) { autoCheck(step); return; }
    GOT[step] = GOT[step] || {};
    GOT[step][part || 'main'] = true;
    if (need.every(function(p){ return GOT[step][p]; })) autoCheck(step);
  }
  function lessonOf(id){ return +String(id).charAt(1) || 1; }

  var old1 = load('frontendga-sari-lesson1');
  if (!states[1].taskText && old1.taskText) { states[1].taskText = old1.taskText; store(keys[1], states[1]); }

  [['l1-task', 1, 'taskText'], ['l1-devices', 1, 'devicesText'], ['l1-problems', 1, 'problemsText'], ['l2-interviews', 2, 'interviewsText'], ['l3-insights', 3, 'insightsText'], ['l4-waitlist', 4, 'waitlistText'], ['l5-brand', 5, 'brandText'], ['l6-landing', 6, 'landingText'], ['l7-public', 7, 'publicText']].forEach(function(t){
    var el = $(t[0]);
    if (!el) return;
    var s = states[t[1]];
    el.value = s[t[2]] || '';
    el.addEventListener('input', function(){ s[t[2]] = el.value; store(keys[t[1]], s); });
  });

  // ---------- Checklists ----------
  document.querySelectorAll('.checklist').forEach(function(list){
    var inputs = list.querySelectorAll('input[data-sub]');
    var step = list.getAttribute('data-step'), part = list.getAttribute('data-part');
    inputs.forEach(function(el){
      var n = lessonOf(el.id), s = states[n];
      s.sub = s.sub || {};
      var k = el.getAttribute('data-sub');
      el.checked = !!s.sub[k];
      el.addEventListener('change', function(){
        s.sub[k] = el.checked;
        store(keys[n], s);
        if (step && Array.prototype.every.call(inputs, function(i){ return i.checked; })) partDone(step, part);
      });
    });
  });

  // ---------- Sorters ----------
  document.querySelectorAll('.sorter').forEach(function(sorter){
    var opts = sorter.getAttribute('data-options').split('|');
    var items = Array.prototype.slice.call(sorter.querySelectorAll('.sort-item'));
    var status = document.createElement('p');
    status.className = 'sort-status';
    var done = 0;
    function refresh(msg){
      var all = done === items.length;
      status.textContent = msg || (done + ' / ' + items.length + " to'g'ri" + (all ? ' — barakalla!' : ''));
      status.className = 'sort-status' + (all ? ' pass' : '');
      if (all) partDone(sorter.getAttribute('data-step'), sorter.getAttribute('data-part'));
    }
    items.forEach(function(item){
      var answer = item.getAttribute('data-answer'), label = item.textContent.trim();
      var hint = item.getAttribute('data-hint') || "Yana bir o'ylab ko'ring.";
      var row = document.createElement('div');
      row.className = 'sort-row';
      row.innerHTML = img(item.getAttribute('data-img'), 'im-m') + '<span class="sort-label"></span><span class="sort-btns"></span>';
      var lab = row.querySelector('.sort-label');
      lab.textContent = label;
      var btns = row.querySelector('.sort-btns');
      opts.forEach(function(o){
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = o;
        b.addEventListener('click', function(){
          if (row.classList.contains('ok')) return;
          if (o === answer) {
            row.classList.add('ok');
            btns.querySelectorAll('button').forEach(function(x){ x.disabled = true; x.classList.remove('wrong'); });
            b.classList.add('right');
            lab.textContent = label + ' ✓';
            done++;
            refresh();
          } else {
            b.classList.add('wrong');
            refresh(label + ': ' + hint);
          }
        });
        btns.appendChild(b);
      });
      item.replaceWith(row);
    });
    sorter.appendChild(status);
    refresh();
  });

  // ---------- Quizzes ----------
  document.querySelectorAll('.quiz').forEach(function(quiz){
    var items = Array.prototype.slice.call(quiz.querySelectorAll('.qitem'));
    var pass = +quiz.getAttribute('data-pass') || items.length;
    var scoreEl = quiz.querySelector('.quiz-score');
    var answered = 0, right = 0;
    function refresh(){
      var fin = answered === items.length, ok = fin && right >= pass;
      scoreEl.textContent = "To'g'ri: " + right + ' / ' + items.length + (fin ? (ok ? ' — barakalla!' : " — yana bir urinib ko'ring") : '');
      scoreEl.className = 'quiz-score' + (ok ? ' pass' : '');
      if (ok) partDone(quiz.getAttribute('data-step'), quiz.getAttribute('data-part'));
    }
    items.forEach(function(it){
      var opts = it.querySelector('.opts'), correct = +opts.getAttribute('data-correct');
      var btns = Array.prototype.slice.call(opts.querySelectorAll('button')), ex = it.querySelector('.explain');
      btns.forEach(function(b, idx){
        b.addEventListener('click', function(){
          if (it.getAttribute('data-done')) return;
          it.setAttribute('data-done', '1');
          answered++;
          if (idx === correct) right++; else b.classList.add('wrong');
          btns[correct].classList.add('right');
          btns.forEach(function(x){ x.disabled = true; });
          if (ex) ex.hidden = false;
          refresh();
        });
      });
    });
    quiz.querySelector('.quiz-reset').addEventListener('click', function(){
      answered = 0; right = 0;
      items.forEach(function(it){
        it.removeAttribute('data-done');
        it.querySelectorAll('.opts button').forEach(function(b){ b.disabled = false; b.classList.remove('right', 'wrong'); });
        var ex = it.querySelector('.explain');
        if (ex) ex.hidden = true;
      });
      refresh();
    });
    refresh();
  });

  // ---------- Mouse lab ----------
  (function(){
    var done = {}, total = 4, status = $('m-status');
    function mark(id, el, msg){
      if (done[id]) return;
      done[id] = true;
      el.classList.add('done');
      var m = el.querySelector('.tmsg');
      if (m) m.textContent = msg || 'Bajarildi ✓';
      var n = Object.keys(done).length;
      status.textContent = n + ' / ' + total + ' bajarildi' + (n === total ? ' — sichqonchani egalladingiz!' : '');
      status.className = 'lab-status' + (n === total ? ' pass' : '');
      if (n === total) partDone('l1-step8');
    }
    var c = $('m-click'), d = $('m-dbl'), r = $('m-right');
    c.addEventListener('click', function(){ mark('c', c); });
    d.addEventListener('click', function(){ if (!done.d) d.querySelector('.tmsg').textContent = 'Tezroq: ketma-ket ikki marta'; });
    d.addEventListener('dblclick', function(){ mark('d', d); });
    r.addEventListener('contextmenu', function(e){ e.preventDefault(); mark('r', r); });
    r.addEventListener('click', function(){ if (!done.r) r.querySelector('.tmsg').textContent = "Bu chap tugma edi. O'ng tugmani bosing"; });

    var zone = $('m-zone'), tok = $('m-token'), fold = $('m-folder'), hint = $('m-zone-hint'), drag = null;
    function over(){
      var a = tok.getBoundingClientRect(), b = fold.getBoundingClientRect();
      var x = a.left + a.width / 2, y = a.top + a.height / 2;
      return x > b.left && x < b.right && y > b.top && y < b.bottom;
    }
    tok.addEventListener('pointerdown', function(e){
      if (done.z) return;
      e.preventDefault();
      var t = tok.getBoundingClientRect();
      drag = { dx: e.clientX - t.left, dy: e.clientY - t.top };
      try { tok.setPointerCapture(e.pointerId); } catch(err) {}
      tok.classList.add('dragging');
    });
    tok.addEventListener('pointermove', function(e){
      if (!drag) return;
      var z = zone.getBoundingClientRect();
      var x = Math.max(0, Math.min(z.width - tok.offsetWidth - 4, e.clientX - z.left - drag.dx));
      var y = Math.max(0, Math.min(z.height - tok.offsetHeight - 4, e.clientY - z.top - drag.dy));
      tok.style.left = x + 'px';
      tok.style.top = y + 'px';
      fold.classList.toggle('over', over());
    });
    function end(){
      if (!drag) return;
      drag = null;
      tok.classList.remove('dragging');
      fold.classList.remove('over');
      if (over()) {
        tok.hidden = true;
        $('m-folder-img').src = (window.IMGS_ALL && window.IMGS_ALL.open_file_folder) || 'media/emoji/open_file_folder.png';
        hint.textContent = 'Fayl papkaga tushdi ✓';
        mark('z', zone);
      } else {
        tok.style.left = '';
        tok.style.top = '';
        hint.textContent = "Qo'yib yubormasdan, papkaning ustigacha olib boring";
      }
    }
    tok.addEventListener('pointerup', end);
    tok.addEventListener('pointercancel', end);
  })();

  // ---------- Keyboard map ----------
  var KB_DESC = {
    esc: ['esc', 'Bekor qilish yoki chiqish. Masalan, ochilgan menyuni yopadi.'],
    tab: ['tab', "Keyingi maydonga o'tish. Kodda qator boshini surish uchun ham ishlatiladi."],
    caps: ['caps lock', "Hamma harflarni katta qilib yozishni yoqadi yoki o'chiradi."],
    shift: ['shift', 'Bosib turib harf yozsangiz, katta harf chiqadi. Tugmadagi yuqori belgini ham shu bilan yozasiz, masalan ! yoki ?'],
    control: ['control (ctrl)', "Qo'shimcha buyruqlar uchun. Mac'da kam, Windows'da juda ko'p ishlatiladi."],
    option: ['option (opt)', "Maxsus belgilar yozish uchun. Windows'da Alt deyiladi."],
    command: ['command (cmd)', "Mac'ning eng muhim tugmasi. Boshqa tugma bilan birga buyruq beradi: cmd + S saqlash, cmd + C nusxa olish. Windows'da uning o'rnida Ctrl."],
    space: ['space', "Bo'sh joy — so'zlar orasiga qo'yiladi. Eng uzun tugma."],
    'return': ['return', "Yangi qatorga o'tish yoki tasdiqlash. Windows'da Enter deyiladi."],
    'delete': ['delete', "Kursordan oldingi belgini o'chiradi. Windows'da Backspace deyiladi."],
    arrows: ['strelkalar', "Kursorni yuqoriga, pastga, chapga va o'ngga suradi."]
  };
  var U = 36;
  function letters(str){ return str.split('').map(function(ch){ return [ch, 1, 'Key' + ch]; }); }
  var ROWS = [
    { h: 0.72, keys: [['esc', 1.5, 'Escape', 'esc']].concat([1,2,3,4,5,6,7,8,9,10,11,12].map(function(n){ return ['F' + n, 1, 'F' + n]; })).concat([['', 1, '']]) },
    { keys: [['`', 1, 'Backquote']].concat('1234567890'.split('').map(function(ch){ return [ch, 1, 'Digit' + ch]; })).concat([['-', 1, 'Minus'], ['=', 1, 'Equal'], ['delete', 1.5, 'Backspace', 'delete']]) },
    { keys: [['tab', 1.5, 'Tab', 'tab']].concat(letters('QWERTYUIOP')).concat([['[', 1, 'BracketLeft'], [']', 1, 'BracketRight'], ['\\', 1, 'Backslash']]) },
    { keys: [['caps lock', 1.75, 'CapsLock', 'caps']].concat(letters('ASDFGHJKL')).concat([[';', 1, 'Semicolon'], ["'", 1, 'Quote'], ['return', 1.75, 'Enter', 'return']]) },
    { keys: [['shift', 2.25, 'ShiftLeft', 'shift']].concat(letters('ZXCVBNM')).concat([[',', 1, 'Comma'], ['.', 1, 'Period'], ['/', 1, 'Slash'], ['shift', 2.25, 'ShiftRight', 'shift']]) },
    { keys: [['fn', 1, 'Fn'], ['ctrl', 1, 'ControlLeft', 'control'], ['opt', 1, 'AltLeft', 'option'], ['cmd', 1.25, 'MetaLeft', 'command'], ['', 5, 'Space', 'space'], ['cmd', 1.25, 'MetaRight', 'command'], ['opt', 1, 'AltRight', 'option'], ['←', 1, 'ArrowLeft', 'arrows'], ['updown', 1], ['→', 1, 'ArrowRight', 'arrows']] }
  ];
  function keyG(label, x, y, w, h, code, d, small){
    var fs = small ? 10 : (label.length > 1 ? 9.5 : 13);
    var aria = label || (code === 'Space' ? 'space' : 'tugma');
    return '<g class="key' + (d ? ' imp' : '') + '" data-code="' + (code || '') + '"' +
      (d ? ' data-desc="' + d + '" tabindex="0" role="button"' : '') + ' aria-label="' + esc(aria) + '">' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5"/>' +
      (label ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + fs * 0.36).toFixed(1) + '" font-size="' + fs + '">' + esc(label) + '</text>' : '') + '</g>';
  }
  (function(){
    var svg = $('kb'), parts = [], y = 0;
    ROWS.forEach(function(row){
      var h = row.h || 1, x = 0;
      row.keys.forEach(function(k){
        var px = x * U + 2, py = y * U + 2, pw = k[1] * U - 4, ph = h * U - 4;
        if (k[0] === 'updown') {
          parts.push(keyG('↑', px, py, pw, ph / 2 - 1, 'ArrowUp', 'arrows', true));
          parts.push(keyG('↓', px, py + ph / 2 + 1, pw, ph / 2 - 1, 'ArrowDown', 'arrows', true));
        } else {
          parts.push(keyG(k[0], px, py, pw, ph, k[2], k[3]));
        }
        x += k[1];
      });
      y += h;
    });
    svg.setAttribute('viewBox', '0 0 ' + (14.5 * U) + ' ' + (y * U).toFixed(1));
    svg.innerHTML = parts.join('');
  })();
  var kbInfo = $('kb-info');
  function showDesc(g){
    var d = g.getAttribute('data-desc'), info = KB_DESC[d];
    if (!info) return;
    document.querySelectorAll('#kb .key.sel').forEach(function(k){ k.classList.remove('sel'); });
    document.querySelectorAll('#kb .key[data-desc="' + d + '"]').forEach(function(k){ k.classList.add('sel'); });
    kbInfo.innerHTML = '<p class="kb-info-title">' + esc(info[0]) + '</p><p>' + esc(info[1]) + '</p>';
  }
  $('kb').addEventListener('click', function(e){ var g = e.target.closest('.key.imp'); if (g) showDesc(g); });
  $('kb').addEventListener('keydown', function(e){
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('imp')) { e.preventDefault(); showDesc(e.target); }
  });
  function flashKey(code, cls){
    if (!code) return;
    document.querySelectorAll('#kb .key[data-code="' + code + '"]').forEach(function(k){
      k.classList.remove('good', 'bad');
      void k.getBoundingClientRect();
      k.classList.add(cls);
      setTimeout(function(){ k.classList.remove(cls); }, 700);
    });
  }
  function keyName(code){
    if (!code) return '';
    var k = document.querySelector('#kb .key[data-code="' + code + '"]');
    return k ? k.getAttribute('aria-label') : '';
  }

  // ---------- Keyboard game ----------
  (function(){
    var ROUNDS = [
      { codes: ['Enter'], text: 'return tugmasini bosing', sub: "Windows'da uni Enter deyishadi." },
      { codes: ['Space'], text: "Bo'sh joy (space) tugmasini bosing", sub: 'Eng uzun tugma.' },
      { codes: ['Backspace'], text: 'delete tugmasini bosing', sub: "Windows'da Backspace. Yozilgan harfni o'chiradi." },
      { codes: ['ShiftLeft', 'ShiftRight'], text: 'shift tugmasini bosing', sub: "Ikkitasi bor, qaysi biri bo'lsa ham bo'ladi." },
      { codes: ['Tab'], text: 'tab tugmasini bosing', sub: 'Chap tomonda, Q harfining yonida.' },
      { codes: ['Escape'], text: 'esc tugmasini bosing', sub: 'Eng chap yuqori burchakda.' },
      { codes: ['MetaLeft', 'MetaRight'], text: 'command (cmd) tugmasini bosing', sub: "Bo'sh joy tugmasining ikki yonida." },
      { codes: ['KeyA'], shift: true, text: 'Katta A harfini yozing', sub: 'shift ni bosib turib, A ni bosing.' }
    ];
    var MODS = { ShiftLeft: 1, ShiftRight: 1, MetaLeft: 1, MetaRight: 1, AltLeft: 1, AltRight: 1, ControlLeft: 1, ControlRight: 1 };
    var kg = $('kgame'), promptEl = $('kg-prompt'), sub = $('kg-sub'), start = $('kg-start'), help = $('kg-help'), prog = $('kg-progress');
    var round = 0, live = false, busy = false;
    function clearHints(){ document.querySelectorAll('#kb .key.hint').forEach(function(k){ k.classList.remove('hint'); }); }
    function setRound(i){
      round = i; busy = false;
      var r = ROUNDS[i];
      promptEl.textContent = r.text;
      sub.textContent = r.sub;
      sub.className = 'kgame-sub';
      prog.textContent = (i + 1) + ' / ' + ROUNDS.length;
      clearHints();
    }
    start.addEventListener('click', function(){
      live = true;
      kg.classList.add('live');
      help.hidden = false;
      start.hidden = true;
      setRound(0);
      kg.focus();
    });
    help.addEventListener('click', function(){
      var r = ROUNDS[round];
      r.codes.concat(r.shift ? ['ShiftLeft', 'ShiftRight'] : []).forEach(function(code){
        document.querySelectorAll('#kb .key[data-code="' + code + '"]').forEach(function(k){ k.classList.add('hint'); });
      });
      kg.focus();
    });
    kg.addEventListener('click', function(e){ if (live && !e.target.closest('button')) kg.focus(); });
    kg.addEventListener('blur', function(){
      if (live) { sub.textContent = "O'yin to'xtab turibdi. Davom etish uchun shu oynani bosing."; sub.className = 'kgame-sub'; }
    });
    kg.addEventListener('focus', function(){
      if (live && !busy) { sub.textContent = ROUNDS[round].sub; sub.className = 'kgame-sub'; }
    });
    kg.addEventListener('keydown', function(e){
      if (!live) return;
      e.preventDefault();
      if (e.repeat || busy) return;
      var r = ROUNDS[round];
      if (r.codes.indexOf(e.code) !== -1 && (!r.shift || e.shiftKey)) {
        busy = true;
        flashKey(e.code, 'good');
        sub.textContent = "To'g'ri!";
        sub.className = 'kgame-sub good';
        var next = round + 1;
        if (next < ROUNDS.length) {
          setTimeout(function(){ setRound(next); }, 650);
        } else {
          live = false;
          kg.classList.remove('live');
          clearHints();
          promptEl.textContent = 'Barakalla! 8 tadan 8 ta.';
          sub.textContent = 'Endi bu tugmalar qayerdaligini bilasiz.';
          help.hidden = true;
          start.hidden = false;
          start.textContent = "Qayta o'ynash";
          prog.textContent = '';
          partDone('l1-step9');
        }
      } else {
        if (r.shift && MODS[e.code]) return;
        flashKey(e.code, 'bad');
        var name = keyName(e.code);
        sub.textContent = (name ? name + ' — bu boshqa tugma. ' : 'Bu boshqa tugma. ') + "Yana urinib ko'ring.";
        sub.className = 'kgame-sub bad';
      }
    });
  })();

  // ---------- Typing ----------
  (function(){
    var LINES = [['t1', 'salom'], ['t2', 'Salom, dunyo!'], ['t3', "Men dasturchi bo'laman."]];
    var ok = {};
    LINES.forEach(function(t){
      var target = t[1], box = $(t[0] + '-target'), inp = $(t[0] + '-input'), st = $(t[0] + '-status');
      function render(){
        var v = inp.value.replace(/[‘’ʼ`]/g, "'");
        var html = '', bad = -1;
        for (var i = 0; i < target.length; i++) {
          var ch = target[i], cls = 'c';
          if (i < v.length) { cls = v[i] === ch ? 'ok' : 'no'; if (cls === 'no' && bad < 0) bad = i; }
          else if (i === v.length) cls = 'c cur';
          html += '<span class="' + cls + '">' + (ch === ' ' ? '&nbsp;' : esc(ch)) + '</span>';
        }
        box.innerHTML = html;
        var done = v === target;
        inp.classList.toggle('ok', done);
        st.className = 'type-status' + (done ? ' ok' : '');
        if (done) {
          st.textContent = "To'g'ri yozildi ✓";
          ok[t[0]] = true;
          if (Object.keys(ok).length === LINES.length) partDone('l1-step10');
        }
        else if (!v) st.textContent = 'Shu qatorni pastdagi maydonga yozing.';
        else if (bad >= 0) st.textContent = "Qizil harfni delete bilan o'chirib, qayta yozing.";
        else if (v.length > target.length) st.textContent = "Ortiqcha belgi bor — delete bilan o'chiring.";
        else st.textContent = 'Davom eting...';
      }
      inp.addEventListener('input', render);
      render();
    });
  })();

  // ---------- Path check ----------
  (function(){
    var inp = $('path-input'), fb = $('path-fb');
    function check(){
      var v = inp.value.toLowerCase().replace(/\s+/g, '').replace(/[›>\\\/»|]+/g, '/').replace(/^\/+|\/+$/g, '');
      if (v === 'documents/rasmlar/oila.jpg') { fb.textContent = "To'g'ri! Katta papkadan kichigiga qarab bordingiz."; fb.className = 'fb good'; partDone('l1-step12', 'path'); }
      else if (!v) { fb.textContent = 'Avval manzilni yozing.'; fb.className = 'fb'; }
      else if (v.indexOf('oila') === 0) { fb.textContent = 'Teskari yozdingiz: manzil eng katta papkadan boshlanadi.'; fb.className = 'fb bad'; }
      else if (v.indexOf('darslar') !== -1) { fb.textContent = 'oila.jpg Darslar ichida emas. Rasmda u qaysi papka ichida turibdi?'; fb.className = 'fb bad'; }
      else { fb.textContent = 'Deyarli. Shu tartibda yozing: Documents › ... › oila.jpg'; fb.className = 'fb bad'; }
    }
    $('path-check').addEventListener('click', check);
    inp.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); check(); } });
  })();

  // ---------- Order game ----------
  (function(){
    var STEPS = ["Kalitni cho'ntakdan oling", 'Kalitni qulfga soling', 'Kalitni buring', 'Eshikni oching', 'Ichkariga kiring', 'Eshikni yoping'];
    var pool = $('og-pool'), res = $('og-result'), msg = $('og-msg'), next = 0;
    function start(){
      next = 0;
      res.innerHTML = '';
      msg.textContent = '';
      msg.className = 'og-msg';
      pool.innerHTML = '';
      var order;
      do { order = shuffle(STEPS.map(function(s, i){ return i; })); } while (order.join() === '0,1,2,3,4,5');
      order.forEach(function(i){
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = STEPS[i];
        b.addEventListener('click', function(){
          if (i === next) {
            var li = document.createElement('li');
            li.textContent = STEPS[i];
            res.appendChild(li);
            b.remove();
            next++;
            if (next === STEPS.length) { msg.textContent = "Zo'r! Algoritm to'g'ri. Bitta qadam joyidan siljisa, eshik ochilmasdi."; msg.className = 'og-msg good'; partDone('l1-step15', 'og'); }
            else { msg.textContent = "To'g'ri. Keyingisi qaysi?"; msg.className = 'og-msg'; }
          } else {
            b.classList.remove('shake');
            void b.offsetWidth;
            b.classList.add('shake');
            msg.textContent = 'Hali erta. Bundan oldin nima qilish kerak?';
            msg.className = 'og-msg bad';
          }
        });
        pool.appendChild(b);
      });
    }
    $('og-reset').addEventListener('click', start);
    start();
  })();

  // ---------- Word game ----------
  (function(){
    var POOL = WORDS.devices.concat(WORDS.actions, WORDS.files);
    var CONFUSE = [['computer', 'screen', 'laptop'], ['copy', 'paste'], ['input', 'output'], ['type', 'keyboard'], ['file', 'folder'], ['click', 'select']];
    function confusable(a, b){ return CONFUSE.some(function(g){ return g.indexOf(a) !== -1 && g.indexOf(b) !== -1; }); }
    var rounds = [], i = 0, score = 0, answered = false, finished = false;
    var pic = $('wg-pic'), q = $('wg-q'), opts = $('wg-opts'), msg = $('wg-msg'), nextBtn = $('wg-next');
    function begin(){
      rounds = shuffle(POOL).slice(0, 10);
      i = 0; score = 0; finished = false;
      pic.hidden = false;
      q.textContent = 'Bu rasm inglizcha qanday ataladi?';
      show();
    }
    function show(){
      var w = rounds[i];
      answered = false;
      $('wg-round').textContent = (i + 1) + ' / 10';
      $('wg-score').textContent = "To'g'ri: " + score;
      pic.innerHTML = img(w[3]);
      var others = shuffle(POOL.filter(function(x){ return x[0] !== w[0] && !confusable(x[0], w[0]); })).slice(0, 2);
      opts.innerHTML = '';
      shuffle([w].concat(others)).forEach(function(o){
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = o[0];
        b.addEventListener('click', function(){
          if (answered) return;
          answered = true;
          var good = o[0] === w[0];
          if (good) score++;
          opts.querySelectorAll('button').forEach(function(x){ x.disabled = true; if (x.textContent === w[0]) x.classList.add('right'); });
          if (!good) b.classList.add('wrong');
          msg.textContent = (good ? "To'g'ri! " : 'Bu — ') + w[0] + ' = ' + w[2];
          $('wg-score').textContent = "To'g'ri: " + score;
          say(w[0]);
          nextBtn.hidden = false;
          nextBtn.textContent = i < 9 ? 'Keyingisi' : "Natijani ko'rish";
        });
        opts.appendChild(b);
      });
      msg.textContent = '';
      nextBtn.hidden = true;
    }
    nextBtn.addEventListener('click', function(){
      if (finished) { begin(); return; }
      if (i < 9) { i++; show(); return; }
      finished = true;
      pic.hidden = true;
      opts.innerHTML = '';
      q.textContent = 'Natija: ' + score + ' / 10';
      if (score >= 7) { msg.textContent = "Barakalla! So'zlarni yaxshi eslab qolibsiz."; partDone('l1-step18'); }
      else msg.textContent = "7 ta va undan ko'p to'plasangiz, qadam bajariladi. Yana bir bor!";
      nextBtn.textContent = "Qayta o'ynash";
    });
    begin();
  })();

  // ---------- Lesson 2 playground ----------
  (function(){
    var DEFAULT_CODE = '<h1>Salom, dunyo!</h1>\n<p>Bu mening birinchi sahifam.</p>';
    var ALLOWED = { H1:1, H2:1, H3:1, H4:1, H5:1, H6:1, P:1, B:1, STRONG:1, I:1, EM:1, BR:1, HR:1, UL:1, OL:1, LI:1 };
    var play = $('l2-play'), preview = $('l2-preview'), reset = $('l2-reset');
    if (!play) return;
    function copySafe(src, dest){
      Array.prototype.forEach.call(src.childNodes, function(node){
        if (node.nodeType === 3) dest.appendChild(document.createTextNode(node.nodeValue));
        else if (node.nodeType === 1) {
          if (ALLOWED[node.tagName]) { var el = document.createElement(node.tagName.toLowerCase()); copySafe(node, el); dest.appendChild(el); }
          else copySafe(node, dest);
        }
      });
    }
    function render(){
      preview.textContent = '';
      copySafe(new DOMParser().parseFromString(play.value, 'text/html').body, preview);
      if (!preview.textContent.trim()) {
        var hint = document.createElement('p');
        hint.className = 'preview-empty';
        hint.textContent = "Sahifangiz shu yerda ko'rinadi.";
        preview.appendChild(hint);
      }
    }
    play.value = typeof states[2].playCode === 'string' ? states[2].playCode : DEFAULT_CODE;
    play.addEventListener('input', function(){ states[2].playCode = play.value; store(keys[2], states[2]); render(); });
    reset.addEventListener('click', function(){ play.value = DEFAULT_CODE; states[2].playCode = DEFAULT_CODE; store(keys[2], states[2]); render(); play.focus(); });
    render();
  })();

  // ---------- Lesson 3 playground ----------
  (function(){
    var DEFAULT_CODE = '<h2>Qiziqishlarim</h2>\n<ul>\n  <li>Dasturlash</li>\n  <li>Kitob</li>\n</ul>\n<p>Birinchi sayt: <a href="https://info.cern.ch">info.cern.ch</a></p>\n<hr>\n<p>Bu <strong>muhim</strong>, bu esa <em>urg\'u</em>.</p>\n<img src="mushuk-yoq.jpg" alt="Deraza oldida uxlayotgan kulrang mushuk">';
    var ALLOWED = { H1:1, H2:1, H3:1, H4:1, H5:1, H6:1, P:1, B:1, STRONG:1, I:1, EM:1, BR:1, HR:1, UL:1, OL:1, LI:1, A:1, IMG:1 };
    var play = $('l3-play'), preview = $('l3-preview'), reset = $('l3-reset');
    if (!play) return;
    function copySafe(src, dest){
      Array.prototype.forEach.call(src.childNodes, function(node){
        if (node.nodeType === 3) dest.appendChild(document.createTextNode(node.nodeValue));
        else if (node.nodeType === 1) {
          if (!ALLOWED[node.tagName]) { copySafe(node, dest); return; }
          var el = document.createElement(node.tagName.toLowerCase());
          if (node.tagName === 'A') {
            var href = (node.getAttribute('href') || '').trim();
            if (/^https?:\/\//i.test(href)) { el.href = href; el.target = '_blank'; el.rel = 'noopener'; }
            else { el.href = '#'; el.setAttribute('data-rel', href); el.title = 'Nisbiy manzil: brauzer "' + href + '" faylini sizning papkangizdan qidiradi'; }
          }
          if (node.tagName === 'IMG') {
            var srcv = (node.getAttribute('src') || '').trim();
            if (/^(https?:\/\/[^\s"]+|[\w\-.\/]+)$/i.test(srcv)) el.setAttribute('src', srcv);
            el.setAttribute('alt', node.getAttribute('alt') || '');
            var w = parseInt(node.getAttribute('width'), 10);
            if (w > 0 && w < 2000) el.setAttribute('width', String(w));
          }
          copySafe(node, el);
          dest.appendChild(el);
        }
      });
    }
    function render(){
      preview.textContent = '';
      copySafe(new DOMParser().parseFromString(play.value, 'text/html').body, preview);
      if (!preview.textContent.trim() && !preview.querySelector('img,hr')) {
        var hint = document.createElement('p');
        hint.className = 'preview-empty';
        hint.textContent = "Sahifangiz shu yerda ko'rinadi.";
        preview.appendChild(hint);
      }
    }
    preview.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[data-rel]');
      if (!a) return;
      e.preventDefault();
      alert((window.i18nT || String)('Bu nisbiy manzil: "' + a.getAttribute('data-rel') + '".\nBrauzer uni internetdan emas, sahifa turgan papkadan qidiradi.'));
    });
    play.value = typeof states[3].playCode === 'string' ? states[3].playCode : DEFAULT_CODE;
    play.addEventListener('input', function(){ states[3].playCode = play.value; store(keys[3], states[3]); render(); });
    reset.addEventListener('click', function(){ play.value = DEFAULT_CODE; states[3].playCode = DEFAULT_CODE; store(keys[3], states[3]); render(); play.focus(); });
    render();
  })();

  // ---------- Lesson 4: forma yuborish namoyishi ----------
  function l4Lang(uz, en){ return document.documentElement.lang === 'en' ? en : uz; }
  function sentBox(box, emptyUz, emptyEn){
    if (!box) return null;
    var body = document.createElement('div');
    body.className = 'sent-body';
    body.setAttribute('data-no-i18n', '');
    box.querySelectorAll('.sent-empty').forEach(function(p){ p.remove(); });
    box.appendChild(body);
    var st = null;
    function fieldName(el){
      var lab = el.id && document.querySelector('label[for="' + el.id + '"]');
      if (!lab && el.closest) lab = el.closest('label');
      return ((lab && lab.textContent) || el.name || el.type || '').replace(/:\s*$/, '').trim();
    }
    function render(){
      box.classList.toggle('bad', !!(st && st.kind === 'invalid'));
      if (!st) { body.innerHTML = '<p class="sent-empty">' + esc(l4Lang(emptyUz, emptyEn)) + '</p>'; return; }
      if (st.kind === 'invalid') {
        var n = fieldName(st.el);
        body.innerHTML = '<p class="sent-empty">' + esc(st.missing
          ? l4Lang('Brauzer formani yubormadi: "' + n + '" maydoni majburiy (required), lekin bo\'sh.', 'The browser did not send the form: the "' + n + '" field is required, but it is empty.')
          : l4Lang('Brauzer formani yubormadi: "' + n + '" maydoni noto\'g\'ri to\'ldirilgan (masalan, emailda @ yo\'q).', 'The browser did not send the form: the "' + n + '" field is filled in incorrectly (for example, the email has no @).')) + '</p>';
        return;
      }
      if (!st.pairs.length) { body.innerHTML = '<p class="sent-empty">' + esc(l4Lang("Forma yuborildi, lekin birorta maydonda name yo'q — serverga hech narsa bormadi.", 'The form was sent, but no field has a name — nothing reached the server.')) + '</p>'; return; }
      var q = st.pairs.map(function(p){ return encodeURIComponent(p[0]) + '=' + encodeURIComponent(p[1]); }).join('&');
      body.innerHTML = '<div class="sent-pairs">' + st.pairs.map(function(p){ return '<code>' + esc(p[0]) + '=' + esc(p[1]) + '</code>'; }).join('') + '</div>' +
        '<p class="sent-url">' + esc(l4Lang('Manzil qatorida shunday ko\'rinadi: ', 'In the address bar it looks like this: ')) + esc(st.page + '?' + q) + '</p>';
    }
    render();
    document.addEventListener('i18n:change', render);
    return {
      sent: function(form, page){
        var pairs = [];
        Array.prototype.forEach.call(form.elements, function(el){
          if (!el.name || el.disabled || /^(submit|button|reset)$/.test(el.type)) return;
          if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
          if (el.tagName === 'SELECT') { if (el.selectedIndex >= 0) pairs.push([el.name, el.options[el.selectedIndex].value]); return; }
          pairs.push([el.name, el.value]);
        });
        st = { kind: 'ok', pairs: pairs, page: page };
        render();
        box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash');
      },
      invalid: function(el){ st = { kind: 'invalid', el: el, missing: el.validity && el.validity.valueMissing }; render(); }
    };
  }
  (function(){
    var form = $('l4-demo-form');
    if (!form) return;
    var box = sentBox($('l4-demo-out'), 'Hali hech narsa yuborilmadi.', 'Nothing has been sent yet.');
    var lastInvalid = 0;
    form.addEventListener('submit', function(e){ e.preventDefault(); box.sent(form, 'aloqa.html'); });
    form.addEventListener('invalid', function(e){ var now = Date.now(); if (now - lastInvalid < 50) return; lastInvalid = now; box.invalid(e.target); }, true);
  })();

  // ---------- Lesson 4 playground ----------
  (function(){
    var DEFAULT_CODE = '<table border="1">\n  <caption>Narxlar</caption>\n  <tr>\n    <th>Mahsulot</th>\n    <th>Narx (1 kg)</th>\n  </tr>\n  <tr>\n    <td>Olma</td>\n    <td>12 000</td>\n  </tr>\n  <tr>\n    <td>Nok</td>\n    <td>15 000</td>\n  </tr>\n</table>\n\n<form>\n  <p>\n    <label for="ism">Ismingiz:</label>\n    <input type="text" id="ism" name="ism" required>\n  </p>\n  <p>\n    <label><input type="radio" name="kurs" value="frontend"> Frontend</label>\n    <label><input type="radio" name="kurs" value="backend"> Backend</label>\n  </p>\n  <button>Yuborish</button>\n</form>';
    var ALLOWED = { H1:1, H2:1, H3:1, H4:1, H5:1, H6:1, P:1, B:1, STRONG:1, I:1, EM:1, BR:1, HR:1, UL:1, OL:1, LI:1, A:1,
      TABLE:1, CAPTION:1, THEAD:1, TBODY:1, TFOOT:1, TR:1, TH:1, TD:1, FORM:1, LABEL:1, INPUT:1, BUTTON:1, SELECT:1, OPTION:1, TEXTAREA:1, FIELDSET:1, LEGEND:1 };
    var ATTRS = { TABLE: ['border'], TH: ['colspan', 'rowspan'], TD: ['colspan', 'rowspan'], LABEL: ['for'], INPUT: ['type', 'name', 'value', 'placeholder', 'required', 'checked', 'min', 'max', 'id'],
      BUTTON: ['type'], SELECT: ['name', 'id', 'required'], OPTION: ['value', 'selected'], TEXTAREA: ['name', 'id', 'placeholder', 'required', 'rows', 'cols'] };
    var TYPES = /^(text|email|password|number|checkbox|radio|date|color|range|tel|url|search|submit|reset|button)$/i;
    var play = $('l4-play'), preview = $('l4-preview'), reset = $('l4-reset');
    if (!play) return;
    var box = sentBox($('l4-sent'), 'Formadagi tugmani bosing.', 'Press the button in the form.');
    function copySafe(src, dest){
      Array.prototype.forEach.call(src.childNodes, function(node){
        if (node.nodeType === 3) dest.appendChild(document.createTextNode(node.nodeValue));
        else if (node.nodeType === 1) {
          if (!ALLOWED[node.tagName]) { copySafe(node, dest); return; }
          var el = document.createElement(node.tagName.toLowerCase());
          (ATTRS[node.tagName] || []).forEach(function(a){
            if (!node.hasAttribute(a)) return;
            var v = node.getAttribute(a).slice(0, 200);
            if (a === 'type' && node.tagName === 'INPUT' && !TYPES.test(v)) return;
            if (a === 'id' || a === 'for') v = 'l4pv-' + v.replace(/[^\w-]/g, '_');
            el.setAttribute(a, v);
          });
          if (node.tagName === 'A') {
            var href = (node.getAttribute('href') || '').trim();
            if (/^https?:\/\//i.test(href)) { el.href = href; el.target = '_blank'; el.rel = 'noopener'; } else el.href = '#';
          }
          if (node.tagName === 'TEXTAREA') { el.value = node.textContent; return dest.appendChild(el); }
          copySafe(node, el);
          dest.appendChild(el);
        }
      });
    }
    function render(){
      preview.textContent = '';
      copySafe(new DOMParser().parseFromString(play.value, 'text/html').body, preview);
      if (!preview.textContent.trim() && !preview.querySelector('input,select,textarea,hr,table')) {
        var hint = document.createElement('p');
        hint.className = 'preview-empty';
        hint.textContent = "Sahifangiz shu yerda ko'rinadi.";
        preview.appendChild(hint);
      }
    }
    var lastInvalid = 0;
    preview.addEventListener('submit', function(e){ e.preventDefault(); box.sent(e.target, 'aloqa.html'); });
    preview.addEventListener('invalid', function(e){ var now = Date.now(); if (now - lastInvalid < 50) return; lastInvalid = now; box.invalid(e.target); }, true);
    preview.addEventListener('click', function(e){ var a = e.target.closest && e.target.closest('a[href="#"]'); if (a) e.preventDefault(); });
    play.value = typeof states[4].playCode === 'string' ? states[4].playCode : DEFAULT_CODE;
    play.addEventListener('input', function(){ states[4].playCode = play.value; store(keys[4], states[4]); render(); });
    reset.addEventListener('click', function(){ play.value = DEFAULT_CODE; states[4].playCode = DEFAULT_CODE; store(keys[4], states[4]); render(); play.focus(); });
    render();
  })();

  // ---------- Lesson 5–6: iframe ichidagi xavfsiz natija ----------
  function cssPlayground(n, defaultCode, onRender){
    var play = $('l' + n + '-play'), frame = $('l' + n + '-frame'), reset = $('l' + n + '-reset');
    if (!play || !frame) return null;
    var t = null;
    function render(){
      frame.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><style>body{margin:8px;font-family:"Times New Roman",serif;}<\/style><\/head><body>' + play.value + '<\/body><\/html>';
      if (onRender) onRender();
    }
    var s = states[n];
    play.value = typeof s.playCode === 'string' ? s.playCode : defaultCode;
    play.addEventListener('input', function(){
      s.playCode = play.value; store(keys[n], s);
      clearTimeout(t); t = setTimeout(render, 250);
    });
    reset.addEventListener('click', function(){ play.value = defaultCode; s.playCode = defaultCode; store(keys[n], s); render(); play.focus(); });
    render();
    return { render: render };
  }

  cssPlayground(5, '<style>\n  body {\n    font-family: Arial, sans-serif;\n    background-color: #FFF8E7;\n    line-height: 1.6;\n  }\n  h1 {\n    color: #B4650A;\n    text-align: center;\n  }\n  .karta {\n    background-color: white;\n    padding: 16px;\n    border: 2px solid #F0B429;\n    border-radius: 12px;\n    margin-bottom: 12px;\n  }\n  #muhim {\n    color: crimson;\n    font-weight: bold;\n  }\n</style>\n\n<h1>Mening sahifam</h1>\n<div class="karta">\n  <p>Men frontend dasturchi bo\'lyapman.</p>\n</div>\n<p id="muhim">Bugun CSS\'ni o\'rgandim!</p>');

  // ---------- Lesson 5: CSS'ni yoqish/o'chirish ----------
  (function(){
    var mini = $('l5-mini'), btn = $('l5-onoff-btn'), st = $('l5-onoff-st');
    if (!mini) return;
    function draw(){
      var on = mini.classList.contains('styled');
      btn.textContent = on ? l4Lang("CSS'ni o'chirish", 'Turn CSS off') : l4Lang("CSS'ni yoqish", 'Turn CSS on');
      st.textContent = on ? l4Lang('Hozir: HTML + CSS', 'Now: HTML + CSS') : l4Lang('Hozir: faqat HTML', 'Now: HTML only');
    }
    btn.addEventListener('click', function(){ mini.classList.toggle('styled'); draw(); });
    document.addEventListener('i18n:change', draw);
    draw();
  })();

  // ---------- Lesson 5: rang laboratoriyasi ----------
  (function(){
    var fg = $('l5-c-fg'), bg = $('l5-c-bg'), sample = $('l5-c-sample'), code = $('l5-c-code'), note = $('l5-c-note');
    if (!fg) return;
    function rgb(h){ h = h.replace('#', ''); return [0, 2, 4].map(function(i){ return parseInt(h.substr(i, 2), 16); }); }
    function lum(c){ return c.map(function(v){ v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce(function(a, v, i){ return a + v * [0.2126, 0.7152, 0.0722][i]; }, 0); }
    function draw(){
      var a = rgb(fg.value), b = rgb(bg.value);
      sample.style.color = fg.value; sample.style.backgroundColor = bg.value;
      code.textContent = 'color: ' + fg.value.toUpperCase() + ';            /* rgb(' + a.join(', ') + ') */\nbackground-color: ' + bg.value.toUpperCase() + '; /* rgb(' + b.join(', ') + ') */';
      var la = lum(a), lb = lum(b), r = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05), rs = r.toFixed(1);
      if (r >= 4.5) { note.textContent = l4Lang('Kontrast ' + rs + ' : 1 — yaxshi o\'qiladi.', 'Contrast ' + rs + ' : 1 — easy to read.'); note.className = 'lab-status pass'; }
      else if (r >= 3) { note.textContent = l4Lang('Kontrast ' + rs + ' : 1 — faqat katta sarlavhalar uchun yetarli.', 'Contrast ' + rs + ' : 1 — only enough for large headings.'); note.className = 'lab-status'; }
      else { note.textContent = l4Lang('Kontrast ' + rs + ' : 1 — o\'qish qiyin! Ranglarni bir-biridan uzoqroq tanlang.', 'Contrast ' + rs + ' : 1 — hard to read! Pick colors further apart.'); note.className = 'lab-status bad'; }
    }
    fg.addEventListener('input', draw); bg.addEventListener('input', draw);
    document.addEventListener('i18n:change', draw);
    draw();
  })();

  // ---------- Lesson 5: quti modeli ----------
  (function(){
    var lab = $('l5-box');
    if (!lab) return;
    var mar = lab.querySelector('.bl-margin'), box = lab.querySelector('.bl-box'), code = $('l5-box-code');
    var ins = {};
    lab.querySelectorAll('input[data-p]').forEach(function(i){ ins[i.getAttribute('data-p')] = i; i.addEventListener('input', draw); });
    function v(k){ return +ins[k].value; }
    function draw(){
      Object.keys(ins).forEach(function(k){ lab.querySelector('[data-v="' + k + '"]').textContent = v(k) + 'px'; });
      mar.style.padding = v('mar') + 'px';
      box.style.padding = Math.max(v('pad'), 14) + 'px ' + v('pad') + 'px ' + v('pad') + 'px';
      box.style.borderWidth = v('bor') + 'px';
      box.style.borderRadius = v('rad') + 'px';
      mar.style.borderRadius = (v('rad') + v('mar') / 2) + 'px';
      code.textContent = '.karta {\n  padding: ' + v('pad') + 'px;\n  border: ' + v('bor') + 'px solid #F0B429;\n  margin: ' + v('mar') + 'px;\n  border-radius: ' + v('rad') + 'px;\n}';
    }
    draw();
  })();

  // ---------- Lesson 6: Flexbox laboratoriyasi ----------
  (function(){
    var lab = $('l6-flex');
    if (!lab) return;
    var stage = $('l6-flex-stage'), code = $('l6-flex-code'), gap = $('l6-flex-gap'), gapv = $('l6-flex-gapv');
    var P = { 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'stretch', 'flex-wrap': 'nowrap' };
    var s = states[6]; s.flexTasks = s.flexTasks || {};
    var tasks = {
      center: function(){ return P['justify-content'] === 'center' && P['align-items'] === 'center'; },
      between: function(){ return P['flex-direction'] === 'row' && P['justify-content'] === 'space-between'; },
      column: function(){ return P['flex-direction'] === 'column' && P['align-items'] === 'flex-end'; }
    };
    function draw(){
      Object.keys(P).forEach(function(k){ stage.style.setProperty(k, P[k]); });
      stage.style.gap = gap.value + 'px'; gapv.textContent = gap.value + 'px';
      code.textContent = '.konteyner {\n  display: flex;\n' + Object.keys(P).map(function(k){ return '  ' + k + ': ' + P[k] + ';'; }).join('\n') + '\n  gap: ' + gap.value + 'px;\n}';
      Object.keys(tasks).forEach(function(k){ if (tasks[k]()) s.flexTasks[k] = true; });
      store(keys[6], s);
      var all = true;
      lab.querySelectorAll('[data-task]').forEach(function(cb){
        var ok = !!s.flexTasks[cb.getAttribute('data-task')];
        cb.checked = ok; cb.closest('label').classList.toggle('ok', ok);
        if (!ok) all = false;
      });
      if (all) partDone('l6-step7');
    }
    lab.querySelectorAll('.seg-btns[data-prop]').forEach(function(g){
      var prop = g.getAttribute('data-prop');
      g.querySelectorAll('button').forEach(function(b){
        b.addEventListener('click', function(){
          P[prop] = b.getAttribute('data-v');
          g.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          draw();
        });
      });
    });
    gap.addEventListener('input', draw);
    draw();
  })();

  // ---------- Lesson 6: mashq maydoni va ekran o'lchami ----------
  (function(){
    var fit = $('l6-fit'), frame = $('l6-frame'), addr = $('l6-addr'), sizes = $('l6-sizes');
    if (!fit) return;
    var W = 375;
    function layout(){
      var cw = fit.clientWidth;
      if (!cw) return;
      var sc = Math.min(1, cw / W);
      frame.style.width = W + 'px';
      frame.style.height = (fit.clientHeight / sc) + 'px';
      frame.style.transform = 'scale(' + sc + ')';
      addr.textContent = 'index.html · ' + W + 'px';
    }
    sizes.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){
        W = +b.getAttribute('data-w');
        sizes.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        layout();
      });
    });
    if (window.ResizeObserver) new ResizeObserver(layout).observe(fit); else window.addEventListener('resize', layout);
    cssPlayground(6, '<style>\n  * { box-sizing: border-box; }\n  body { font-family: Arial, sans-serif; margin: 0; background: #F7F8FA; color: #1C2333; }\n  .sarlavha {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 12px 16px;\n    background: #1C2333;\n    color: white;\n  }\n  .sarlavha h1 { font-size: 20px; margin: 0; }\n  nav { display: flex; gap: 12px; }\n  nav a { color: #F5B942; }\n  main { max-width: 900px; margin: 0 auto; padding: 16px; }\n  .kartalar {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 12px;\n  }\n  .karta {\n    flex: 1 1 200px;\n    background: white;\n    border: 1px solid #E2E5EA;\n    border-radius: 12px;\n    padding: 14px;\n  }\n  @media (max-width: 600px) {\n    .sarlavha { flex-direction: column; align-items: flex-start; gap: 6px; }\n  }\n</style>\n\n<header class="sarlavha">\n  <h1>Ali Valiyev</h1>\n  <nav>\n    <a href="#">Bosh sahifa</a>\n    <a href="#">Aloqa</a>\n  </nav>\n</header>\n<main>\n  <h2>Nimalarni o\'rgandim</h2>\n  <div class="kartalar">\n    <div class="karta"><h3>HTML</h3><p>Teglar va jadvallar</p></div>\n    <div class="karta"><h3>CSS</h3><p>Ranglar va qutilar</p></div>\n    <div class="karta"><h3>Flexbox</h3><p>Joylashuv</p></div>\n  </div>\n</main>', layout);
    layout();
  })();

  // ---------- Lesson 7: Git simulyatori ----------
  (function(){
    var inp = $('l7-git-in');
    if (!inp) return;
    var out = $('l7-git-out'), log = $('l7-git-log'), tasksEl = $('l7-git-tasks');
    var CONTENT = {
      'index.html': ['<h1>Salom</h1>', '<h1>Salom, dunyo!</h1>', '<h1>Salom, dunyo!</h1>\n<p>Men dasturchi bo\'laman.</p>', '<h1>Salom, dunyo!</h1>\n<p>Men frontend dasturchi bo\'laman.</p>'],
      'style.css': ['h1 { color: black; }', 'h1 { color: orange; }', 'h1 { color: orange; }\nbody { font-family: Arial; }', 'h1 { color: #B4650A; }\nbody { font-family: Arial; }']
    };
    var NAMES = Object.keys(CONTENT);
    var S = { init: false, ver: { 'index.html': 0, 'style.css': 0 }, saved: {}, staged: {}, commits: [] };
    var done = {}, hist = [], hi = 0;
    function print(t, cls){ out.innerHTML += (cls ? '<span class="' + cls + '">' + esc(t) + '</span>' : esc(t)) + '\n'; out.scrollTop = out.scrollHeight; }
    function hash(){ var h = ''; for (var i = 0; i < 7; i++) h += '0123456789abcdef'[Math.floor(Math.random() * 16)]; return h; }
    function state(f){
      if (S.staged[f] === S.ver[f]) return 'staged';
      if (!(f in S.saved)) return 'new';
      return S.saved[f] === S.ver[f] ? 'ok' : 'mod';
    }
    function render(){
      var LBL = { 'new': l4Lang('yangi', 'new'), mod: l4Lang("o'zgargan", 'modified'), ok: l4Lang("o'zgarishsiz", 'unchanged'), staged: l4Lang('tayyor', 'staged') };
      $('l7-git-work').innerHTML = NAMES.map(function(f){ var st = state(f); return '<div class="gs-file ' + (st === 'staged' ? 'ok' : st) + '"><span>' + esc(f) + '</span><em>' + esc(st === 'staged' ? LBL.ok : LBL[st]) + '</em></div>'; }).join('');
      var staged = NAMES.filter(function(f){ return f in S.staged; });
      $('l7-git-stage').innerHTML = staged.length ? staged.map(function(f){ return '<div class="gs-file ok"><span>' + esc(f) + '</span><em>' + esc(LBL.staged) + '</em></div>'; }).join('') : '<span class="gs-empty">' + esc(l4Lang("bo'sh", 'empty')) + '</span>';
      $('l7-git-repo').innerHTML = !S.init ? '<span class="gs-empty">' + esc(l4Lang("Git hali yoqilmagan", 'Git is not initialized yet')) + '</span>'
        : S.commits.length ? S.commits.slice().reverse().map(function(c){ return '<div class="gs-commit"><b>' + c.hash + '</b>' + esc(c.msg) + '</div>'; }).join('') : '<span class="gs-empty">' + esc(l4Lang("hali commit yo'q", 'no commits yet')) + '</span>';
      tasksEl.querySelectorAll('[data-task]').forEach(function(cb){ var ok = !!done[cb.getAttribute('data-task')]; cb.checked = ok; cb.closest('label').classList.toggle('ok', ok); });
      var n = Object.keys(done).length;
      if (n === 4) { log.textContent = l4Lang("Barakalla! Siz Git'ning asosiy siklini o'tdingiz: tahrirlash → add → commit → log. Endi xuddi shuni haqiqiy terminalda qiling.", 'Well done! You went through the core Git cycle: edit → add → commit → log. Now do the same in a real terminal.'); partDone('l7-step11'); }
      else if (n) log.textContent = l4Lang('Bajarildi: ' + n + ' / 4 topshiriq.', 'Done: ' + n + ' / 4 tasks.');
    }
    var GIT = {
      '--version': function(){ return 'git version 2.46.0'; },
      init: function(){
        if (S.init) return 'Reinitialized existing Git repository in /home/talaba/frontend/.git/';
        S.init = true; done.init = true;
        return 'Initialized empty Git repository in /home/talaba/frontend/.git/';
      },
      status: function(){
        var lines = ['On branch main'], staged = NAMES.filter(function(f){ return f in S.staged; });
        var mod = NAMES.filter(function(f){ return state(f) === 'mod'; }), nw = NAMES.filter(function(f){ return state(f) === 'new'; });
        if (!S.commits.length) lines.push('', 'No commits yet');
        if (staged.length) { lines.push('', 'Changes to be committed:'); staged.forEach(function(f){ lines.push('\t' + ((f in S.saved) ? 'modified:   ' : 'new file:   ') + f); }); }
        if (mod.length) { lines.push('', 'Changes not staged for commit:'); mod.forEach(function(f){ lines.push('\tmodified:   ' + f); }); }
        if (nw.length) { lines.push('', 'Untracked files:'); nw.forEach(function(f){ lines.push('\t' + f); }); }
        if (!staged.length && !mod.length && !nw.length) lines.push('nothing to commit, working tree clean');
        return lines.join('\n');
      },
      add: function(a){
        if (!a.length) throw 'Nothing specified, nothing added.';
        var list = (a[0] === '.' || a[0] === '-A' || a[0] === '--all') ? NAMES : a;
        list.forEach(function(f){ if (NAMES.indexOf(f) < 0) throw "fatal: pathspec '" + f + "' did not match any files"; });
        list.forEach(function(f){ if (state(f) === 'new' || state(f) === 'mod') S.staged[f] = S.ver[f]; });
        return '';
      },
      commit: function(a, line){
        var m = line.match(/-m\s+(["'])(.*?)\1/) || line.match(/-m\s+(\S+)/);
        var msg = m ? (m[2] !== undefined ? m[2] : m[1]) : '';
        var staged = NAMES.filter(function(f){ return f in S.staged; });
        if (!staged.length) {
          var dirty = NAMES.some(function(f){ return state(f) !== 'ok'; });
          return dirty ? 'nothing added to commit but untracked or modified files present (use "git add" to track)' : 'nothing to commit, working tree clean';
        }
        if (!msg.trim()) throw l4Lang('Izoh kerak: git commit -m "Nima qildim"', 'A message is needed: git commit -m "What I did"');
        var c = { hash: hash(), msg: msg, files: staged };
        staged.forEach(function(f){ S.saved[f] = S.staged[f]; });
        S.staged = {};
        S.commits.push(c);
        if (S.commits.length === 1 && staged.length === NAMES.length) done.first = true;
        if (S.commits.length > 1 && staged.length === 1 && staged[0] === 'index.html') done.second = true;
        return '[main' + (S.commits.length === 1 ? ' (root-commit)' : '') + ' ' + c.hash + '] ' + msg + '\n ' + staged.length + ' file' + (staged.length > 1 ? 's' : '') + ' changed';
      },
      log: function(a){
        if (!S.commits.length) throw "fatal: your current branch 'main' does not have any commits yet";
        if (S.commits.length >= 2) done.log = true;
        var one = a.indexOf('--oneline') !== -1;
        return S.commits.slice().reverse().map(function(c, i){
          return one ? c.hash + (i === 0 ? ' (HEAD -> main) ' : ' ') + c.msg : 'commit ' + c.hash + (i === 0 ? ' (HEAD -> main)' : '') + '\nAuthor: Ali Valiyev <ali@mail.uz>\n\n    ' + c.msg + '\n';
        }).join('\n');
      },
      diff: function(){
        var parts = NAMES.filter(function(f){ return state(f) === 'mod'; }).map(function(f){
          var a = CONTENT[f][S.saved[f]].split('\n'), b = CONTENT[f][S.ver[f]].split('\n');
          return 'diff --git a/' + f + ' b/' + f + '\n' + a.filter(function(x){ return b.indexOf(x) < 0; }).map(function(x){ return '- ' + x; }).concat(b.filter(function(x){ return a.indexOf(x) < 0; }).map(function(x){ return '+ ' + x; })).join('\n');
        });
        return parts.join('\n');
      },
      push: function(){ throw 'fatal: No configured push destination.\n' + l4Lang("(Haqiqiy loyihada avval GitHub'da repozitoriy ochib, git remote add origin ... qilasiz.)", '(In a real project you first create a repository on GitHub and run git remote add origin ...)'); }
    };
    function run(line){
      var p = line.split(/\s+/), c = p.shift();
      if (c === 'help') return l4Lang("Buyruqlar:\n  ls, pwd, clear\n  git --version\n  git init\n  git status\n  git add index.html | git add .\n  git commit -m \"izoh\"\n  git log | git log --oneline\n  git diff\nFaylni o'zgartirish uchun pastdagi tugmalarni bosing.", 'Commands:\n  ls, pwd, clear\n  git --version\n  git init\n  git status\n  git add index.html | git add .\n  git commit -m "message"\n  git log | git log --oneline\n  git diff\nUse the buttons below to edit a file.');
      if (c === 'clear') { out.innerHTML = ''; return null; }
      if (c === 'ls') return NAMES.join('  ');
      if (c === 'pwd') return '/home/talaba/frontend';
      if (c !== 'git') throw c + ': command not found';
      var sub = p.shift();
      if (!sub) return 'usage: git <command> [<args>]';
      if (!GIT[sub]) throw "git: '" + sub + "' is not a git command. See 'git help'.";
      if (sub !== 'init' && sub !== '--version' && !S.init) throw 'fatal: not a git repository (or any of the parent directories): .git';
      return GIT[sub](p, line);
    }
    print(l4Lang("Bu — o'quv terminali. Boshlash uchun: git init  (yordam: help)", 'This is a practice terminal. To start: git init  (help: help)'), 'ok');
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
      try { var r = run(line); if (r) print(r); } catch (err) { print(String(err), 'err'); }
      render();
    });
    $('l7-git').querySelectorAll('[data-edit]').forEach(function(b){
      b.addEventListener('click', function(){
        var f = b.getAttribute('data-edit');
        if (S.ver[f] < CONTENT[f].length - 1) S.ver[f]++;
        print(l4Lang('# ' + f + ' tahrirlandi va saqlandi (cmd + S)', '# ' + f + ' was edited and saved (cmd + S)'), 'ok');
        render();
        inp.focus();
      });
    });
    document.addEventListener('i18n:change', render);
    render();
  })();

  // ---------- Tabs ----------
  (function(){
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
    var HASH = { h: '#tarix-html', k: '#tarix-kompyuter', a: '#tarix-assembler', c: '#tarix-kompilyator', i: '#tarix-internet', e: '#tarix-sichqoncha', u: '#tarix-unix', l: '#tarix-linux' };
    function show(n){
      n = String(n);
      tabs.forEach(function(t){
        var on = t.getAttribute('data-lesson') === n;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function(p){ p.hidden = p.getAttribute('data-lesson') !== n; });
      var h = HASH[n] || '#dars-' + n;
      if (location.hash !== h) history.replaceState(null, '', h);
    }
    tabs.forEach(function(t, idx){
      t.addEventListener('click', function(){ show(t.getAttribute('data-lesson')); $('content-top').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); });
      t.addEventListener('keydown', function(e){
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var nx = tabs[(idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        show(nx.getAttribute('data-lesson'));
        nx.focus();
      });
    });
    document.querySelectorAll('[data-goto]').forEach(function(btn){
      btn.addEventListener('click', function(){
        show(btn.getAttribute('data-goto'));
        $('content-top').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
    function firstIncomplete(){
      for (var i = 0; i < LESSONS.length; i++) {
        var L = LESSONS[i], s = states[L.n], d = 0;
        for (var j = 1; j <= L.steps; j++) if (s['step' + j]) d++;
        if (d < L.steps) return L.n;
      }
      return LESSONS[LESSONS.length - 1].n;
    }
    var m = (location.hash || '').match(/^#dars-(\d+)$/);
    var hh = location.hash;
    var byHash = null;
    Object.keys(HASH).forEach(function(k){ if (HASH[k] === hh) byHash = k; });
    show(hh === '#tarix' ? 'h' : byHash || (m && $('panel-' + m[1]) ? m[1] : firstIncomplete()));
  })();
})();
