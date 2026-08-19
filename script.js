/* =========================================================
   WISE.GRAPHIXDESIGN
   MAIN SCRIPT
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

  ht: {
    name: 'Kreyòl',

    navWork: 'Travay mwen yo',
    navStore: 'Boutik PSD',
    navFree: 'Asset gratis',
    navServices: 'Sèvis',

    heroEyebrow: 'STIDYO DESIGN KREYATIF',
    heroTitle: 'Design ki<br><em>fè moun sonje w.</em>',
    heroText:
      'Kreyasyon grafik premium, PSD editab ak resous dijital pou mak ak biznis ki vle kanpe apa.',
    heroPrimary: 'Gade travay mwen ↗',
    heroSecondary: 'Achte PSD →',

    workEyebrow: '01 / PORTFOLIO',
    workTitle: 'Travay <em>mwen yo.</em>',

    filterAll: 'Tout',
    filterFlyers: 'Flyers',
    filterCovers: 'Covers',
    filterLabels: 'Étiquèt',
    filterBranding: 'Branding',

    portfolioFlyer: 'Flyer Campaign',
    portfolioCover: 'Cover Design',
    portfolioLabel: 'Product Label',
    portfolioBrand: 'Brand Identity',
    portfolioEvent: 'Event Flyer',
    portfolioEditorial: 'Editorial Cover',

    storeEyebrow: '02 / DIGITAL STORE',
    storeTitle: 'Boutik <em>PSD.</em>',
    buy: 'ACHTE KOUNYE A ↗',
    storeNote:
      '— Estrikti checkout la pare pou koneksyon backend.',

    freeEyebrow: '03 / RESOUS GRATIS',
    freeTitle: 'Asset <em>gratis.</em>',

    assetPNG: 'PNG',
    assetTextures: 'Textures',
    assetMockups: 'Mockups',

    assetIntro:
      'Klike sou yon kategori pou wè fichye yo, epi telechaje sa ou bezwen an.',

    assetLight: 'Efè limyè PNG',
    assetLightDesc: 'Efè limyè transparan',

    assetSparkles: 'Paillettes lò PNG',
    assetSparklesDesc: 'Paillettes transparan',

    assetShapes: 'Fòm abstrè PNG',
    assetShapesDesc: 'Fòm transparan',

    assetGrain: 'Teksti grenn',
    assetGrainDesc: 'Teksti rezolisyon wo',

    assetPaper: 'Teksti papye',
    assetPaperDesc: 'Teksti rezolisyon wo',

    assetGold: 'Teksti lò',
    assetGoldDesc: 'Teksti rezolisyon wo',

    assetCard: 'Mockup kat',
    assetCardDesc: 'Mockup prezantasyon',

    assetPhone: 'Mockup telefòn',
    assetPhoneDesc: 'Mockup prezantasyon',

    assetPoster: 'Mockup afich',
    assetPosterDesc: 'Mockup prezantasyon',

    download: 'TELECHAJE GRATIS ↓',

    checkoutMessage:
      'MonCash / checkout backend ap konekte nan etap kap vini an.',

    servicesEyebrow: '04 / SÈVIS',
    servicesTitle: 'Sèvis pou <em>biznis.</em>',

    service1: '01 — Logo & Branding',
    service2: '02 — Flyer & Social Media',
    service3: '03 — Packaging & Étiquèt',
    service4: '04 — Motion Design',

    footer: 'Design grafik · PSD · Asset dijital',

    whatsapp: 'WhatsApp'
  },


  en: {
    name: 'English',

    navWork: 'My work',
    navStore: 'PSD store',
    navFree: 'Free assets',
    navServices: 'Services',

    heroEyebrow: 'CREATIVE DESIGN STUDIO',
    heroTitle: 'Design that<br><em>makes you memorable.</em>',
    heroText:
      'Premium graphic design, editable PSD files and digital resources for brands and businesses that want to stand out.',
    heroPrimary: 'View my work ↗',
    heroSecondary: 'Buy PSD →',

    workEyebrow: '01 / PORTFOLIO',
    workTitle: 'My <em>work.</em>',

    filterAll: 'All',
    filterFlyers: 'Flyers',
    filterCovers: 'Covers',
    filterLabels: 'Labels',
    filterBranding: 'Branding',

    portfolioFlyer: 'Flyer Campaign',
    portfolioCover: 'Cover Design',
    portfolioLabel: 'Product Label',
    portfolioBrand: 'Brand Identity',
    portfolioEvent: 'Event Flyer',
    portfolioEditorial: 'Editorial Cover',

    storeEyebrow: '02 / DIGITAL STORE',
    storeTitle: 'PSD <em>store.</em>',
    buy: 'BUY NOW ↗',

    storeNote:
      '— Checkout structure is ready for a backend connection.',

    freeEyebrow: '03 / FREE RESOURCES',
    freeTitle: 'Free <em>assets.</em>',

    assetPNG: 'PNG',
    assetTextures: 'Textures',
    assetMockups: 'Mockups',

    assetIntro:
      'Choose a category to see its files, then download what you need.',

    assetLight: 'Light Effects PNG',
    assetLightDesc: 'Transparent light effect',

    assetSparkles: 'Gold Sparkles PNG',
    assetSparklesDesc: 'Transparent sparkles',

    assetShapes: 'Abstract Shapes PNG',
    assetShapesDesc: 'Transparent shapes',

    assetGrain: 'Grain Texture',
    assetGrainDesc: 'High-resolution texture',

    assetPaper: 'Paper Texture',
    assetPaperDesc: 'High-resolution texture',

    assetGold: 'Gold Texture',
    assetGoldDesc: 'High-resolution texture',

    assetCard: 'Card Mockup',
    assetCardDesc: 'Presentation mockup',

    assetPhone: 'Phone Mockup',
    assetPhoneDesc: 'Presentation mockup',

    assetPoster: 'Poster Mockup',
    assetPosterDesc: 'Presentation mockup',

    download: 'FREE DOWNLOAD ↓',

    checkoutMessage:
      'MonCash / checkout backend will be connected in the next step.',

    servicesEyebrow: '04 / SERVICES',
    servicesTitle: 'Services for <em>business.</em>',

    service1: '01 — Logo & Branding',
    service2: '02 — Flyer & Social Media',
    service3: '03 — Packaging & Labels',
    service4: '04 — Motion Design',

    footer: 'Graphic design · PSD · Digital assets',

    whatsapp: 'WhatsApp'
  },


  fr: {
    name: 'Français',

    navWork: 'Mes créations',
    navStore: 'Boutique PSD',
    navFree: 'Ressources gratuites',
    navServices: 'Services',

    heroEyebrow: 'STUDIO DE DESIGN CRÉATIF',
    heroTitle: 'Un design qui<br><em>vous rend mémorable.</em>',
    heroText:
      'Créations graphiques premium, PSD modifiables et ressources numériques pour les marques et entreprises qui veulent se démarquer.',
    heroPrimary: 'Voir mes créations ↗',
    heroSecondary: 'Acheter des PSD →',

    workEyebrow: '01 / PORTFOLIO',
    workTitle: 'Mes <em>créations.</em>',

    filterAll: 'Tout',
    filterFlyers: 'Flyers',
    filterCovers: 'Couvertures',
    filterLabels: 'Étiquettes',
    filterBranding: 'Identité de marque',

    portfolioFlyer: 'Campagne flyer',
    portfolioCover: 'Design de couverture',
    portfolioLabel: 'Étiquette produit',
    portfolioBrand: 'Identité de marque',
    portfolioEvent: 'Flyer événement',
    portfolioEditorial: 'Couverture éditoriale',

    storeEyebrow: '02 / BOUTIQUE NUMÉRIQUE',
    storeTitle: 'Boutique <em>PSD.</em>',

    buy: 'ACHETER MAINTENANT ↗',

    storeNote:
      '— La structure de paiement est prête pour une connexion au backend.',

    freeEyebrow: '03 / RESSOURCES GRATUITES',
    freeTitle: 'Ressources <em>gratuites.</em>',

    assetPNG: 'PNG',
    assetTextures: 'Textures',
    assetMockups: 'Mockups',

    assetIntro:
      'Choisissez une catégorie pour voir les fichiers, puis téléchargez ce dont vous avez besoin.',

    assetLight: 'Effets lumineux PNG',
    assetLightDesc: 'Effet lumineux transparent',

    assetSparkles: 'Paillettes dorées PNG',
    assetSparklesDesc: 'Paillettes transparentes',

    assetShapes: 'Formes abstraites PNG',
    assetShapesDesc: 'Formes transparentes',

    assetGrain: 'Texture grain',
    assetGrainDesc: 'Texture haute résolution',

    assetPaper: 'Texture papier',
    assetPaperDesc: 'Texture haute résolution',

    assetGold: 'Texture dorée',
    assetGoldDesc: 'Texture haute résolution',

    assetCard: 'Mockup carte',
    assetCardDesc: 'Mockup de présentation',

    assetPhone: 'Mockup téléphone',
    assetPhoneDesc: 'Mockup de présentation',

    assetPoster: 'Mockup affiche',
    assetPosterDesc: 'Mockup de présentation',

    download: 'TÉLÉCHARGER GRATUITEMENT ↓',

    checkoutMessage:
      'MonCash / le backend de paiement sera connecté à la prochaine étape.',

    servicesEyebrow: '04 / SERVICES',
    servicesTitle: 'Services pour les <em>entreprises.</em>',

    service1: '01 — Logo & Identité de marque',
    service2: '02 — Flyer & Réseaux sociaux',
    service3: '03 — Packaging & Étiquettes',
    service4: '04 — Motion Design',

    footer: 'Design graphique · PSD · Ressources numériques',

    whatsapp: 'WhatsApp'
  },


  es: {
    name: 'Español',

    navWork: 'Mi trabajo',
    navStore: 'Tienda PSD',
    navFree: 'Recursos gratis',
    navServices: 'Servicios',

    heroEyebrow: 'ESTUDIO CREATIVO DE DISEÑO',
    heroTitle: 'Diseño que<br><em>te hace memorable.</em>',
    heroText:
      'Diseño gráfico premium, PSD editables y recursos digitales para marcas y negocios que quieren destacar.',
    heroPrimary: 'Ver mi trabajo ↗',
    heroSecondary: 'Comprar PSD →',

    workEyebrow: '01 / PORTAFOLIO',
    workTitle: 'Mi <em>trabajo.</em>',

    filterAll: 'Todo',
    filterFlyers: 'Flyers',
    filterCovers: 'Portadas',
    filterLabels: 'Etiquetas',
    filterBranding: 'Branding',

    portfolioFlyer: 'Campaña de flyer',
    portfolioCover: 'Diseño de portada',
    portfolioLabel: 'Etiqueta de producto',
    portfolioBrand: 'Identidad de marca',
    portfolioEvent: 'Flyer de evento',
    portfolioEditorial: 'Portada editorial',

    storeEyebrow: '02 / TIENDA DIGITAL',
    storeTitle: 'Tienda <em>PSD.</em>',

    buy: 'COMPRAR AHORA ↗',

    storeNote:
      '— La estructura de pago está lista para conectarse al backend.',

    freeEyebrow: '03 / RECURSOS GRATUITOS',
    freeTitle: 'Recursos <em>gratis.</em>',

    assetPNG: 'PNG',
    assetTextures: 'Texturas',
    assetMockups: 'Mockups',

    assetIntro:
      'Elige una categoría para ver los archivos y descarga lo que necesitas.',

    assetLight: 'Efectos de luz PNG',
    assetLightDesc: 'Efecto de luz transparente',

    assetSparkles: 'Destellos dorados PNG',
    assetSparklesDesc: 'Destellos transparentes',

    assetShapes: 'Formas abstractas PNG',
    assetShapesDesc: 'Formas transparentes',

    assetGrain: 'Textura granulada',
    assetGrainDesc: 'Textura de alta resolución',

    assetPaper: 'Textura de papel',
    assetPaperDesc: 'Textura de alta resolución',

    assetGold: 'Textura dorada',
    assetGoldDesc: 'Textura de alta resolución',

    assetCard: 'Mockup de tarjeta',
    assetCardDesc: 'Mockup de presentación',

    assetPhone: 'Mockup de teléfono',
    assetPhoneDesc: 'Mockup de presentación',

    assetPoster: 'Mockup de póster',
    assetPosterDesc: 'Mockup de presentación',

    download: 'DESCARGA GRATIS ↓',

    checkoutMessage:
      'El backend de pago MonCash se conectará en el próximo paso.',

    servicesEyebrow: '04 / SERVICIOS',
    servicesTitle: 'Servicios para <em>negocios.</em>',

    service1: '01 — Logo & Branding',
    service2: '02 — Flyer & Redes sociales',
    service3: '03 — Packaging & Etiquetas',
    service4: '04 — Motion Design',

    footer: 'Diseño gráfico · PSD · Recursos digitales',

    whatsapp: 'WhatsApp'
  }

};


/* =========================================================
   ASSET TRANSLATION KEYS
========================================================= */

Object.values(translations).forEach(function (t) {

  Object.assign(t, {

    assetCake: 'Gato fèt',
    assetCakeDesc: 'PNG gratis',

    assetBalloons: 'Balon fèt',
    assetBalloonsDesc: 'PNG gratis',

    assetStars: 'Zetwal',
    assetStarsDesc: 'PNG gratis',

    asset4: 'Asset PNG 04',
    asset4Desc: 'PNG gratis',

    asset5: 'Asset PNG 05',
    asset5Desc: 'PNG gratis',

    asset6: 'Asset PNG 06',
    asset6Desc: 'PNG gratis',

    assetBackground1: 'Background 01',
    assetBackground1Desc: 'Background gratis',

    assetBackground2: 'Background 02',
    assetBackground2Desc: 'Background gratis',

    assetBackground3: 'Background 03',
    assetBackground3Desc: 'Background gratis',

    assetBackground4: 'Background 04',
    assetBackground4Desc: 'Background gratis',

    assetBackground5: 'Background 05',
    assetBackground5Desc: 'Background gratis',

    assetBackground6: 'Background 06',
    assetBackground6Desc: 'Background gratis',

    assetTexture4: 'Texture 04',
    assetTexture4Desc: 'Texture rezolisyon wo',

    assetTexture5: 'Texture 05',
    assetTexture5Desc: 'Texture rezolisyon wo',

    assetTexture6: 'Texture 06',
    assetTexture6Desc: 'Texture rezolisyon wo',

    assetMockup4: 'Mockup 04',
    assetMockup4Desc: 'Mockup prezantasyon',

    assetMockup5: 'Mockup 05',
    assetMockup5Desc: 'Mockup prezantasyon',

    assetMockup6: 'Mockup 06',
    assetMockup6Desc: 'Mockup prezantasyon'

  });

});


/* =========================================================
   ASSETS
========================================================= */

const assets = {

  png: [

    ['images/gato00.png', 'assetCake', 'assetCakeDesc'],
    ['images/balonFet00.png', 'assetBalloons', 'assetBalloonsDesc'],
    ['images/star00.png', 'assetStars', 'assetStarsDesc'],
    ['images/asset4.png', 'asset4', 'asset4Desc'],
    ['images/asset5.png', 'asset5', 'asset5Desc'],
    ['images/asset6.png', 'asset6', 'asset6Desc']

  ],


  background: [

    ['images/MEN STANDARD.png', 'assetBackground1', 'assetBackground1Desc'],
    ['images/background2.jpg', 'assetBackground2', 'assetBackground2Desc'],
    ['images/background3.jpg', 'assetBackground3', 'assetBackground3Desc'],
    ['images/background4.jpg', 'assetBackground4', 'assetBackground4Desc'],
    ['images/background5.jpg', 'assetBackground5', 'assetBackground5Desc'],
    ['images/background6.jpg', 'assetBackground6', 'assetBackground6Desc']

  ],


  texture: [

    ['images/texture-grain.png', 'assetGrain', 'assetGrainDesc'],
    ['images/texture-paper.png', 'assetPaper', 'assetPaperDesc'],
    ['images/texture-gold.png', 'assetGold', 'assetGoldDesc'],
    ['images/texture-04.png', 'assetTexture4', 'assetTexture4Desc'],
    ['images/texture-05.png', 'assetTexture5', 'assetTexture5Desc'],
    ['images/texture-06.png', 'assetTexture6', 'assetTexture6Desc']

  ],


  mockup: [

    ['images/mockup-card.png', 'assetCard', 'assetCardDesc'],
    ['images/mockup-phone.png', 'assetPhone', 'assetPhoneDesc'],
    ['images/mockup-poster.png', 'assetPoster', 'assetPosterDesc'],
    ['images/mockup-04.png', 'assetMockup4', 'assetMockup4Desc'],
    ['images/mockup-05.png', 'assetMockup5', 'assetMockup5Desc'],
    ['images/mockup-06.png', 'assetMockup6', 'assetMockup6Desc']

  ]

};


/* =========================================================
   PSD PRODUCTS
========================================================= */

const psdProducts = {

  free: [

    {
      image: 'images/free-psd-01.jpg',
      title: 'Free Flyer PSD',
      description: 'PSD editab gratis',
      file: 'files/free-flyer-01.psd'
    },

    {
      image: 'images/free-psd-02.jpg',
      title: 'Free Social Media PSD',
      description: 'PSD editab gratis',
      file: 'files/free-social-02.psd'
    }

  ],


  paid: [

    {
      image: 'images/paid-psd-01.jpg',
      title: 'Luxury Flyer PSD',
      description: 'PSD premium editab',
      price: '500 HTG'
    },

    {
      image: 'images/paid-psd-02.jpg',
      title: 'Premium Social Pack',
      description: 'Pack PSD premium',
      price: '750 HTG'
    },

    {
      image: 'images/paid-psd-03.jpg',
      title: 'Premium Label PSD',
      description: 'PSD label premium',
      price: '600 HTG'
    }

  ]

};


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentLanguage =
  localStorage.getItem('wise-language') || 'ht';

let currentAssetType = 'png';


/* =========================================================
   RENDER PSD PRODUCTS
========================================================= */

function renderPSDProducts() {

  const freeGrid = $('#free-psd-grid');
  const paidGrid = $('#paid-psd-grid');

  const t = translations[currentLanguage];


  /* FREE PSD */

  if (freeGrid) {

    freeGrid.innerHTML =
      psdProducts.free.map(function (product) {

        return `
          <article class="store-card reveal visible">

            <img
              src="${product.image}"
              alt="${product.title}"
            >

            <h3>${product.title}</h3>

            <p>${product.description}</p>

            <a
              class="download"
              href="${product.file}"
              download
            >

              <svg
                class="download-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 3v10m0 0 4-4m-4 4-4-4M5 15v4h14v-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              ${t.download}

            </a>

          </article>
        `;

      }).join('');

  }


  /* PAID PSD */

  if (paidGrid) {

    paidGrid.innerHTML =
      psdProducts.paid.map(function (product) {

        return `
          <article class="store-card reveal visible">

            <img
              src="${product.image}"
              alt="${product.title}"
            >

            <h3>${product.title}</h3>

            <p>${product.description}</p>

            <strong>${product.price}</strong>

            <button
              class="buy"
              type="button"
              data-product="${product.title}"
            >
              ${t.buy}
            </button>

          </article>
        `;

      }).join('');

  }


  /* BUY BUTTONS */

  $$('.buy').forEach(function (button) {

    button.addEventListener('click', function () {

      alert(
        translations[currentLanguage].checkoutMessage
      );

    });

  });

}


/* =========================================================
   RENDER ASSETS
========================================================= */

function renderAssets() {

  const grid = $('#asset-grid');

  if (!grid) {
    return;
  }

  const t =
    translations[currentLanguage];

  const downloadLabel =
    t.download.replace(/\s*↓/g, '');


  grid.innerHTML =
    assets[currentAssetType].map(
      function ([file, titleKey, descriptionKey]) {

        return `
          <article class="asset-card reveal visible">

            <img
              src="${file}"
              alt="${t[titleKey] || titleKey}"
            >

            <h3>
              ${t[titleKey] || titleKey}
            </h3>

            <p>
              ${t[descriptionKey] || descriptionKey}
            </p>

            <a
              class="download"
              href="${file}"
              download
            >

              <svg
                class="download-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <path
                  d="M12 3v10m0 0 4-4m-4 4-4-4M5 15v4h14v-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

              </svg>

              ${downloadLabel}

            </a>

          </article>
        `;

      }
    ).join('');

}


/* =========================================================
   LANGUAGE
========================================================= */

function setLanguage(language) {

  if (!translations[language]) {
    language = 'ht';
  }

  currentLanguage = language;

  const t =
    translations[language];

  document.documentElement.lang =
    language;

  document.title =
    'WISE.GRAPHIXDESIGN';


  /* TEXT */

  $$('[data-i18n]').forEach(function (el) {

    const key =
      el.dataset.i18n;

    if (t[key] !== undefined) {

      el.textContent =
        t[key];

    }

  });


  /* HTML */

  $$('[data-i18n-html]').forEach(function (el) {

    const key =
      el.dataset.i18nHtml;

    if (t[key] !== undefined) {

      el.innerHTML =
        t[key];

    }

  });


  /* LANGUAGE BUTTON */

  const languageButton =
    $('#lb');

  if (languageButton) {

    languageButton.innerHTML = `
      🌐 ${t.name}
      <span aria-hidden="true">▾</span>
    `;

  }


  localStorage.setItem(
    'wise-language',
    language
  );


  renderAssets();
  renderPSDProducts();

}


/* =========================================================
   LANGUAGE MENU
========================================================= */

const languageButton =
  $('#lb');

if (languageButton) {

  languageButton.addEventListener(
    'click',
    function () {

      const menu =
        $('#lm');

      if (!menu) {
        return;
      }

      menu.classList.toggle('open');

      languageButton.setAttribute(
        'aria-expanded',
        menu.classList.contains('open')
      );

    }
  );

}


$$('[data-lang]').forEach(
  function (button) {

    button.addEventListener(
      'click',
      function () {

        setLanguage(
          button.dataset.lang
        );

        const menu =
          $('#lm');

        if (menu) {
          menu.classList.remove('open');
        }

        if (languageButton) {

          languageButton.setAttribute(
            'aria-expanded',
            'false'
          );

        }

      }
    );

  }
);


/* CLOSE LANGUAGE MENU */

document.addEventListener(
  'click',
  function (event) {

    if (
      !event.target.closest('.lang')
    ) {

      const menu =
        $('#lm');

      if (menu) {
        menu.classList.remove('open');
      }

    }

  }
);


/* =========================================================
   PORTFOLIO FILTERS
========================================================= */

$$('[data-filter]').forEach(
  function (button) {

    button.addEventListener(
      'click',
      function () {

        const filter =
          button.dataset.filter;


        $$('[data-filter]').forEach(
          function (item) {

            item.classList.toggle(
              'active',
              item === button
            );

          }
        );


        $$('.portfolio-card').forEach(
          function (card) {

            card.hidden =
              filter !== 'all' &&
              card.dataset.category !== filter;

          }
        );

      }
    );

  }
);


/* =========================================================
   ASSET FILTER
========================================================= */

$$('[data-asset-type]').forEach(
  function (button) {

    button.addEventListener(
      'click',
      function () {

        currentAssetType =
          button.dataset.assetType;


        $$('[data-asset-type]').forEach(
          function (item) {

            const active =
              item === button;

            item.classList.toggle(
              'active',
              active
            );

            item.setAttribute(
              'aria-selected',
              active
            );

          }
        );


        renderAssets();

      }
    );

  }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileButton =
  $('#mb');

if (mobileButton) {

  mobileButton.addEventListener(
    'click',
    function () {

      const nav =
        $('#main-nav');

      if (!nav) {
        return;
      }

      nav.classList.toggle('open');

      mobileButton.setAttribute(
        'aria-expanded',
        nav.classList.contains('open')
      );

    }
  );

}


$$('#main-nav a').forEach(
  function (link) {

    link.addEventListener(
      'click',
      function () {

        const nav =
          $('#main-nav');

        if (nav) {
          nav.classList.remove('open');
        }

      }
    );

  }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const observer =
  new IntersectionObserver(
    function (entries) {

      entries.forEach(
        function (entry) {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              'visible'
            );

            observer.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {
      threshold: 0.12
    }
  );


$$('.reveal').forEach(
  function (el) {

    observer.observe(el);

  }
);


/* =========================================================
   HERO SLIDESHOW
========================================================= */

const heroSlides =
  document.querySelectorAll(
    '.hero-slideshow .slide'
  );

const heroDots =
  document.querySelectorAll(
    '.slide-dots .dot'
  );


if (heroSlides.length > 0) {

  let currentSlide = 0;

  heroSlides[0].classList.add(
    'active'
  );


  if (heroDots.length > 0) {

    heroDots[0].classList.add(
      'active'
    );

  }


  if (heroSlides.length > 1) {

    setInterval(
      function () {

        const oldSlide =
          heroSlides[currentSlide];


        currentSlide =
          (currentSlide + 1) %
          heroSlides.length;


        const newSlide =
          heroSlides[currentSlide];


        newSlide.classList.remove(
          'prev'
        );

        newSlide.classList.add(
          'active'
        );


        oldSlide.classList.remove(
          'active'
        );

        oldSlide.classList.add(
          'prev'
        );


        heroDots.forEach(
          function (dot) {

            dot.classList.remove(
              'active'
            );

          }
        );


        if (heroDots[currentSlide]) {

          heroDots[currentSlide]
            .classList.add('active');

        }


        setTimeout(
          function () {

            oldSlide.classList.remove(
              'prev'
            );

          },
          1500
        );

      },
      6000
    );

  }

}


/* =========================================================
   INITIAL LANGUAGE
========================================================= */

setLanguage(
  currentLanguage
);


/* =========================================================
   PROFESSIONAL IMAGE LIGHTBOX
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  function () {

    const lightbox =
      document.getElementById(
        'image-lightbox'
      );

    const lightboxContent =
      document.getElementById(
        'lightbox-content'
      );

    const lightboxImage =
      document.getElementById(
        'lightbox-image'
      );

    const closeButton =
      document.getElementById(
        'lightbox-close'
      );

    const prevButton =
      document.getElementById(
        'lightbox-prev'
      );

    const nextButton =
      document.getElementById(
        'lightbox-next'
      );

    const zoomInButton =
      document.getElementById(
        'lightbox-zoom-in'
      );

    const zoomOutButton =
      document.getElementById(
        'lightbox-zoom-out'
      );

    const resetButton =
      document.getElementById(
        'lightbox-reset'
      );


    if (
      !lightbox ||
      !lightboxContent ||
      !lightboxImage
    ) {

      return;

    }


    /* =====================================================
       ZOOM SETTINGS
    ===================================================== */

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 5;
    const ZOOM_STEP = 0.25;


    let zoomLevel = 1;

    let imageX = 0;
    let imageY = 0;


    /* =====================================================
       DRAG
    ===================================================== */

    let isDragging = false;

    let dragStartX = 0;
    let dragStartY = 0;

    let dragStartImageX = 0;
    let dragStartImageY = 0;


    /* =====================================================
       IMAGE LIST
    ===================================================== */

    let lightboxImages = [];

    let currentImageIndex = 0;


    /* =====================================================
       GET IMAGES
    ===================================================== */

    function getLightboxImages() {

      return [
        ...document.querySelectorAll(
          '.portfolio-card img, .store-card img, .asset-card img, .hero-slideshow img'
        )
      ].filter(
        function (img) {

          const card =
            img.closest('article');


          if (
            card &&
            card.hidden
          ) {

            return false;

          }


          return img.src;

        }
      );

    }


    /* =====================================================
       UPDATE ZOOM
    ===================================================== */

    function updateZoom() {

      lightboxImage.style.transform =
        `translate3d(${imageX}px, ${imageY}px, 0) scale(${zoomLevel})`;


      lightboxImage.style.cursor =
        zoomLevel > 1
          ? 'grab'
          : 'zoom-in';


      if (resetButton) {

        resetButton.innerHTML = `
          <span class="zoom-percent">
            ${Math.round(zoomLevel * 100)}%
          </span>
        `;

      }

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetZoom() {

      zoomLevel = 1;

      imageX = 0;
      imageY = 0;

      updateZoom();

    }


    /* =====================================================
       ZOOM IN
    ===================================================== */

    function zoomIn() {

      zoomLevel +=
        ZOOM_STEP;


      if (
        zoomLevel > MAX_ZOOM
      ) {

        zoomLevel =
          MAX_ZOOM;

      }


      updateZoom();

    }


    /* =====================================================
       ZOOM OUT
    ===================================================== */

    function zoomOut() {

      zoomLevel -=
        ZOOM_STEP;


      if (
        zoomLevel < MIN_ZOOM
      ) {

        zoomLevel =
          MIN_ZOOM;

      }


      if (
        zoomLevel === 1
      ) {

        imageX = 0;
        imageY = 0;

      }


      updateZoom();

    }


    /* =====================================================
       SHOW CURRENT IMAGE
    ===================================================== */

    function showLightboxImage() {

      const image =
        lightboxImages[
          currentImageIndex
        ];


      if (!image) {
        return;
      }


      lightboxImage.src =
        image.currentSrc ||
        image.src;


      lightboxImage.alt =
        image.alt || '';


      resetZoom();

    }


    /* =====================================================
       OPEN
    ===================================================== */

    function openLightbox(image) {

      lightboxImages =
        getLightboxImages();


      currentImageIndex =
        lightboxImages.indexOf(
          image
        );


      if (
        currentImageIndex < 0
      ) {

        currentImageIndex = 0;

      }


      showLightboxImage();


      lightbox.hidden = false;

      lightbox.setAttribute(
        'aria-hidden',
        'false'
      );


      document.body.classList.add(
        'lightbox-open'
      );

    }


    /* =====================================================
       CLOSE
    ===================================================== */

    function closeLightbox() {

      lightbox.hidden = true;

      lightbox.setAttribute(
        'aria-hidden',
        'true'
      );


      lightboxImage.src = '';


      document.body.classList.remove(
        'lightbox-open'
      );


      resetZoom();

    }


    /* =====================================================
       PREVIOUS
    ===================================================== */

    function showPreviousImage() {

      if (
        lightboxImages.length <= 1
      ) {

        return;

      }


      currentImageIndex--;


      if (
        currentImageIndex < 0
      ) {

        currentImageIndex =
          lightboxImages.length - 1;

      }


      showLightboxImage();

    }


    /* =====================================================
       NEXT
    ===================================================== */

    function showNextImage() {

      if (
        lightboxImages.length <= 1
      ) {

        return;

      }


      currentImageIndex++;


      if (
        currentImageIndex >=
        lightboxImages.length
      ) {

        currentImageIndex = 0;

      }


      showLightboxImage();

    }


    /* =====================================================
       CLICK WEBSITE IMAGES
    ===================================================== */

    document.addEventListener(
      'click',
      function (event) {

        const image =
          event.target.closest(
            '.portfolio-card img, .store-card img, .asset-card img, .hero-slideshow img'
          );


        if (!image) {
          return;
        }


        openLightbox(image);

      }
    );


    /* =====================================================
       CLOSE
    ===================================================== */

    if (closeButton) {

      closeButton.addEventListener(
        'click',
        function (event) {

          event.stopPropagation();

          closeLightbox();

        }
      );

    }


    /* =====================================================
       PREVIOUS
    ===================================================== */

    if (prevButton) {

      prevButton.addEventListener(
        'click',
        function (event) {

          event.stopPropagation();

          showPreviousImage();

        }
      );

    }


    /* =====================================================
       NEXT
    ===================================================== */

    if (nextButton) {

      nextButton.addEventListener(
        'click',
        function (event) {

          event.stopPropagation();

          showNextImage();

        }
      );

    }


    /* =====================================================
       ZOOM IN
    ===================================================== */

    if (zoomInButton) {

      zoomInButton.addEventListener(
        'click',
        function (event) {

          event.stopPropagation();

          zoomIn();

        }
      );

    }


    /* =====================================================
       ZOOM OUT
    ===================================================== */

    if (zoomOutButton) {

      zoomOutButton.addEventListener(
        'click',
        function (event) {

          event.stopPropagation();

          zoomOut();

        }
      );

    }


    /* =====================================================
       RESET
    ===================================================== */

    if (resetButton) {

      resetButton.addEventListener(
        'click',
        function (event) {

          event.stopPropagation();

          resetZoom();

        }
      );

    }


    /* =====================================================
       CLICK OUTSIDE IMAGE
    ===================================================== */

    lightbox.addEventListener(
      'click',
      function (event) {

        if (
          event.target === lightbox ||
          event.target === lightboxContent
        ) {

          closeLightbox();

        }

      }
    );


    /* =====================================================
       MOUSE WHEEL ZOOM
    ===================================================== */

    lightboxContent.addEventListener(
      'wheel',
      function (event) {

        event.preventDefault();


        if (
          event.deltaY < 0
        ) {

          zoomIn();

        } else {

          zoomOut();

        }

      },
      {
        passive: false
      }
    );


    /* =====================================================
       MOUSE DRAG
    ===================================================== */

    lightboxContent.addEventListener(
      'mousedown',
      function (event) {

        if (
          zoomLevel <= 1
        ) {

          return;

        }


        isDragging = true;


        dragStartX =
          event.clientX;

        dragStartY =
          event.clientY;


        dragStartImageX =
          imageX;

        dragStartImageY =
          imageY;


        lightboxImage.style.cursor =
          'grabbing';

      }
    );


    document.addEventListener(
      'mousemove',
      function (event) {

        if (!isDragging) {
          return;
        }


        imageX =
          dragStartImageX +
          (
            event.clientX -
            dragStartX
          );


        imageY =
          dragStartImageY +
          (
            event.clientY -
            dragStartY
          );


        updateZoom();


        lightboxImage.style.cursor =
          'grabbing';

      }
    );


    document.addEventListener(
      'mouseup',
      function () {

        if (!isDragging) {
          return;
        }


        isDragging = false;


        lightboxImage.style.cursor =
          zoomLevel > 1
            ? 'grab'
            : 'zoom-in';

      }
    );


    /* =====================================================
       TOUCH / PINCH
    ===================================================== */

    let touchStartDistance = 0;

    let touchStartZoom = 1;


    let touchStartX = 0;
    let touchStartY = 0;


    let touchStartImageX = 0;
    let touchStartImageY = 0;


    function getTouchDistance(
      touches
    ) {

      const dx =
        touches[0].clientX -
        touches[1].clientX;


      const dy =
        touches[0].clientY -
        touches[1].clientY;


      return Math.sqrt(
        dx * dx +
        dy * dy
      );

    }


    lightboxContent.addEventListener(
      'touchstart',
      function (event) {

        if (
          event.touches.length === 2
        ) {

          touchStartDistance =
            getTouchDistance(
              event.touches
            );


          touchStartZoom =
            zoomLevel;

        }


        else if (
          event.touches.length === 1 &&
          zoomLevel > 1
        ) {

          touchStartX =
            event.touches[0].clientX;


          touchStartY =
            event.touches[0].clientY;


          touchStartImageX =
            imageX;


          touchStartImageY =
            imageY;

        }

      },
      {
        passive: false
      }
    );


    lightboxContent.addEventListener(
      'touchmove',
      function (event) {

        event.preventDefault();


        /* PINCH */

        if (
          event.touches.length === 2
        ) {

          const currentDistance =
            getTouchDistance(
              event.touches
            );


          if (
            touchStartDistance > 0
          ) {

            const ratio =
              currentDistance /
              touchStartDistance;


            zoomLevel =
              touchStartZoom *
              ratio;


            if (
              zoomLevel <
              MIN_ZOOM
            ) {

              zoomLevel =
                MIN_ZOOM;

            }


            if (
              zoomLevel >
              MAX_ZOOM
            ) {

              zoomLevel =
                MAX_ZOOM;

            }


            updateZoom();

          }

        }


        /* TOUCH DRAG */

        else if (
          event.touches.length === 1 &&
          zoomLevel > 1
        ) {

          const currentX =
            event.touches[0].clientX;


          const currentY =
            event.touches[0].clientY;


          imageX =
            touchStartImageX +
            (
              currentX -
              touchStartX
            );


          imageY =
            touchStartImageY +
            (
              currentY -
              touchStartY
            );


          updateZoom();

        }

      },
      {
        passive: false
      }
    );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
      'keydown',
      function (event) {

        if (
          lightbox.hidden
        ) {

          return;

        }


        /* ESC */

        if (
          event.key === 'Escape'
        ) {

          closeLightbox();

        }


        /* LEFT */

        else if (
          event.key === 'ArrowLeft'
        ) {

          showPreviousImage();

        }


        /* RIGHT */

        else if (
          event.key === 'ArrowRight'
        ) {

          showNextImage();

        }


        /* PLUS */

        else if (
          event.key === '+' ||
          event.key === '='
        ) {

          zoomIn();

        }


        /* MINUS */

        else if (
          event.key === '-'
        ) {

          zoomOut();

        }


        /* RESET */

        else if (
          event.key.toLowerCase() === 'r'
        ) {

          resetZoom();

        }

      }
    );

  }
);
