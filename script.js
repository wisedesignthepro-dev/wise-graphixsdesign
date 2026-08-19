const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const translations = {
  ht: { name:'Kreyòl', navWork:'Travay mwen yo', navStore:'Boutik PSD', navFree:'Asset gratis', navServices:'Sèvis', heroEyebrow:'STIDYO DESIGN KREYATIF', heroTitle:'Design ki<br><em>fè moun sonje w.</em>', heroText:'Kreyasyon grafik premium, PSD editab ak resous dijital pou mak ak biznis ki vle kanpe apa.', heroPrimary:'Gade travay mwen ↗', heroSecondary:'Achte PSD →', workEyebrow:'01 / PORTFOLIO', workTitle:'Travay <em>mwen yo.</em>', filterAll:'Tout', filterFlyers:'Flyers', filterCovers:'Covers', filterLabels:'Étiquèt', filterBranding:'Branding', portfolioFlyer:'Flyer Campaign', portfolioCover:'Cover Design', portfolioLabel:'Product Label', portfolioBrand:'Brand Identity', portfolioEvent:'Event Flyer', portfolioEditorial:'Editorial Cover', storeEyebrow:'02 / DIGITAL STORE', storeTitle:'Boutik <em>PSD.</em>', buy:'ACHTE KOUNYE A ↗', storeNote:'— Estrikti checkout la pare pou koneksyon backend.', freeEyebrow:'03 / RESOUS GRATIS', freeTitle:'Asset <em>gratis.</em>', assetPNG:'PNG', assetTextures:'Textures', assetMockups:'Mockups', assetIntro:'Klike sou yon kategori pou wè fichye yo, epi telechaje sa ou bezwen an.', assetLight:'Efè limyè PNG', assetLightDesc:'Efè limyè transparan', assetSparkles:'Paillettes lò PNG', assetSparklesDesc:'Paillettes transparan', assetShapes:'Fòm abstrè PNG', assetShapesDesc:'Fòm transparan', assetGrain:'Teksti grenn', assetGrainDesc:'Teksti rezolisyon wo', assetPaper:'Teksti papye', assetPaperDesc:'Teksti rezolisyon wo', assetGold:'Teksti lò', assetGoldDesc:'Teksti rezolisyon wo', assetCard:'Mockup kat', assetCardDesc:'Mockup prezantasyon', assetPhone:'Mockup telefòn', assetPhoneDesc:'Mockup prezantasyon', assetPoster:'Mockup afich', assetPosterDesc:'Mockup prezantasyon', download:'TELECHAJE GRATIS ↓', checkoutMessage:'MonCash / checkout backend ap konekte nan etap kap vini an.', servicesEyebrow:'04 / SÈVIS', servicesTitle:'Sèvis pou <em>biznis.</em>', service1:'01 — Logo & Branding', service2:'02 — Flyer & Social Media', service3:'03 — Packaging & Étiquèt', service4:'04 — Motion Design', footer:'Design grafik · PSD · Asset dijital', whatsapp:'WhatsApp' },
  en: { name:'English', navWork:'My work', navStore:'PSD store', navFree:'Free assets', navServices:'Services', heroEyebrow:'CREATIVE DESIGN STUDIO', heroTitle:'Design that<br><em>makes you memorable.</em>', heroText:'Premium graphic design, editable PSD files and digital resources for brands and businesses that want to stand out.', heroPrimary:'View my work ↗', heroSecondary:'Buy PSD →', workEyebrow:'01 / PORTFOLIO', workTitle:'My <em>work.</em>', filterAll:'All', filterFlyers:'Flyers', filterCovers:'Covers', filterLabels:'Labels', filterBranding:'Branding', portfolioFlyer:'Flyer Campaign', portfolioCover:'Cover Design', portfolioLabel:'Product Label', portfolioBrand:'Brand Identity', portfolioEvent:'Event Flyer', portfolioEditorial:'Editorial Cover', storeEyebrow:'02 / DIGITAL STORE', storeTitle:'PSD <em>store.</em>', buy:'BUY NOW ↗', storeNote:'— Checkout structure is ready for a backend connection.', freeEyebrow:'03 / FREE RESOURCES', freeTitle:'Free <em>assets.</em>', assetPNG:'PNG', assetTextures:'Textures', assetMockups:'Mockups', assetIntro:'Choose a category to see its files, then download what you need.', assetLight:'Light Effects PNG', assetLightDesc:'Transparent light effect', assetSparkles:'Gold Sparkles PNG', assetSparklesDesc:'Transparent sparkles', assetShapes:'Abstract Shapes PNG', assetShapesDesc:'Transparent shapes', assetGrain:'Grain Texture', assetGrainDesc:'High-resolution texture', assetPaper:'Paper Texture', assetPaperDesc:'High-resolution texture', assetGold:'Gold Texture', assetGoldDesc:'High-resolution texture', assetCard:'Card Mockup', assetCardDesc:'Presentation mockup', assetPhone:'Phone Mockup', assetPhoneDesc:'Presentation mockup', assetPoster:'Poster Mockup', assetPosterDesc:'Presentation mockup', download:'FREE DOWNLOAD ↓', checkoutMessage:'MonCash / checkout backend will be connected in the next step.', servicesEyebrow:'04 / SERVICES', servicesTitle:'Services for <em>business.</em>', service1:'01 — Logo & Branding', service2:'02 — Flyer & Social Media', service3:'03 — Packaging & Labels', service4:'04 — Motion Design', footer:'Graphic design · PSD · Digital assets', whatsapp:'WhatsApp' },
  fr: { name:'Français', navWork:'Mes créations', navStore:'Boutique PSD', navFree:'Ressources gratuites', navServices:'Services', heroEyebrow:'STUDIO DE DESIGN CRÉATIF', heroTitle:'Un design qui<br><em>vous rend mémorable.</em>', heroText:'Créations graphiques premium, PSD modifiables et ressources numériques pour les marques et entreprises qui veulent se démarquer.', heroPrimary:'Voir mes créations ↗', heroSecondary:'Acheter des PSD →', workEyebrow:'01 / PORTFOLIO', workTitle:'Mes <em>créations.</em>', filterAll:'Tout', filterFlyers:'Flyers', filterCovers:'Couvertures', filterLabels:'Étiquettes', filterBranding:'Identité de marque', portfolioFlyer:'Campagne flyer', portfolioCover:'Design de couverture', portfolioLabel:'Étiquette produit', portfolioBrand:'Identité de marque', portfolioEvent:'Flyer événement', portfolioEditorial:'Couverture éditoriale', storeEyebrow:'02 / BOUTIQUE NUMÉRIQUE', storeTitle:'Boutique <em>PSD.</em>', buy:'ACHETER MAINTENANT ↗', storeNote:'— La structure de paiement est prête pour une connexion au backend.', freeEyebrow:'03 / RESSOURCES GRATUITES', freeTitle:'Ressources <em>gratuites.</em>', assetPNG:'PNG', assetTextures:'Textures', assetMockups:'Mockups', assetIntro:'Choisissez une catégorie pour voir les fichiers, puis téléchargez ce dont vous avez besoin.', assetLight:'Effets lumineux PNG', assetLightDesc:'Effet lumineux transparent', assetSparkles:'Paillettes dorées PNG', assetSparklesDesc:'Paillettes transparentes', assetShapes:'Formes abstraites PNG', assetShapesDesc:'Formes transparentes', assetGrain:'Texture grain', assetGrainDesc:'Texture haute résolution', assetPaper:'Texture papier', assetPaperDesc:'Texture haute résolution', assetGold:'Texture dorée', assetGoldDesc:'Texture haute résolution', assetCard:'Mockup carte', assetCardDesc:'Mockup de présentation', assetPhone:'Mockup téléphone', assetPhoneDesc:'Mockup de présentation', assetPoster:'Mockup affiche', assetPosterDesc:'Mockup de présentation', download:'TÉLÉCHARGER GRATUITEMENT ↓', checkoutMessage:'MonCash / le backend de paiement sera connecté à la prochaine étape.', servicesEyebrow:'04 / SERVICES', servicesTitle:'Services pour les <em>entreprises.</em>', service1:'01 — Logo & Identité de marque', service2:'02 — Flyer & Réseaux sociaux', service3:'03 — Packaging & Étiquettes', service4:'04 — Motion Design', footer:'Design graphique · PSD · Ressources numériques', whatsapp:'WhatsApp' },
  es: { name:'Español', navWork:'Mi trabajo', navStore:'Tienda PSD', navFree:'Recursos gratis', navServices:'Servicios', heroEyebrow:'ESTUDIO CREATIVO DE DISEÑO', heroTitle:'Diseño que<br><em>te hace memorable.</em>', heroText:'Diseño gráfico premium, PSD editables y recursos digitales para marcas y negocios que quieren destacar.', heroPrimary:'Ver mi trabajo ↗', heroSecondary:'Comprar PSD →', workEyebrow:'01 / PORTAFOLIO', workTitle:'Mi <em>trabajo.</em>', filterAll:'Todo', filterFlyers:'Flyers', filterCovers:'Portadas', filterLabels:'Etiquetas', filterBranding:'Branding', portfolioFlyer:'Campaña de flyer', portfolioCover:'Diseño de portada', portfolioLabel:'Etiqueta de producto', portfolioBrand:'Identidad de marca', portfolioEvent:'Flyer de evento', portfolioEditorial:'Portada editorial', storeEyebrow:'02 / TIENDA DIGITAL', storeTitle:'Tienda <em>PSD.</em>', buy:'COMPRAR AHORA ↗', storeNote:'— La estructura de pago está lista para conectarse al backend.', freeEyebrow:'03 / RECURSOS GRATUITOS', freeTitle:'Recursos <em>gratis.</em>', assetPNG:'PNG', assetTextures:'Texturas', assetMockups:'Mockups', assetIntro:'Elige una categoría para ver los archivos y descarga lo que necesitas.', assetLight:'Efectos de luz PNG', assetLightDesc:'Efecto de luz transparente', assetSparkles:'Destellos dorados PNG', assetSparklesDesc:'Destellos transparentes', assetShapes:'Formas abstractas PNG', assetShapesDesc:'Formas transparentes', assetGrain:'Textura granulada', assetGrainDesc:'Textura de alta resolución', assetPaper:'Textura de papel', assetPaperDesc:'Textura de alta resolución', assetGold:'Textura dorada', assetGoldDesc:'Textura de alta resolución', assetCard:'Mockup de tarjeta', assetCardDesc:'Mockup de presentación', assetPhone:'Mockup de teléfono', assetPhoneDesc:'Mockup de presentación', assetPoster:'Mockup de póster', assetPosterDesc:'Mockup de presentación', download:'DESCARGA GRATIS ↓', checkoutMessage:'El backend de pago MonCash se conectará en el próximo paso.', servicesEyebrow:'04 / SERVICIOS', servicesTitle:'Servicios para <em>negocios.</em>', service1:'01 — Logo & Branding', service2:'02 — Flyer & Redes sociales', service3:'03 — Packaging & Etiquetas', service4:'04 — Motion Design', footer:'Diseño gráfico · PSD · Recursos digitales', whatsapp:'WhatsApp' }
};

const assets = {
  png:[
    ['images/gato00.png','assetCake','assetCakeDesc'],
    ['images/balonFet00.png','assetBalloons','assetBalloonsDesc'],
    ['images/star00.png','assetStars','assetStarsDesc'],
    ['images/asset4.png','asset4','asset4Desc'],
    ['images/asset5.png','asset5','asset5Desc'],
    ['images/asset6.png','asset6','asset6Desc']
  ],

  background:[
    ['images/MEN STANDARD.png','assetBackground1','assetBackground1Desc'],
    ['images/background2.jpg','assetBackground2','assetBackground2Desc'],
    ['images/background3.jpg','assetBackground3','assetBackground3Desc'],
    ['images/background4.jpg','assetBackground4','assetBackground4Desc'],
    ['images/background5.jpg','assetBackground5','assetBackground5Desc'],
    ['images/background6.jpg','assetBackground6','assetBackground6Desc']
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

const psdProducts = {
  free: [
    {
      image: "images/free-psd-01.jpg",
      title: "Free Flyer PSD",
      description: "PSD editab gratis",
      file: "files/free-flyer-01.psd"
    },

    {
      image: "images/free-psd-02.jpg",
      title: "Free Social Media PSD",
      description: "PSD editab gratis",
      file: "files/free-social-02.psd"
    }
  ],

  paid: [
    {
      image: "images/paid-psd-01.jpg",
      title: "Luxury Flyer PSD",
      description: "PSD premium editab",
      price: "500 HTG"
    },

    {
      image: "images/paid-psd-02.jpg",
      title: "Premium Social Pack",
      description: "Pack PSD premium",
      price: "750 HTG"
    },

    {
      image: "images/paid-psd-03.jpg",
      title: "Premium Label PSD",
      description: "PSD label premium",
      price: "600 HTG"
    }
  ]
};
function renderPSDProducts() {
  const freeGrid = $('#free-psd-grid');
  const paidGrid = $('#paid-psd-grid');

  if (freeGrid) {
    freeGrid.innerHTML = psdProducts.free.map(product => `
      <article class="store-card reveal visible">
        <img src="${product.image}" alt="${product.title}">

        <h3>${product.title}</h3>

        <p>${product.description}</p>

        <a
          class="download"
          href="${product.file}"
          download
        >
          <svg class="download-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 3v10m0 0 4-4m-4 4-4-4M5 15v4h14v-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          ${translations[currentLanguage].download}
        </a>
      </article>
    `).join('');
  }

  if (paidGrid) {
    paidGrid.innerHTML = psdProducts.paid.map(product => `
      <article class="store-card reveal visible">
        <img src="${product.image}" alt="${product.title}">

        <h3>${product.title}</h3>

        <strong>${product.price}</strong>

        <button
          class="buy"
          type="button"
          data-product="${product.title}"
        >
          ${translations[currentLanguage].buy}
        </button>
      </article>
    `).join('');
  }

  $$('.buy').forEach(button => {
    button.addEventListener('click', () => {
      alert(translations[currentLanguage].checkoutMessage);
    });
  });
}
Object.values(translations).forEach(t => Object.assign(t, {
  assetCake:'Gato fèt', assetCakeDesc:'PNG gratis',
  assetBalloons:'Balon fèt', assetBalloonsDesc:'PNG gratis',
  assetStars:'Zetwal', assetStarsDesc:'PNG gratis'
}));

let currentLanguage = localStorage.getItem('wise-language') || 'ht';
let currentAssetType = 'png';

function renderAssets(){ const t=translations[currentLanguage]; const downloadLabel=t.download.replace(/\s*↓/g,''); $('#asset-grid').innerHTML=assets[currentAssetType].map(([file,titleKey,descriptionKey])=>`<article class="asset-card reveal visible"><img src="${file}" alt="${t[titleKey]}"><h3>${t[titleKey]}</h3><p>${t[descriptionKey]}</p><a class="download" href="${file}" download><svg class="download-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v10m0 0 4-4m-4 4-4-4M5 15v4h14v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${downloadLabel}</a></article>`).join(''); }
function setLanguage(language){ currentLanguage=language; const t=translations[language]; document.documentElement.lang=language; document.title='WISE.GRAPHIXDESIGN'; $$('[data-i18n]').forEach(el=>{el.textContent=t[el.dataset.i18n] ?? el.textContent}); $$('[data-i18n-html]').forEach(el=>{el.innerHTML=t[el.dataset.i18nHtml] ?? el.innerHTML}); $('#lb').innerHTML=`🌐 ${t.name} <span aria-hidden="true">▾</span>`; localStorage.setItem('wise-language',language); renderAssets();
renderPSDProducts(); }

$('#lb').addEventListener('click',()=>{ const menu=$('#lm'); menu.classList.toggle('open'); $('#lb').setAttribute('aria-expanded',menu.classList.contains('open')); });
$$('[data-lang]').forEach(button=>button.addEventListener('click',()=>{setLanguage(button.dataset.lang);$('#lm').classList.remove('open');$('#lb').setAttribute('aria-expanded','false');}));
document.addEventListener('click',event=>{if(!event.target.closest('.lang')) $('#lm').classList.remove('open');});
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;$$('[data-filter]').forEach(item=>item.classList.toggle('active',item===button));$$('.portfolio-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter;});}));
$$('[data-asset-type]').forEach(button=>button.addEventListener('click',()=>{currentAssetType=button.dataset.assetType;$$('[data-asset-type]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',active);});renderAssets();}));
$$('.buy').forEach(button=>button.addEventListener('click',()=>alert(translations[currentLanguage].checkoutMessage)));
$('#mb').addEventListener('click',()=>{const nav=$('#main-nav');nav.classList.toggle('open');$('#mb').setAttribute('aria-expanded',nav.classList.contains('open'));});
$$('#main-nav a').forEach(link=>link.addEventListener('click',()=>$('#main-nav').classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});$$('.reveal').forEach(el=>observer.observe(el));
setLanguage(currentLanguage);
/* =========================
   HERO SLIDESHOW
========================= */

const heroSlides = document.querySelectorAll(".hero-slideshow .slide");
const heroDots = document.querySelectorAll(".slide-dots .dot");

if (heroSlides.length > 1) {
  let currentSlide = 0;

  heroSlides[0].classList.add("active");

  setInterval(() => {
    const oldSlide = heroSlides[currentSlide];

    currentSlide = (currentSlide + 1) % heroSlides.length;

    const newSlide = heroSlides[currentSlide];

    newSlide.classList.remove("prev");
    newSlide.classList.add("active");

    oldSlide.classList.remove("active");
    oldSlide.classList.add("prev");

    heroDots.forEach(dot => dot.classList.remove("active"));
    heroDots[currentSlide].classList.add("active");

    setTimeout(() => {
      oldSlide.classList.remove("prev");
    }, 1500);

  }, 6000);
}
/* =========================
   IMAGE LIGHTBOX
========================= */

document.addEventListener("DOMContentLoaded", function () {

  const lightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");

  if (!lightbox || !lightboxImage || !lightboxClose) return;

  const images = document.querySelectorAll(
    ".portfolio-card img, .store-grid img, .asset-grid img, .hero-slideshow img"
  );

  images.forEach(function (img) {

    img.style.cursor = "zoom-in";

    img.addEventListener("click", function () {

      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "";

      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");

    });

  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.classList.remove("lightbox-open");
  }

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });

});
/* ==================================================
   IMAGE LIGHTBOX + ZOOM
================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const lightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxContent = document.getElementById("lightbox-content");

  const closeButton = document.getElementById("lightbox-close");

  const zoomInButton = document.getElementById("lightbox-zoom-in");
  const zoomOutButton = document.getElementById("lightbox-zoom-out");
  const resetButton = document.getElementById("lightbox-reset");

  if (
    !lightbox ||
    !lightboxImage ||
    !lightboxContent ||
    !closeButton
  ) {
    return;
  }


  /* =========================
     ZOOM SETTINGS
  ========================= */

  let scale = 1;

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.25;

  let positionX = 0;
  let positionY = 0;

  let isDragging = false;

  let startX = 0;
  let startY = 0;

  let startPositionX = 0;
  let startPositionY = 0;


  /* =========================
     UPDATE IMAGE
  ========================= */

  function updateImage() {

    lightboxImage.style.transform =
      `translate(${positionX}px, ${positionY}px) scale(${scale})`;

  }


  /* =========================
     RESET
  ========================= */

  function resetZoom() {

    scale = 1;

    positionX = 0;
    positionY = 0;

    updateImage();

  }


  /* =========================
     ZOOM IN
  ========================= */

  function zoomIn() {

    scale += ZOOM_STEP;

    if (scale > MAX_ZOOM) {
      scale = MAX_ZOOM;
    }

    updateImage();

  }


  /* =========================
     ZOOM OUT
  ========================= */

  function zoomOut() {

    scale -= ZOOM_STEP;

    if (scale < MIN_ZOOM) {
      scale = MIN_ZOOM;
    }

    if (scale === 1) {
      positionX = 0;
      positionY = 0;
    }

    updateImage();

  }


  /* =========================
     OPEN LIGHTBOX
  ========================= */

  function openLightbox(image) {

    lightboxImage.src = image.currentSrc || image.src;

    lightboxImage.alt = image.alt || "";

    resetZoom();

    lightbox.hidden = false;

    document.body.classList.add("lightbox-open");

  }


  /* =========================
     CLOSE LIGHTBOX
  ========================= */

  function closeLightbox() {

    lightbox.hidden = true;

    lightboxImage.src = "";

    document.body.classList.remove("lightbox-open");

    resetZoom();

  }


  /* =========================
     CLICK ON WEBSITE IMAGES
  ========================= */

  document.addEventListener("click", function (event) {

    const image = event.target.closest(
      ".portfolio-card img, .store-grid img, .asset-grid img, .hero-slideshow img"
    );

    if (!image) {
      return;
    }

    openLightbox(image);

  });


  /* =========================
     CLOSE BUTTON
  ========================= */

  closeButton.addEventListener("click", function () {

    closeLightbox();

  });


  /* =========================
     CLICK OUTSIDE IMAGE
  ========================= */

  lightbox.addEventListener("click", function (event) {

    if (event.target === lightbox) {

      closeLightbox();

    }

  });


  /* =========================
     ZOOM BUTTONS
  ========================= */

  if (zoomInButton) {

    zoomInButton.addEventListener("click", function () {

      zoomIn();

    });

  }


  if (zoomOutButton) {

    zoomOutButton.addEventListener("click", function () {

      zoomOut();

    });

  }


  if (resetButton) {

    resetButton.addEventListener("click", function () {

      resetZoom();

    });

  }


  /* =========================
     MOUSE WHEEL ZOOM
  ========================= */

  lightboxContent.addEventListener(
    "wheel",
    function (event) {

      event.preventDefault();

      if (event.deltaY < 0) {

        zoomIn();

      } else {

        zoomOut();

      }

    },
    { passive: false }
  );


  /* =========================
     MOUSE DRAG
  ========================= */

  lightboxContent.addEventListener(
    "mousedown",
    function (event) {

      if (scale <= 1) {
        return;
      }

      isDragging = true;

      startX = event.clientX;
      startY = event.clientY;

      startPositionX = positionX;
      startPositionY = positionY;

    }
  );


  document.addEventListener(
    "mousemove",
    function (event) {

      if (!isDragging) {
        return;
      }

      positionX =
        startPositionX + (event.clientX - startX);

      positionY =
        startPositionY + (event.clientY - startY);

      updateImage();

    }
  );


  document.addEventListener(
    "mouseup",
    function () {

      isDragging = false;

    }
  );


  /* =========================
     TOUCH / PINCH ZOOM
  ========================= */

  let touchStartDistance = 0;

  let touchStartScale = 1;

  let touchStartX = 0;
  let touchStartY = 0;

  let touchStartPositionX = 0;
  let touchStartPositionY = 0;


  function getTouchDistance(touches) {

    const dx =
      touches[0].clientX -
      touches[1].clientX;

    const dy =
      touches[0].clientY -
      touches[1].clientY;

    return Math.sqrt(
      dx * dx + dy * dy
    );

  }


  lightboxContent.addEventListener(
    "touchstart",
    function (event) {

      if (event.touches.length === 2) {

        touchStartDistance =
          getTouchDistance(event.touches);

        touchStartScale = scale;

      }

      else if (event.touches.length === 1) {

        if (scale <= 1) {
          return;
        }

        touchStartX =
          event.touches[0].clientX;

        touchStartY =
          event.touches[0].clientY;

        touchStartPositionX = positionX;

        touchStartPositionY = positionY;

      }

    },
    { passive: false }
  );


  lightboxContent.addEventListener(
    "touchmove",
    function (event) {

      event.preventDefault();


      /* PINCH */

      if (event.touches.length === 2) {

        const currentDistance =
          getTouchDistance(event.touches);

        if (touchStartDistance > 0) {

          const ratio =
            currentDistance /
            touchStartDistance;

          scale =
            touchStartScale * ratio;

          if (scale < MIN_ZOOM) {
            scale = MIN_ZOOM;
          }

          if (scale > MAX_ZOOM) {
            scale = MAX_ZOOM;
          }

          updateImage();

        }

      }


      /* DRAG */

      else if (
        event.touches.length === 1 &&
        scale > 1
      ) {

        const currentX =
          event.touches[0].clientX;

        const currentY =
          event.touches[0].clientY;

        positionX =
          touchStartPositionX +
          (currentX - touchStartX);

        positionY =
          touchStartPositionY +
          (currentY - touchStartY);

        updateImage();

      }

    },
    { passive: false }
  );


  /* =========================
     KEYBOARD
  ========================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (lightbox.hidden) {
        return;
      }


      /* ESC */

      if (event.key === "Escape") {

        closeLightbox();

      }


      /* + */

      if (
        event.key === "+" ||
        event.key === "="
      ) {

        zoomIn();

      }


      /* - */

      if (event.key === "-") {

        zoomOut();

      }


      /* R */

      if (
        event.key.toLowerCase() === "r"
      ) {

        resetZoom();

      }

    }
  );

});

/* =========================
   LIGHTBOX ARROWS
========================= */

const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

let lightboxImages = [];
let currentLightboxIndex = 0;

function getLightboxImages() {
  return [
    ...document.querySelectorAll(
      ".portfolio-card img, .store-card img, .asset-card img, .hero-slideshow img"
    )
  ].filter(img => {
    const card = img.closest("article");

    if (card && card.hidden) {
      return false;
    }

    return img.src;
  });
}

function showLightboxImage() {

  const image = lightboxImages[currentLightboxIndex];

  if (!image) return;

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt || "";

  zoomLevel = 1;
  imageX = 0;
  imageY = 0;

  updateZoom();
}

function openLightboxWithNavigation(image) {

  lightboxImages = getLightboxImages();

  currentLightboxIndex = lightboxImages.indexOf(image);

  if (currentLightboxIndex < 0) {
    currentLightboxIndex = 0;
  }

  showLightboxImage();

  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}


/* ← IMAG ANVAN */

function showPreviousImage() {

  if (lightboxImages.length <= 1) return;

  currentLightboxIndex--;

  if (currentLightboxIndex < 0) {
    currentLightboxIndex = lightboxImages.length - 1;
  }

  showLightboxImage();
}


/* → IMAG SWIVAN */

function showNextImage() {

  if (lightboxImages.length <= 1) return;

  currentLightboxIndex++;

  if (currentLightboxIndex >= lightboxImages.length) {
    currentLightboxIndex = 0;
  }

  showLightboxImage();
}


/* BOUTON ← */

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", function (event) {

    event.stopPropagation();

    showPreviousImage();

  });
}


/* BOUTON → */

if (lightboxNext) {
  lightboxNext.addEventListener("click", function (event) {

    event.stopPropagation();

    showNextImage();

  });
}
