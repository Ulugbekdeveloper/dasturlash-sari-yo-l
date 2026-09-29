# 3-dars: Teglar qanday tug'ilgan — Tim Berners-Li hikoya qiladi

> Bu dars Tim Berners-Li tilidan badiiy hikoya shaklida yozilgan. Hikoya uslubi — o'ylab topilgan, lekin sanalar, ismlar va voqealar — haqiqiy.

---

## Kirish: "Noaniq, lekin qiziq"

![Tim Berners-Li](rasmlar/01-tim-berners-lee.jpg)

Salom! Men Tim Berners-Liman. Birinchi darslarda HTML qanday paydo bo'lganini eshitdingiz. Bugun esa sizga har bir **teg** qayerdan kelganini aytib beraman — axir ularning har birining o'z hikoyasi bor.

![CERN laboratoriyasi](rasmlar/02-cern.jpg)

1989-yil. Men Shveytsariyadagi **CERN** laboratoriyasida ishlardim. Bu yerda dunyoning turli burchaklaridan kelgan minglab olimlar ishlardi, ularning ma'lumotlari esa turli kompyuterlarda, turli formatlarda sochilib yotardi. Men bularning hammasini **havolalar** bilan bog'laydigan tizim haqida taklif yozdim. Rahbarim Mayk Sendall taklifimning ustiga shunday deb yozib qo'ydi: *"Noaniq, lekin qiziq"*. Shu ikki so'z menga yo'l ochib berdi.

![1989-yilgi taklif va "Vague but exciting" yozuvi](rasmlar/03-vague-but-exciting.jpg)

Menga oddiy til kerak edi — har qanday kompyuter tushuna oladigan, oddiy matndan iborat til. Men uni noldan o'ylab topmadim. CERN'da olimlar hujjat yozish uchun **SGMLguid** degan tildan foydalanishardi. Undagi `<...>` burchakli qavslar ichidagi belgilarni — ya'ni **teglarni** — men o'z tilimga oldim. Shunday qilib **HTML** tug'ildi.

![Birinchi HTML teglar ro'yxati](rasmlar/04-html-tags-1991.png)

Endi keling, teglar bilan birma-bir tanishamiz.

---

## 1. Sarlavhalar: `<h1>` – `<h6>`

**Hikoya.** Sarlavhalarni men ixtiro qilmadim — ular CERN'dagi o'sha SGMLguid tilidan tayyor holda keldi. Olimlarning hujjatlarida bob, bo'lim, kichik bo'lim bo'lardi, shuning uchun sarlavhalarning **oltita darajasi** bor edi. Men ularni o'zgartirmadim: `h1` — eng muhim sarlavha, `h6` — eng kichigi. O'shandan beri 30 yildan oshdi, lekin ular deyarli o'zgarmadi.

```html
<h1>Mening saytim</h1>
<h2>Men haqimda</h2>
<h3>Qiziqishlarim</h3>
```

> Qoida: sahifada bitta `<h1>` bo'lgani yaxshi — bu kitobning nomi kabi.

---

## 2. Paragraf: `<p>`

**Hikoya.** Bu tegning qiziq tarixi bor. Dastlab `<p>` paragrafni **o'rab turmasdi** — u ikki paragraf **orasiga qo'yiladigan ajratuvchi** edi, yopuvchi tegi ham yo'q edi. Xuddi yozuv mashinasida "yangi abzats" tugmasini bosgandek. Keyinchalik HTML rivojlanib, `<p>` matnni boshidan oxirigacha o'rab turadigan "quti"ga aylandi.

```html
<p>Bu birinchi paragraf.</p>
<p>Bu ikkinchi paragraf.</p>
```

---

## 3. Havola: `<a>` — mening eng sevimli tegim

**Hikoya.** Mana, eng muhimi! Boshqa teglarning ko'pini tayyor holda olgan bo'lsam, `<a>` — webning **yuragi**, aynan shu narsa uchun men butun tizimni yaratdim.

![Ted Nelson](rasmlar/05-ted-nelson.jpg)

"Gipermatn" so'zini 1960-yillarda Ted Nelson o'ylab topgan edi — bir matndan boshqasiga sakrash mumkin bo'lgan matn. Men esa 1980-yilda ENQUIRE degan kichik dastur yozgandim, u ma'lumotlarni bir-biri bilan bog'lardi. Webda bu g'oyani butun dunyo miqyosiga olib chiqmoqchi edim.

`a` harfi **anchor** — ya'ni **langar** so'zidan olingan. Havola kemaning langariga o'xshaydi: u sizni boshqa joyga "bog'laydi". `href` esa **hypertext reference** — "gipermatn manzili" degani.

Men bitta muhim qaror qabul qildim: havolalar **bir tomonlama** bo'lsin. Ya'ni siz istalgan sahifaga havola qo'yishingiz mumkin va buning uchun o'sha sahifa egasidan ruxsat so'rash shart emas. Boshqa tizimlar ikki tomonlama havolalarni sinab ko'rgan, lekin ular juda murakkab bo'lib ketardi. Aynan shu oddiylik tufayli web shunchalik tez o'sdi.

Havola qayerga olib borishini ko'rsatish uchun men **URL** — manzil yozish usulini ham o'ylab topdim.

![Birinchi veb-server bo'lgan NeXT kompyuteri](rasmlar/06-next-computer.jpg)

![Birinchi veb-sayt — info.cern.ch](rasmlar/07-first-website.png)

```html
<!-- Boshqa saytga (to'liq manzil) -->
<a href="https://info.cern.ch">Birinchi veb-sayt</a>

<!-- O'z saytingizdagi boshqa sahifaga (nisbiy manzil) -->
<a href="about.html">Men haqimda</a>

<!-- Yangi oynada ochish -->
<a href="https://info.cern.ch" target="_blank">Yangi oynada ochish</a>
```

**Nisbiy va to'liq manzil farqi:**
- `https://...` bilan boshlansa — **to'liq manzil**, internetning istalgan joyiga olib boradi.
- `about.html` — **nisbiy manzil**, "hozirgi papkadagi about.html faylini och" degani.

---

## Atribut nima?

`href` va `target` — bular **atributlar**. Teg — bu "nima", atribut esa "qanday" yoki "qayerga" degan qo'shimcha ma'lumot.

```html
<a href="about.html">Men haqimda</a>
<!-- teg: a   atribut: href   qiymat: "about.html" -->
```

Atributlar har doim ochuvchi teg ichida, `nom="qiymat"` ko'rinishida yoziladi.

---

## 4. Ro'yxatlar: `<ul>`, `<ol>`, `<li>`

**Hikoya.** Olimlar ro'yxatlarni juda yaxshi ko'radi: tajriba bosqichlari, qurilmalar ro'yxati, xulosalar... Shuning uchun SGMLguid'da ro'yxatlar allaqachon bor edi va men ularni ham oldim.

- `ul` — **unordered list**, tartiblanmagan ro'yxat (nuqtalar bilan)
- `li` — **list item**, ro'yxat elementi

Raqamlangan ro'yxat — `ol` (**ordered list**) esa sal keyinroq, HTML rivojlanayotgan paytda qo'shildi. Odamlar "1, 2, 3" deb qo'lda yozishdan charchashgandi.

```html
<ul>
  <li>Olma</li>
  <li>Nok</li>
</ul>

<ol>
  <li>Kompyuterni yoqing</li>
  <li>Brauzerni oching</li>
  <li>Sayt manzilini yozing</li>
</ol>
```

Ro'yxat ichida ro'yxat ham bo'lishi mumkin:

```html
<ul>
  <li>Mevalar
    <ul>
      <li>Olma</li>
      <li>Nok</li>
    </ul>
  </li>
</ul>
```

---

## 5. Qator tashlash va chiziq: `<br>` va `<hr>`

**Hikoya.** Birinchi HTML'da bir muammo bor edi: brauzer matndagi qator tashlashlarni e'tiborsiz qoldirardi. She'r yoki manzil yozsangiz, hammasi bitta qatorga yopishib qolardi! Yangi paragraf ochish esa har doim ham to'g'ri kelmasdi. Shuning uchun 1993-yil atrofida HTML'ga ikkita kichik teg qo'shildi:

- `<br>` — **break**, ya'ni "shu yerda qatorni uz"
- `<hr>` — **horizontal rule**, ya'ni gorizontal chiziq, mavzularni ajratish uchun

Bu ikkalasining **yopuvchi tegi yo'q** — ular ichiga hech narsa olmaydi.

```html
<p>
  Toshkent shahri,<br>
  Amir Temur ko'chasi, 1-uy
</p>

<hr>
```

---

## 6. Ajratib ko'rsatish: `<strong>` va `<em>`

**Hikoya.** Men doimo bitta tamoyilga amal qilganman: **HTML matnning ma'nosini bildirsin, tashqi ko'rinishni esa brauzer hal qilsin.**

Shuning uchun HTML'da ikki xil teglar paydo bo'ldi:
- `<b>` (qalin) va `<i>` (qiyshiq) — faqat **ko'rinishni** bildiradi
- `<strong>` (**muhim**) va `<em>` (*urg'u*) — **ma'noni** bildiradi

Tashqaridan ular bir xil ko'rinadi. Lekin ko'zi ojiz odamlar uchun matnni ovoz chiqarib o'qiydigan dasturlar `<strong>` va `<em>` ni sezadi va o'sha so'zni urg'u bilan o'qiydi. Shuning uchun bugun `strong` va `em` dan foydalanish tavsiya etiladi.

```html
<p>Bu <strong>juda muhim</strong> ma'lumot.</p>
<p>Men buni <em>albatta</em> qilaman.</p>
```

---

## 7. Rasm: `<img>` — men emas, yosh talaba yaratgan teg

**Hikoya.** Bu tegni men yaratmaganman — va bu webning eng mashhur hikoyalaridan biri.

![Mark Andrissen](rasmlar/08-marc-andreessen.jpg)

1993-yil 25-fevral. AQShdagi NCSA markazida ishlayotgan yosh talaba **Mark Andrissen** veb-dasturchilarning pochta ro'yxatiga xat yozdi: u matn ichida rasm ko'rsatish uchun yangi `IMG` tegini taklif qildi.

![Andrissenning 1993-yilgi IMG haqidagi xati](rasmlar/09-img-email-1993.png) Boshqalar muhokama qila boshlashdi — kimdir boshqa nom taklif qildi, kimdir umumiyroq yechim o'ylab topishni maslahat berdi. Lekin Mark kutib o'tirmadi — u tegni o'zining **Mosaic** brauzeriga qo'shib, chiqarib yubordi.

Mosaic sahifalarda rasmlarni matn bilan birga ko'rsatgan birinchi mashhur brauzerlardan biri bo'ldi va web birdaniga rang-barang, jonli bo'lib qoldi. Oddiy odamlar internetga aynan shundan keyin qiziqa boshladi.

![Mosaic brauzeri](rasmlar/10-mosaic-browser.png) Shunday qilib `<img>` standartga ham kirdi.

Keyinchalik unga `alt` atributi qo'shildi — rasm yuklanmasa yoki uni ko'ra olmaydigan odam sahifani o'qiyotgan bo'lsa, rasm o'rniga shu matn ishlatiladi.

```html
<img src="rasm.jpg" alt="Tog'dagi quyosh botishi" width="300">
```

- `src` — **source**, rasm qayerda joylashgani
- `alt` — rasmning matnli tavsifi (**har doim yozing!**)
- `width` — kengligi
- `<img>` ning ham yopuvchi tegi yo'q

---

## 8. Konteyner: `<div>`

**Hikoya.** Web juda tez o'sdi. 1994-yilda men webni rivojlantirish uchun **W3C** — Butunjahon Veb Konsorsiumini tashkil qildim. Odamlar esa sahifalarni chiroyli qilishni xohlashardi va buning uchun... **jadvallardan** foydalanishardi! Sahifani ko'rinmas jadvalning kataklariga bo'lib tashlashardi. Bu juda noqulay edi.

![Jadvallar bilan qurilgan 1990-yillar sayti](rasmlar/11-table-layout-1996.png)

1997-yilda HTML 3.2 bilan `<div>` (**division** — "bo'lim") tegi keldi. U o'zi hech narsani bildirmaydi — shunchaki boshqa teglarni bir guruhga yig'adigan quti. Uning haqiqiy kuchi **CSS** bilan birga ochiladi — bu haqda keyingi hikoyalarda gaplashamiz.

```html
<div>
  <h2>Men haqimda</h2>
  <p>Men dasturlashni o'rganyapman.</p>
</div>
```

---

## 9. Izohlar: `<!-- -->`

**Hikoya.** Bu yozuv ham menga SGML'dan meros qolgan. `<!--` va `-->` orasidagi hamma narsani brauzer **ko'rsatmaydi**. Bu dasturchilarning o'zlari uchun eslatma: "bu qism nima uchun kerak", "keyin tuzatish kerak" va hokazo.

```html
<!-- Bu yerda menyu boshlanadi -->
```

---

## Bilasizmi? `<blink>` — yo'q bo'lib ketgan teg

Hamma teglar ham uzoq yashamagan. 1994-yilda **Netscape** brauzeri `<blink>` tegini qo'shdi — u matnni **miltillatib** turardi. Netscape dasturchisi Lu Montulli'ning aytishicha, bu g'oya do'stlar bilan hazillashib o'tirganda tug'ilgan, kimdir esa uni haqiqatda dasturlab qo'ygan.

![1990-yillarning miltillovchi saytlari](rasmlar/12-blink-90s-site.gif)

Natija? Butun internet miltillovchi yozuvlarga to'lib ketdi va hamma undan bezor bo'ldi. Teg hech qachon rasmiy standartga kirmadi va 2013-yilda Firefox ham uni qo'llab-quvvatlashni to'xtatdi.

**Xulosa:** teg yaratish oson, lekin hamma teg ham foydali emas.

---

## Yakun: Tim'ning so'nggi so'zi

1993-yil 30-aprelda CERN webni **hamma uchun bepul** deb e'lon qildi. Men webni patentlamadim va undan pul ishlamadim. Agar web pullik bo'lganida, u hech qachon bugungidek butun dunyoni qamrab olmasdi.

Endi siz ham men va minglab boshqa dasturchilar yaratgan teglardan foydalanib, o'z sahifangizni yozishingiz mumkin. Omad!

---

## Amaliyot: "Mening sahifam"

`index.html` faylida quyidagilarni o'z ichiga olgan sahifa yozing:

1. `<h1>` — ismingiz
2. `<img>` — rasmingiz yoki sevimli rasmingiz (`alt` bilan!)
3. `<h2>` "Men haqimda" va bitta `<p>`, ichida `<strong>` va `<em>` bor
4. `<hr>` bilan ajrating
5. `<h2>` "Qiziqishlarim" va `<ul>` ro'yxati
6. `<h2>` "Kun tartibim" va `<ol>` ro'yxati
7. `<a>` — sevimli saytingizga havola (`target="_blank"` bilan)
8. Kamida bitta `<!-- izoh -->`

**Natija taxminan shunday ko'rinadi:**

![Amaliyot natijasi](rasmlar/13-amaliyot-natija.png)

**Tayyor namuna:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mening sahifam</title>
</head>
<body>
  <!-- Sarlavha va rasm -->
  <h1>Ali Valiyev</h1>
  <img src="men.jpg" alt="Ali Valiyevning surati" width="200">

  <h2>Men haqimda</h2>
  <p>Men <strong>dasturlashni</strong> o'rganyapman va bu menga <em>juda</em> yoqadi.</p>

  <hr>

  <h2>Qiziqishlarim</h2>
  <ul>
    <li>Dasturlash</li>
    <li>Kitob o'qish</li>
    <li>Futbol</li>
  </ul>

  <h2>Kun tartibim</h2>
  <ol>
    <li>Ertalab badantarbiya</li>
    <li>Dars</li>
    <li>Dasturlash mashqi</li>
  </ol>

  <p>Birinchi veb-saytni ko'ring:
    <a href="https://info.cern.ch" target="_blank">info.cern.ch</a>
  </p>
</body>
</html>
```

---

## Bonus: Istalgan saytning kodini ko'ring

Istalgan saytda sichqonchaning o'ng tugmasini bosing → **"Inspect"** (yoki **"Tekshirish"**). ![Inspect oynasi](rasmlar/14-devtools-inspect.png)

Ochilgan oynada o'sha saytning HTML kodini ko'rasiz — bugun o'rgangan `h1`, `p`, `a`, `img`, `div` teglarini u yerda ham topasiz!

---

## Uy vazifasi

1. Amaliyotdagi sahifani o'zingiz haqingizda to'ldiring.
2. `about.html` degan ikkinchi sahifa yarating va ikkala sahifani bir-biriga **nisbiy havola** bilan bog'lang.
3. Sevimli saytingizni "Inspect" orqali oching va u yerda uchragan 5 ta tegni yozib keling.

---

**Keyingi darsda:** jadvallar va formalar. "Tarixdan hikoyalar" turkumida esa HTMLdan keyin **CSS** hikoyasi keladi.
