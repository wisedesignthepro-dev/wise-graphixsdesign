/* =========================================================
   WISE.GRAPHIXDESIGN — script.js FINAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const menuButton = document.getElementById("mb");
  const mainNav = document.getElementById("main-nav");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =======================================================
     LANGUAGE MENU
  ======================================================= */

  const languageButton = document.getElementById("lb");
  const languageMenu = document.getElementById("lm");

  if (languageButton && languageMenu) {

    languageButton.addEventListener("click", event => {
      event.stopPropagation();

      const open = languageMenu.classList.toggle("open");

      languageButton.setAttribute(
        "aria-expanded",
        String(open)
      );
    });

    languageMenu.querySelectorAll("[data-lang]").forEach(button => {

      button.addEventListener("click", () => {

        const language = button.dataset.lang;

        setLanguage(language);

        languageMenu.classList.remove("open");

        languageButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

    document.addEventListener("click", event => {

      if (
        !languageMenu.contains(event.target) &&
        !languageButton.contains(event.target)
      ) {
        languageMenu.classList.remove("open");

        languageButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }

    });
  }


  /* =======================================================
     TRANSLATIONS
  ======================================================= */

  const translations = {

    ht: {

      navWork: "Travay mwen yo",
      navStore: "Boutik PSD",
      navFree: "Asset gratis",
      navServices: "Sèvis",

      heroEyebrow: "STIDYO DESIGN KREYATIF",

      heroTitle:
        "Design ki<br><em>fè moun sonje w.</em>",

      heroText:
        "Kreyasyon grafik premium, PSD editab ak resous dijital pou mak ak biznis ki vle kanpe apa.",

      heroPrimary:
        "Gade travay mwen ↗",

      heroSecondary:
        "Achte PSD →",

      workEyebrow:
        "01 / PORTFOLIO",

      workTitle:
        "Travay <em>mwen yo.</em>",

      filterAll:
        "Tout",

      filterFlyers:
        "Flyers",

      filterCovers:
        "Covers",

      filterLabels:
        "Étiquèt",

      filterBranding:
        "Branding",

      storeEyebrow:
        "02 / DIGITAL STORE",

      storeTitle:
        "Boutik <em>PSD.</em>",

      freeEyebrow:
        "03 / FREE RESOURCES",

      freeTitle:
        "Asset <em>gratis.</em>",

      assetPNG:
        "PNG",

      assetTextures:
        "Textures",

      assetMockups:
        "Mockups",

      assetIntro:
        "Klike sou yon kategori pou wè fichye yo, epi telechaje sa ou bezwen an.",

      servicesEyebrow:
        "04 / SERVICES",

      servicesTitle:
        "Sèvis pou <em>biznis.</em>",

      service1:
        "01 — Logo & Branding",

      service2:
        "02 — Flyer & Social Media",

      service3:
        "03 — Packaging & Étiquèt",

      service4:
        "04 — Motion Design",

      portfolioFlyer:
        "Flyer Event",

      portfolioCover:
        "Cover Design",

      portfolioLabel:
        "Product Label",

      portfolioBrand:
        "Brand Identity",

      storeNote:
        "— Estrikti checkout la pare pou koneksyon backend.",

      footer:
        "Design grafik · PSD · Asset dijital",

      whatsapp:
        "WhatsApp"

    },


    en: {

      navWork:
        "My Work",

      navStore:
        "PSD Store",

      navFree:
        "Free Assets",

      navServices:
        "Services",

      heroEyebrow:
        "CREATIVE DESIGN STUDIO",

      heroTitle:
        "Design that<br><em>makes you memorable.</em>",

      heroText:
        "Premium graphic design, editable PSD files and digital resources for brands and businesses that want to stand out.",

      heroPrimary:
        "View my work ↗",

      heroSecondary:
        "Buy PSD →",

      workEyebrow:
        "01 / PORTFOLIO",

      workTitle:
        "My <em>work.</em>",

      filterAll:
        "All",

      filterFlyers:
        "Flyers",

      filterCovers:
        "Covers",

      filterLabels:
        "Labels",

      filterBranding:
        "Branding",

      storeEyebrow:
        "02 / DIGITAL STORE",

      storeTitle:
        "PSD <em>Store.</em>",

      freeEyebrow:
        "03 / FREE RESOURCES",

      freeTitle:
        "Free <em>Assets.</em>",

      assetPNG:
        "PNG",

      assetTextures:
        "Textures",

      assetMockups:
        "Mockups",

      assetIntro:
        "Choose a category to view the files and download what you need.",

      servicesEyebrow:
        "04 / SERVICES",

      servicesTitle:
        "Services for <em>business.</em>",

      service1:
        "01 — Logo & Branding",

      service2:
        "02 — Flyer & Social Media",

      service3:
        "03 — Packaging & Labels",

      service4:
        "04 — Motion Design",

      portfolioFlyer:
        "Event Flyer",

      portfolioCover:
        "Cover Design",

      portfolioLabel:
        "Product Label",

      portfolioBrand:
        "Brand Identity",

      storeNote:
        "— Checkout structure ready for backend connection.",

      footer:
        "Graphic Design · PSD · Digital Assets",

      whatsapp:
        "WhatsApp"

    },


    fr: {

      navWork:
        "Mes travaux",

      navStore:
        "Boutique PSD",

      navFree:
        "Assets gratuits",

      navServices:
        "Services",

      heroEyebrow:
        "STUDIO DE DESIGN CRÉATIF",

      heroTitle:
        "Un design qui<br><em>vous rend mémorable.</em>",

      heroText:
        "Créations graphiques premium, fichiers PSD modifiables et ressources digitales pour les marques et entreprises qui veulent se démarquer.",

      heroPrimary:
        "Voir mes travaux ↗",

      heroSecondary:
        "Acheter un PSD →",

      workEyebrow:
        "01 / PORTFOLIO",

      workTitle:
        "Mes <em>travaux.</em>",

      filterAll:
        "Tout",

      filterFlyers:
        "Flyers",

      filterCovers:
        "Covers",

      filterLabels:
        "Étiquettes",

      filterBranding:
        "Branding",

      storeEyebrow:
        "02 / BOUTIQUE DIGITALE",

      storeTitle:
        "Boutique <em>PSD.</em>",

      freeEyebrow:
        "03 / RESSOURCES GRATUITES",

      freeTitle:
        "Assets <em>gratuits.</em>",

      assetPNG:
        "PNG",

      assetTextures:
        "Textures",

      assetMockups:
        "Mockups",

      assetIntro:
        "Choisissez une catégorie pour voir les fichiers et télécharger ce dont vous avez besoin.",

      servicesEyebrow:
        "04 / SERVICES",

      servicesTitle:
        "Services pour <em>entreprises.</em>",

      service1:
        "01 — Logo & Branding",

      service2:
        "02 — Flyer & Réseaux sociaux",

      service3:
        "03 — Packaging & Étiquettes",

      service4:
        "04 — Motion Design",

      portfolioFlyer:
        "Flyer événement",

      portfolioCover:
        "Cover Design",

      portfolioLabel:
        "Étiquette produit",

      portfolioBrand:
        "Identité de marque",

      storeNote:
        "— Structure checkout prête pour la connexion backend.",

      footer:
        "Design graphique · PSD · Assets digitaux",

      whatsapp:
        "WhatsApp"

    },


    es: {

      navWork:
        "Mis trabajos",

      navStore:
        "Tienda PSD",

      navFree:
        "Assets gratis",

      navServices:
        "Servicios",

      heroEyebrow:
        "ESTUDIO DE DISEÑO CREATIVO",

      heroTitle:
        "Diseño que<br><em>te hace memorable.</em>",

      heroText:
        "Diseño gráfico premium, archivos PSD editables y recursos digitales para marcas y negocios que quieren destacar.",

      heroPrimary:
        "Ver mis trabajos ↗",

      heroSecondary:
        "Comprar PSD →",

      workEyebrow:
        "01 / PORTFOLIO",

      workTitle:
        "Mis <em>trabajos.</em>",

      filterAll:
        "Todo",

      filterFlyers:
        "Flyers",

      filterCovers:
        "Covers",

      filterLabels:
        "Etiquetas",

      filterBranding:
        "Branding",

      storeEyebrow:
        "02 / TIENDA DIGITAL",

      storeTitle:
        "Tienda <em>PSD.</em>",

      freeEyebrow:
        "03 / RECURSOS GRATIS",

      freeTitle:
        "Assets <em>gratis.</em>",

      assetPNG:
        "PNG",

      assetTextures:
        "Texturas",

      assetMockups:
        "Mockups",

      assetIntro:
        "Elige una categoría para ver los archivos y descargar lo que necesitas.",

      servicesEyebrow:
        "04 / SERVICIOS",

      servicesTitle:
        "Servicios para <em>negocios.</em>",

      service1:
        "01 — Logo & Branding",

      service2:
        "02 — Flyer & Redes Sociales",

      service3:
        "03 — Packaging & Etiquetas",

      service4:
        "04 — Motion Design",

      portfolioFlyer:
        "Flyer de evento",

      portfolioCover:
        "Diseño de Cover",

      portfolioLabel:
        "Etiqueta de producto",

      portfolioBrand:
        "Identidad de marca",

      storeNote:
        "— Estructura de checkout lista para conexión backend.",

      footer:
        "Diseño gráfico · PSD · Assets digitales",

      whatsapp:
        "WhatsApp"

    }

  };


  /* =======================================================
     LANGUAGE FUNCTION
  ======================================================= */

  function setLanguage(language) {

    const dictionary =
      translations[language] || translations.ht;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {

      const key = element.dataset.i18n;

      if (
        Object.prototype.hasOwnProperty.call(dictionary, key)
      ) {
        element.textContent = dictionary[key];
      }

    });


    document.querySelectorAll("[data-i18n-html]").forEach(element => {

      const key = element.dataset.i18nHtml;

      if (
        Object.prototype.hasOwnProperty.call(dictionary, key)
      ) {
        element.innerHTML = dictionary[key];
      }

    });


    const selectedLanguage =
      document.querySelector(
        `[data-lang="${language}"]`
      );

    if (selectedLanguage && languageButton) {

      languageButton.innerHTML =
        selectedLanguage.innerHTML +
        ' <span aria-hidden="true">▾</span>';

    }

    localStorage.setItem(
      "wiseLanguage",
      language
    );
  }


  const savedLanguage =
    localStorage.getItem("wiseLanguage") || "ht";

  setLanguage(savedLanguage);


  /* =======================================================
     HERO SLIDESHOW
  ======================================================= */

  const slides =
    Array.from(
      document.querySelectorAll(".hero-slideshow .slide")
    );

  const dots =
    Array.from(
      document.querySelectorAll(".slide-dots .dot")
    );

  let currentSlide = 0;
  let slideshowTimer = null;

  function showSlide(index) {

    if (!slides.length) return;

    currentSlide =
      (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle(
        "active",
        i === currentSlide
      );
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle(
        "active",
        i === currentSlide
      );
    });
  }


  function startSlideshow() {

    if (slides.length <= 1) return;

    clearInterval(slideshowTimer);

    slideshowTimer = setInterval(() => {

      showSlide(currentSlide + 1);

    }, 5000);
  }


  dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

      showSlide(index);
      startSlideshow();

    });

  });

  showSlide(0);
  startSlideshow();


  /* =======================================================
     PORTFOLIO FILTER
  ======================================================= */

  const filterButtons =
    document.querySelectorAll(
      ".filters [data-filter]"
    );

  const portfolioCards =
    document.querySelectorAll(
      "#work .portfolio-card"
    );


  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const filter =
        button.dataset.filter;

      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");


      portfolioCards.forEach(card => {

        const category =
          card.dataset.category;

        if (
          filter === "all" ||
          category === filter
        ) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }

      });

    });

  });


  /* =======================================================
     FREE + PAID ASSET SYSTEM
     
     Ou ka ajoute kantite imaj ou vle isit la.
     
     TYPE:
     png
     background
     texture
     mockup
  ======================================================= */


  const freeAssets = [

    /*
    {
      type: "png",
      name: "PNG Asset 01",
      description: "PNG gratis",
      image: "images/assets/free/png01.png",
      download: "assets/free/png01.png"
    },

    {
      type: "background",
      name: "Background 01",
      description: "Background gratis",
      image: "images/assets/free/background01.jpg",
      download: "assets/free/background01.jpg"
    },

    {
      type: "texture",
      name: "Texture 01",
      description: "Texture gratis",
      image: "images/assets/free/texture01.jpg",
      download: "assets/free/texture01.jpg"
    },

    {
      type: "mockup",
      name: "Mockup 01",
      description: "Mockup gratis",
      image: "images/assets/free/mockup01.jpg",
      download: "assets/free/mockup01.jpg"
    }
    */

  ];


  const paidAssets = [

    /*
    {
      type: "png",
      name: "Premium PNG 01",
      description: "PNG premium",
      image: "images/assets/paid/png01.png",
      price: "$5",
      buy: "#"
    },

    {
      type: "background",
      name: "Premium Background 01",
      description: "Background premium",
      image: "images/assets/paid/background01.jpg",
      price: "$5",
      buy: "#"
    },

    {
      type: "texture",
      name: "Premium Texture 01",
      description: "Texture premium",
      image: "images/assets/paid/texture01.jpg",
      price: "$5",
      buy: "#"
    },

    {
      type: "mockup",
      name: "Premium Mockup 01",
      description: "Mockup premium",
      image: "images/assets/paid/mockup01.jpg",
      price: "$7",
      buy: "#"
    }
    */

  ];


  /*
    ---------------------------------------------------------
    Si HTML ou itilize ID sa yo:

    free-assets-grid
    paid-assets-grid

    script la ap ranpli yo otomatikman.

    Si li itilize:

    asset-grid

    li kapab toujou montre FREE assets yo.
    ---------------------------------------------------------
  */


  const freeAssetGrid =
    document.getElementById("free-assets-grid");

  const paidAssetGrid =
    document.getElementById("paid-assets-grid");

  const oldAssetGrid =
    document.getElementById("asset-grid");


  let currentAssetType = "png";


  function assetTypeName(type) {

    const names = {
      png: "PNG",
      background: "BACKGROUND",
      texture: "TEXTURE",
      mockup: "MOCKUP"
    };

    return names[type] || type;
  }


  function createAssetCard(asset, paid = false) {

    const card =
      document.createElement("article");

    card.className = "asset-card";

    card.dataset.assetType =
      asset.type || "png";


    const image =
      document.createElement("img");

    image.src =
      asset.image || "";

    image.alt =
      asset.name || assetTypeName(asset.type);

    image.loading = "lazy";


    const title =
      document.createElement("h3");

    title.textContent =
      asset.name || "Digital Asset";


    const description =
      document.createElement("p");

    description.textContent =
      asset.description ||
      assetTypeName(asset.type);


    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(description);


    if (paid) {

      const price =
        document.createElement("strong");

      price.textContent =
        asset.price || "PAID";

      card.appendChild(price);


      const buy =
        document.createElement("button");

      buy.type = "button";
      buy.className = "buy";
      buy.textContent = "Achte kounye a →";

      if (asset.buy && asset.buy !== "#") {

        buy.addEventListener("click", () => {

          window.location.href =
            asset.buy;

        });

      } else {

        buy.addEventListener("click", () => {

          alert(
            "Sistèm peman an poko konekte."
          );

        });

      }

      card.appendChild(buy);

    } else {

      const download =
        document.createElement("button");

      download.type = "button";
      download.className = "download";

      download.textContent =
        "Telechaje gratis";

      download.addEventListener(
        "click",
        () => {

          if (
            asset.download &&
            asset.download !== "#"
          ) {

            const link =
              document.createElement("a");

            link.href =
              asset.download;

            link.download = "";

            document.body.appendChild(link);

            link.click();

            link.remove();

            showDownloadModal();

          } else {

            alert(
              "Ajoute chemen fichye download la nan script.js."
            );

          }

        }
      );

      card.appendChild(download);

    }


    return card;
  }


  function renderAssets(
    assets,
    grid,
    paid = false,
    type = currentAssetType
  ) {

    if (!grid) return;

    grid.innerHTML = "";

    const filtered =
      assets.filter(asset => {

        return (
          !type ||
          asset.type === type
        );

      });


    filtered.forEach(asset => {

      grid.appendChild(
        createAssetCard(
          asset,
          paid
        )
      );

    });

  }


  function renderAllAssets() {

    renderAssets(
      freeAssets,
      freeAssetGrid,
      false,
      currentAssetType
    );

    renderAssets(
      paidAssets,
      paidAssetGrid,
      true,
      currentAssetType
    );


    /*
      Compatibilite ak ansyen #asset-grid
    */

    if (oldAssetGrid) {

      renderAssets(
        freeAssets,
        oldAssetGrid,
        false,
        currentAssetType
      );

    }

  }


  /* =======================================================
     ASSET CATEGORY BUTTONS
  ======================================================= */

  const assetButtons =
    document.querySelectorAll(
      "[data-asset-type]"
    );


  assetButtons.forEach(button => {

    button.addEventListener("click", () => {

      currentAssetType =
        button.dataset.assetType;

      assetButtons.forEach(btn => {

        btn.classList.remove("active");

        btn.setAttribute(
          "aria-selected",
          "false"
        );

      });


      button.classList.add("active");

      button.setAttribute(
        "aria-selected",
        "true"
      );


      renderAllAssets();

    });

  });


  renderAllAssets();


  /* =======================================================
     DOWNLOAD MODAL
  ======================================================= */

  const downloadModal =
    document.getElementById(
      "download-modal"
    );

  const modalClose =
    document.getElementById(
      "modal-close"
    );


  function showDownloadModal() {

    if (!downloadModal) return;

    downloadModal.hidden = false;

    document.body.classList.add(
      "lightbox-open"
    );

  }


  function hideDownloadModal() {

    if (!downloadModal) return;

    downloadModal.hidden = true;

    document.body.classList.remove(
      "lightbox-open"
    );

  }


  if (modalClose) {

    modalClose.addEventListener(
      "click",
      hideDownloadModal
    );

  }


  if (downloadModal) {

    downloadModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          downloadModal
        ) {
          hideDownloadModal();
        }

      }
    );

  }


  /* =======================================================
     IMAGE LIGHTBOX
  ======================================================= */

  const lightbox =
    document.getElementById(
      "image-lightbox"
    );

  const lightboxImage =
    document.getElementById(
      "lightbox-image"
    );

  const lightboxClose =
    document.getElementById(
      "lightbox-close"
    );

  const lightboxPrev =
    document.getElementById(
      "lightbox-prev"
    );

  const lightboxNext =
    document.getElementById(
      "lightbox-next"
    );

  const zoomIn =
    document.getElementById(
      "zoom-in"
    );

  const zoomOut =
    document.getElementById(
      "zoom-out"
    );

  const zoomReset =
    document.getElementById(
      "zoom-reset"
    );


  let lightboxImages = [];
  let lightboxIndex = 0;
  let zoomLevel = 1;


  function collectLightboxImages() {

    lightboxImages =
      Array.from(
        document.querySelectorAll(
          "img:not(#lightbox-image)"
        )
      ).filter(image => {

        return (
          image.src &&
          !image.closest(".lang-menu")
        );

      });

  }


  function updateZoom() {

    if (!lightboxImage) return;

    lightboxImage.style.transform =
      `scale(${zoomLevel})`;

    if (zoomReset) {

      zoomReset.textContent =
        `${Math.round(zoomLevel * 100)}%`;

    }

  }


  function openLightbox(index) {

    if (
      !lightbox ||
      !lightboxImage ||
      !lightboxImages.length
    ) {
      return;
    }


    lightboxIndex =
      (index + lightboxImages.length) %
      lightboxImages.length;


    const source =
      lightboxImages[lightboxIndex];


    lightboxImage.src =
      source.currentSrc ||
      source.src;

    lightboxImage.alt =
      source.alt || "";


    zoomLevel = 1;

    updateZoom();


    lightbox.hidden = false;

    document.body.classList.add(
      "lightbox-open"
    );

  }


  function closeLightbox() {

    if (!lightbox) return;

    lightbox.hidden = true;

    document.body.classList.remove(
      "lightbox-open"
    );

    if (lightboxImage) {

      lightboxImage.src = "";

    }

  }


  function nextImage() {

    openLightbox(
      lightboxIndex + 1
    );

  }


  function previousImage() {

    openLightbox(
      lightboxIndex - 1
    );

  }


  function zoomPlus() {

    zoomLevel =
      Math.min(
        zoomLevel + .25,
        4
      );

    updateZoom();

  }


  function zoomMinus() {

    zoomLevel =
      Math.max(
        zoomLevel - .25,
        .5
      );

    updateZoom();

  }


  function resetZoom() {

    zoomLevel = 1;

    updateZoom();

  }


  /*
     IMPORTANT:
     Re-collect images after dynamic
     Asset cards are created.
  */

  function prepareImages() {

    collectLightboxImages();

    lightboxImages.forEach(
      (image, index) => {

        if (
          image.dataset.lightboxReady
        ) {
          return;
        }

        image.dataset.lightboxReady =
          "true";

        image.addEventListener(
          "click",
          () => {

            collectLightboxImages();

            const newIndex =
              lightboxImages.indexOf(
                image
              );

            openLightbox(
              newIndex >= 0
                ? newIndex
                : index
            );

          }
        );

      }
    );

  }


  prepareImages();


  if (lightboxClose) {

    lightboxClose.addEventListener(
      "click",
      closeLightbox
    );

  }


  if (lightboxPrev) {

    lightboxPrev.addEventListener(
      "click",
      previousImage
    );

  }


  if (lightboxNext) {

    lightboxNext.addEventListener(
      "click",
      nextImage
    );

  }


  if (zoomIn) {

    zoomIn.addEventListener(
      "click",
      zoomPlus
    );

  }


  if (zoomOut) {

    zoomOut.addEventListener(
      "click",
      zoomMinus
    );

  }


  if (zoomReset) {

    zoomReset.addEventListener(
      "click",
      resetZoom
    );

  }


  if (lightbox) {

    lightbox.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          lightbox
        ) {
          closeLightbox();
        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    event => {

      if (
        !lightbox ||
        lightbox.hidden
      ) {
        return;
      }


      if (event.key === "Escape") {

        closeLightbox();

      }


      if (event.key === "ArrowRight") {

        nextImage();

      }


      if (event.key === "ArrowLeft") {

        previousImage();

      }


      if (event.key === "+") {

        zoomPlus();

      }


      if (event.key === "-") {

        zoomMinus();

      }


      if (event.key === "0") {

        resetZoom();

      }

    }
  );


  /* =======================================================
     ZOOM WITH MOUSE WHEEL
  ======================================================= */

  if (lightboxImage) {

    lightboxImage.addEventListener(
      "wheel",
      event => {

        if (
          !lightbox ||
          lightbox.hidden
        ) {
          return;
        }

        event.preventDefault();

        if (event.deltaY < 0) {

          zoomPlus();

        } else {

          zoomMinus();

        }

      },
      {
        passive: false
      }
    );

  }


  /* =======================================================
     DRAG IMAGE WHEN ZOOMED
  ======================================================= */

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let moveX = 0;
  let moveY = 0;


  if (lightboxImage) {

    lightboxImage.addEventListener(
      "pointerdown",
      event => {

        if (zoomLevel <= 1) {
          return;
        }

        dragging = true;

        startX =
          event.clientX - moveX;

        startY =
          event.clientY - moveY;

        lightboxImage.classList.add(
          "dragging"
        );

        lightboxImage.setPointerCapture(
          event.pointerId
        );

      }
    );


    lightboxImage.addEventListener(
      "pointermove",
      event => {

        if (!dragging) return;

        moveX =
          event.clientX - startX;

        moveY =
          event.clientY - startY;

        lightboxImage.style.transform =
          `translate(${moveX}px, ${moveY}px) scale(${zoomLevel})`;

      }
    );


    function stopDragging() {

      dragging = false;

      lightboxImage.classList.remove(
        "dragging"
      );

    }


    lightboxImage.addEventListener(
      "pointerup",
      stopDragging
    );

    lightboxImage.addEventListener(
      "pointercancel",
      stopDragging
    );

  }


  /* =======================================================
     RESET POSITION WHEN ZOOM CHANGES
  ======================================================= */

  const originalUpdateZoom =
    updateZoom;


  function resetImagePosition() {

    moveX = 0;
    moveY = 0;

  }


  if (zoomReset) {

    zoomReset.addEventListener(
      "click",
      resetImagePosition
    );

  }


  /* =======================================================
     REVEAL ANIMATION
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: .12
        }
      );


    revealElements.forEach(
      element => observer.observe(element)
    );

  } else {

    revealElements.forEach(
      element =>
        element.classList.add("visible")
    );

  }


  /* =======================================================
     OBSERVE DYNAMIC ASSET IMAGES
  ======================================================= */

  const assetObserver =
    new MutationObserver(() => {

      prepareImages();

    });


  if (freeAssetGrid) {

    assetObserver.observe(
      freeAssetGrid,
      {
        childList: true,
        subtree: true
      }
    );

  }


  if (paidAssetGrid) {

    assetObserver.observe(
      paidAssetGrid,
      {
        childList: true,
        subtree: true
      }
    );

  }


  if (oldAssetGrid) {

    assetObserver.observe(
      oldAssetGrid,
      {
        childList: true,
        subtree: true
      }
    );

  }


  /* =======================================================
     CONSOLE CONFIRMATION
  ======================================================= */

  console.log(
    "WISE.GRAPHIXDESIGN — script.js loaded successfully."
  );

});
