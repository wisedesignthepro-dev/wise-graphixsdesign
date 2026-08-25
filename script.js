/* =========================================================
   WISE.GRAPHIXDESIGN — script.js FINAL
   RESPONSIVE: MOBILE + TABLET + DESKTOP

   PORTFOLIO
   PSD FREE + PSD PAID
   FREE + PAID ASSETS
   LANGUAGE
   LIGHTBOX
   SLIDESHOW
   DOWNLOAD MODAL
   CLOUDFLARE WORKER CHECKOUT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     CONFIGURATION
  ======================================================= */

  const API_BASE_URL = "";

  const API = {
    checkout: `${API_BASE_URL}/api/checkout`,
    paymentStatus: `${API_BASE_URL}/api/payment-status`,
    download: `${API_BASE_URL}/api/download`
  };


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const menuButton =
    document.getElementById("mb");

  const mainNav =
    document.getElementById("main-nav");

  if (menuButton && mainNav) {

    menuButton.addEventListener(
      "click",
      () => {

        const isOpen =
          mainNav.classList.toggle("open");

        menuButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );

    mainNav
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            mainNav.classList.remove("open");

            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      });

  }


  /* =======================================================
     LANGUAGE MENU
  ======================================================= */

  const languageButton =
    document.getElementById("lb");

  const languageMenu =
    document.getElementById("lm");

  if (
    languageButton &&
    languageMenu
  ) {

    languageButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        const open =
          languageMenu.classList.toggle("open");

        languageButton.setAttribute(
          "aria-expanded",
          String(open)
        );

      }
    );

    languageMenu
      .querySelectorAll("[data-lang]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const language =
              button.dataset.lang;

            setLanguage(language);

            languageMenu.classList.remove("open");

            languageButton.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      });

    document.addEventListener(
      "click",
      event => {

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

      }
    );

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

      assetBackground:
        "Background",

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
        "WhatsApp",

      downloadFree:
        "Telechaje gratis",

      buyNow:
        "Achte kounye a →",

      paymentNotConnected:
        "Sistèm peman an poko konekte.",

      paymentError:
        "Yon pwoblèm rive pandan koneksyon ak sistèm peman an.",

      checkoutReady:
        "Checkout la pare.",

      addDownload:
        "Ajoute chemen fichye download la nan script.js.",

      paid:
        "PAID"

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

      assetBackground:
        "Backgrounds",

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
        "WhatsApp",

      downloadFree:
        "Download free",

      buyNow:
        "Buy now →",

      paymentNotConnected:
        "Payment system is not connected yet.",

      paymentError:
        "A problem occurred while connecting to the payment system.",

      checkoutReady:
        "Checkout is ready.",

      addDownload:
        "Add the download file path in script.js.",

      paid:
        "PAID"

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

      assetBackground:
        "Arrière-plans",

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
        "WhatsApp",

      downloadFree:
        "Télécharger gratuitement",

      buyNow:
        "Acheter maintenant →",

      paymentNotConnected:
        "Le système de paiement n'est pas encore connecté.",

      paymentError:
        "Un problème est survenu lors de la connexion au système de paiement.",

      checkoutReady:
        "Le checkout est prêt.",

      addDownload:
        "Ajoutez le chemin du fichier dans script.js.",

      paid:
        "PAYANT"

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

      assetBackground:
        "Fondos",

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
        "WhatsApp",

      downloadFree:
        "Descargar gratis",

      buyNow:
        "Comprar ahora →",

      paymentNotConnected:
        "El sistema de pago aún no está conectado.",

      paymentError:
        "Se produjo un problema al conectar con el sistema de pago.",

      checkoutReady:
        "El checkout está listo.",

      addDownload:
        "Añade la ruta del archivo en script.js.",

      paid:
        "PAGO"

    }

  };


  /* =======================================================
     CURRENT LANGUAGE
  ======================================================= */

  let currentLanguage =
    localStorage.getItem(
      "wiseLanguage"
    ) || "ht";


  /* =======================================================
     LANGUAGE FUNCTION
  ======================================================= */

  function setLanguage(language) {

    const dictionary =
      translations[language] ||
      translations.ht;

    currentLanguage =
      translations[language]
        ? language
        : "ht";

    document.documentElement.lang =
      currentLanguage;

    document
      .querySelectorAll("[data-i18n]")
      .forEach(element => {

        const key =
          element.dataset.i18n;

        if (
          Object.prototype.hasOwnProperty.call(
            dictionary,
            key
          )
        ) {

          element.textContent =
            dictionary[key];

        }

      });

    document
      .querySelectorAll("[data-i18n-html]")
      .forEach(element => {

        const key =
          element.dataset.i18nHtml;

        if (
          Object.prototype.hasOwnProperty.call(
            dictionary,
            key
          )
        ) {

          element.innerHTML =
            dictionary[key];

        }

      });

    const selectedLanguage =
      document.querySelector(
        `[data-lang="${currentLanguage}"]`
      );

    if (
      selectedLanguage &&
      languageButton
    ) {

      languageButton.innerHTML =
        selectedLanguage.innerHTML +
        ' <span aria-hidden="true">▾</span>';

    }

    localStorage.setItem(
      "wiseLanguage",
      currentLanguage
    );

    updateAllButtonLanguages();

  }


  /* =======================================================
     HERO SLIDESHOW
  ======================================================= */

  const slides =
    Array.from(
      document.querySelectorAll(
        ".hero-slideshow .slide"
      )
    );

  const dots =
    Array.from(
      document.querySelectorAll(
        ".slide-dots .dot"
      )
    );

  let currentSlide = 0;
  let slideshowTimer = null;

  function showSlide(index) {

    if (!slides.length) {
      return;
    }

    currentSlide =
      (index + slides.length) %
      slides.length;

    slides.forEach(
      (slide, i) => {

        slide.classList.toggle(
          "active",
          i === currentSlide
        );

      }
    );

    dots.forEach(
      (dot, i) => {

        dot.classList.toggle(
          "active",
          i === currentSlide
        );

      }
    );

  }

  function startSlideshow() {

    if (
      slides.length <= 1
    ) {

      return;

    }

    clearInterval(
      slideshowTimer
    );

    slideshowTimer =
      setInterval(
        () => {

          showSlide(
            currentSlide + 1
          );

        },
        5000
      );

  }

  dots.forEach(
    (dot, index) => {

      dot.addEventListener(
        "click",
        () => {

          showSlide(index);
          startSlideshow();

        }
      );

    }
  );

  showSlide(0);
  startSlideshow();


  /* =======================================================
     PORTFOLIO FILTER
  ======================================================= */

  const portfolioFilters =
    document.querySelectorAll(
      ".filters [data-filter]"
    );

  const portfolioCards =
    document.querySelectorAll(
      ".portfolio-grid .portfolio-card"
    );

  portfolioFilters.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const selectedFilter =
            button.dataset.filter;

          portfolioFilters.forEach(
            btn => {

              btn.classList.remove(
                "active"
              );

            }
          );

          button.classList.add(
            "active"
          );

          portfolioCards.forEach(
            card => {

              const category =
                card.dataset.category;

              if (
                selectedFilter === "all" ||
                category === selectedFilter
              ) {

                card.classList.remove(
                  "portfolio-hidden"
                );

              } else {

                card.classList.add(
                  "portfolio-hidden"
                );

              }

            }
          );

        }
      );

    }
  );


  /* =======================================================
     FREE PSD
  ======================================================= */

  const freePSD = [

    {
      id:
        "psd-free-01",

      name:
        "PSD Gratis 01",

      description:
        "PSD gratis pou modifye.",

      image:
        "images/psd/free/psd01.jpg",

      download:
        "psd-free/psd01.psd"
    },

    {
      id:
        "psd-free-02",

      name:
        "PSD Gratis 02",

      description:
        "PSD gratis pou modifye.",

      image:
        "images/psd/free/psd02.jpg",

      download:
        "psd-free/psd02.psd"
    }

  ];


  /* =======================================================
     PAID PSD
  ======================================================= */

  const paidPSD = [

    {
      id:
        "psd-paid-01",

      name:
        "Premium PSD 01",

      description:
        "PSD premium editab.",

      image:
        "images/psd/paid/psd01.jpg",

      price:
        5
    },

    {
      id:
        "psd-paid-02",

      name:
        "Premium PSD 02",

      description:
        "PSD premium editab.",

      image:
        "images/psd/paid/psd02.jpg",

      price:
        7
    }

  ];


  /* =======================================================
     FREE ASSETS
  ======================================================= */

  const freeAssets = [

    {
       id:
    "free-png-star-2",
 type:
    "png",
 name:
    "STAR 2",
description:
    "PNG gratis",
image:
    "images/asset-gratis/png/STAR%202.png",
       download:
    "images/asset-gratis/png/STAR%202.png"
},
     

    {
      id:
        "free-background-01",

      type:
        "background",

      name:
        "Background 01",

      description:
        "Background gratis",

      image:
        "images/assets/free/background/background01.jpg",

      download:
        "assets/free/background/background01.jpg"
    },

    {
      id:
        "free-texture-01",

      type:
        "texture",

      name:
        "Texture 01",

      description:
        "Texture gratis",

      image:
        "images/assets/free/texture/texture01.jpg",

      download:
        "assets/free/texture/texture01.jpg"
    },

    {
      id:
        "free-mockup-01",

      type:
        "mockup",

      name:
        "Mockup 01",

      description:
        "Mockup gratis",

      image:
        "images/assets/free/mockup/mockup01.jpg",

      download:
        "assets/free/mockup/mockup01.jpg"
    }

  ];


  /* =======================================================
     PAID ASSETS
  ======================================================= */

  const paidAssets = [

    {
      id:
        "paid-png-01",

      type:
        "png",

      name:
        "Premium PNG 01",

      description:
        "PNG premium",

      image:
        "images/assets/paid/png/png01.png",

      price:
        5
    },

    {
      id:
        "paid-background-01",

      type:
        "background",

      name:
        "Premium Background 01",

      description:
        "Background premium",

      image:
        "images/assets/paid/background/background01.jpg",

      price:
        5
    },

    {
      id:
        "paid-texture-01",

      type:
        "texture",

      name:
        "Premium Texture 01",

      description:
        "Texture premium",

      image:
        "images/assets/paid/texture/texture01.jpg",

      price:
        5
    },

    {
      id:
        "paid-mockup-01",

      type:
        "mockup",

      name:
        "Premium Mockup 01",

      description:
        "Mockup premium",

      image:
        "images/assets/paid/mockup/mockup01.jpg",

      price:
        5
    }

  ];


  /* =======================================================
     GRIDS
  ======================================================= */

  const freePSDGrid =
    document.getElementById(
      "free-psd-grid"
    );

  const paidPSDGrid =
    document.getElementById(
      "paid-psd-grid"
    );

  const freeAssetGrid =
    document.getElementById(
      "free-assets-grid"
    );

  const paidAssetGrid =
    document.getElementById(
      "paid-assets-grid"
    );

  const oldAssetGrid =
    document.getElementById(
      "asset-grid"
    );


  /* =======================================================
     CURRENT ASSET TYPES
  ======================================================= */

  let currentFreeAssetType =
    "png";

  let currentPaidAssetType =
    "png";


  /* =======================================================
     ASSET TYPE NAME
  ======================================================= */

  function assetTypeName(type) {

    const dictionary =
      translations[currentLanguage] ||
      translations.ht;

    const names = {

      png:
        dictionary.assetPNG ||
        "PNG",

      background:
        dictionary.assetBackground ||
        "BACKGROUND",

      texture:
        dictionary.assetTextures ||
        "TEXTURES",

      mockup:
        dictionary.assetMockups ||
        "MOCKUP"

    };

    return (
      names[type] ||
      type
    );

  }


  /* =======================================================
     WORKER ERROR MESSAGE
  ======================================================= */

  async function getWorkerResponse(
    response
  ) {

    const text =
      await response.text();

    try {

      return JSON.parse(
        text
      );

    } catch {

      return {
        success:
          false,

        error:
          text ||
          "Invalid server response."
      };

    }

  }


  /* =======================================================
     PAID CHECKOUT — FINAL
  ======================================================= */

  async function startCheckout(item, type) {

    const dictionary =
      translations[currentLanguage] ||
      translations.ht;

    if (!item) {

      alert(
        dictionary.paymentError
      );

      return null;

    }

    const productId =
      item.id ||
      `${type}-${item.name}`
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        );

    const paymentMethod =
      "moncash";

    const buttons =
      document.querySelectorAll(
        '[data-asset-button="buy"]'
      );

    buttons.forEach(
      button => {

        button.disabled =
          true;

        button.setAttribute(
          "aria-busy",
          "true"
        );

      }
    );

    try {

      const response =
        await fetch(
          API.checkout,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({

                productId:
                  productId,

                productName:
                  item.name,

                price:
                  Number(item.price),

                paymentMethod:
                  paymentMethod

              })
          }
        );

      const data =
        await getWorkerResponse(
          response
        );

      console.log(
        "WISE CHECKOUT RESPONSE:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          data.error ||
          dictionary.paymentError
        );

      }

      const redirectUrl =
        data.redirectUrl ||
        data.payment?.redirectUrl ||
        data.payment?.redirect_url;

      if (redirectUrl) {

        window.location.href =
          redirectUrl;

        return data;

      }

      if (
        data.payment &&
        data.payment.status ===
          "credentials_configured"
      ) {

        alert(
          `${dictionary.checkoutReady}\n\n` +
          `Order: ${data.orderId || "N/A"}`
        );

        return data;

      }

      throw new Error(
        data.message ||
        dictionary.paymentNotConnected
      );

    } catch (error) {

      console.error(
        "WISE CHECKOUT ERROR:",
        error
      );

      alert(
        error?.message ||
        dictionary.paymentError
      );

      return null;

    } finally {

      buttons.forEach(
        button => {

          button.disabled =
            false;

          button.removeAttribute(
            "aria-busy"
          );

        }
      );

    }

  }


  /* =======================================================
     CREATE PSD CARD
  ======================================================= */

  function createPSDCard(
    item,
    paid = false
  ) {

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "asset-card psd-card";

    const image =
      document.createElement(
        "img"
      );

    image.src =
      item.image || "";

    image.alt =
      item.name ||
      "PSD";

    image.loading =
      "lazy";

    image.className =
      "asset-image";

    const title =
      document.createElement(
        "h3"
      );

    title.textContent =
      item.name ||
      "PSD";

    const description =
      document.createElement(
        "p"
      );

    description.textContent =
      item.description ||
      "PSD";

    card.appendChild(
      image
    );

    card.appendChild(
      title
    );

    card.appendChild(
      description
    );


    /* =====================================================
       PAID PSD
    ===================================================== */

    if (paid) {

      const price =
        document.createElement(
          "strong"
        );

      price.className =
        "asset-price";

      price.textContent =
        item.price ||
        translations[
          currentLanguage
        ].paid;

      card.appendChild(
        price
      );

      const buy =
        document.createElement(
          "button"
        );

      buy.type =
        "button";

      buy.className =
        "buy";

      buy.dataset.assetButton =
        "buy";

      buy.textContent =
        translations[
          currentLanguage
        ].buyNow;

      buy.addEventListener(
        "click",
        () => {

          startCheckout(
            item,
            "psd"
          );

        }
      );

      card.appendChild(
        buy
      );

    } else {

      /* ===================================================
         FREE PSD
      =================================================== */

      const download =
        document.createElement(
          "button"
        );

      download.type =
        "button";

      download.className =
        "download";

      download.dataset.assetButton =
        "download";

      download.textContent =
        translations[
          currentLanguage
        ].downloadFree;

      download.addEventListener(
        "click",
        () => {

          if (
            item.download &&
            item.download !== "#"
          ) {

            const link =
              document.createElement(
                "a"
              );

            link.href =
              item.download;

            link.download =
              "";

            link.rel =
              "noopener";

            document.body.appendChild(
              link
            );

            link.click();

            link.remove();

            showDownloadModal();

          } else {

            alert(
              translations[
                currentLanguage
              ].addDownload
            );

          }

        }
      );

      card.appendChild(
        download
      );

    }

    return card;

  }


  /* =======================================================
     CREATE ASSET CARD
  ======================================================= */

  function createAssetCard(
    asset,
    paid = false
  ) {

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "asset-card";

    card.dataset.assetType =
      asset.type ||
      "png";

    const image =
      document.createElement(
        "img"
      );

    image.src =
      asset.image || "";

    image.alt =
      asset.name ||
      assetTypeName(
        asset.type
      );

    image.loading =
      "lazy";

    image.className =
      "asset-image";

    const title =
      document.createElement(
        "h3"
      );

    title.textContent =
      asset.name ||
      "Digital Asset";

    const description =
      document.createElement(
        "p"
      );

    description.textContent =
      asset.description ||
      assetTypeName(
        asset.type
      );

    card.appendChild(
      image
    );

    card.appendChild(
      title
    );

    card.appendChild(
      description
    );


    /* =====================================================
       PAID ASSET
    ===================================================== */

    if (paid) {

      const price =
        document.createElement(
          "strong"
        );

      price.className =
        "asset-price";

      price.textContent =
        asset.price ||
        translations[
          currentLanguage
        ].paid;

      card.appendChild(
        price
      );

      const buy =
        document.createElement(
          "button"
        );

      buy.type =
        "button";

      buy.className =
        "buy";

      buy.dataset.assetButton =
        "buy";

      buy.textContent =
        translations[
          currentLanguage
        ].buyNow;

      buy.addEventListener(
        "click",
        () => {

          startCheckout(
            asset,
            "asset"
          );

        }
      );

      card.appendChild(
        buy
      );

    } else {

      /* ===================================================
         FREE ASSET
      =================================================== */

      const download =
        document.createElement(
          "button"
        );

      download.type =
        "button";

      download.className =
        "download";

      download.dataset.assetButton =
        "download";

      download.textContent =
        translations[
          currentLanguage
        ].downloadFree;

      download.addEventListener(
        "click",
        () => {

          if (
            asset.download &&
            asset.download !== "#"
          ) {

            const link =
              document.createElement(
                "a"
              );

            link.href =
              asset.download;

            link.download =
              "";

            link.rel =
              "noopener";

            document.body.appendChild(
              link
            );

            link.click();

            link.remove();

            showDownloadModal();

          } else {

            alert(
              translations[
                currentLanguage
              ].addDownload
            );

          }

        }
      );

      card.appendChild(
        download
      );

    }

    return card;

  }


  /* =======================================================
     UPDATE ALL BUTTON LANGUAGES
  ======================================================= */

  function updateAllButtonLanguages() {

    const dictionary =
      translations[
        currentLanguage
      ] ||
      translations.ht;

    document
      .querySelectorAll(
        '[data-asset-button="download"]'
      )
      .forEach(
        button => {

          button.textContent =
            dictionary.downloadFree;

        }
      );

    document
      .querySelectorAll(
        '[data-asset-button="buy"]'
      )
      .forEach(
        button => {

          button.textContent =
            dictionary.buyNow;

        }
      );

  }


  /* =======================================================
     RENDER PSD
  ======================================================= */

  function renderPSD(
    items,
    grid,
    paid = false
  ) {

    if (!grid) {
      return;
    }

    grid.innerHTML =
      "";

    items.forEach(
      item => {

        grid.appendChild(
          createPSDCard(
            item,
            paid
          )
        );

      }
    );

  }


  /* =======================================================
     RENDER ASSETS
  ======================================================= */

  function renderAssets(
    assets,
    grid,
    paid = false,
    type = null
  ) {

    if (!grid) {
      return;
    }

    grid.innerHTML =
      "";

    const filtered =
      assets.filter(
        asset => {

          return (
            !type ||
            asset.type === type
          );

        }
      );

    filtered.forEach(
      asset => {

        grid.appendChild(
          createAssetCard(
            asset,
            paid
          )
        );

      }
    );

  }


  /* =======================================================
     RENDER ALL
  ======================================================= */

  function renderAllAssets() {

    renderPSD(
      freePSD,
      freePSDGrid,
      false
    );

    renderPSD(
      paidPSD,
      paidPSDGrid,
      true
    );

    renderAssets(
      freeAssets,
      freeAssetGrid,
      false,
      currentFreeAssetType
    );

    renderAssets(
      paidAssets,
      paidAssetGrid,
      true,
      currentPaidAssetType
    );

    if (oldAssetGrid) {

      renderAssets(
        freeAssets,
        oldAssetGrid,
        false,
        currentFreeAssetType
      );

    }

    prepareImages();

  }


  /* =======================================================
     FREE CATEGORY BUTTONS
  ======================================================= */

  const freeAssetButtons =
    document.querySelectorAll(
      ".free-asset-types [data-asset-type]"
    );

  freeAssetButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          const selectedType =
            button.dataset.assetType;

          if (!selectedType) {
            return;
          }

          currentFreeAssetType =
            selectedType;

          freeAssetButtons.forEach(
            btn => {

              btn.classList.remove(
                "active"
              );

              btn.setAttribute(
                "aria-selected",
                "false"
              );

            }
          );

          button.classList.add(
            "active"
          );

          button.setAttribute(
            "aria-selected",
            "true"
          );

          renderAssets(
            freeAssets,
            freeAssetGrid,
            false,
            currentFreeAssetType
          );

          prepareImages();

        }
      );

    }
  );


  /* =======================================================
     PAID CATEGORY BUTTONS
  ======================================================= */

  const paidAssetButtons =
    document.querySelectorAll(
      ".paid-asset-types [data-paid-asset-type]"
    );

  paidAssetButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          const selectedType =
            button.dataset.paidAssetType;

          if (!selectedType) {
            return;
          }

          currentPaidAssetType =
            selectedType;

          paidAssetButtons.forEach(
            btn => {

              btn.classList.remove(
                "active"
              );

              btn.setAttribute(
                "aria-selected",
                "false"
              );

            }
          );

          button.classList.add(
            "active"
          );

          button.setAttribute(
            "aria-selected",
            "true"
          );

          renderAssets(
            paidAssets,
            paidAssetGrid,
            true,
            currentPaidAssetType
          );

          prepareImages();

        }
      );

    }
  );


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

    if (!downloadModal) {
      return;
    }

    downloadModal.hidden =
      false;

    document.body.classList.add(
      "lightbox-open"
    );

  }

  function hideDownloadModal() {

    if (!downloadModal) {
      return;
    }

    downloadModal.hidden =
      true;

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

  let moveX = 0;

  let moveY = 0;


  /* =======================================================
     COLLECT LIGHTBOX IMAGES
  ======================================================= */

  function collectLightboxImages(
    sourceImage = null
  ) {

    if (
      sourceImage &&
      sourceImage.closest(
        ".portfolio-card"
      )
    ) {

      const portfolioCard =
        sourceImage.closest(
          ".portfolio-card"
        );

      const category =
        portfolioCard.dataset.category;

      lightboxImages =
        Array.from(
          document.querySelectorAll(
            `.portfolio-grid .portfolio-card[data-category="${category}"] img`
          )
        ).filter(
          image => {

            return (
              image.src &&
              image.id !==
                "lightbox-image"
            );

          }
        );

      return;

    }


    if (
      sourceImage &&
      sourceImage.closest(
        "#free-assets-grid"
      )
    ) {

      const assetCard =
        sourceImage.closest(
          ".asset-card"
        );

      const assetType =
        assetCard?.dataset.assetType;

      if (assetType) {

        lightboxImages =
          Array.from(
            document.querySelectorAll(
              `#free-assets-grid .asset-card[data-asset-type="${assetType}"] img`
            )
          ).filter(
            image => {

              return (
                image.src &&
                image.id !==
                  "lightbox-image"
              );

            }
          );

        return;

      }

    }


    if (
      sourceImage &&
      sourceImage.closest(
        "#paid-assets-grid"
      )
    ) {

      const assetCard =
        sourceImage.closest(
          ".asset-card"
        );

      const assetType =
        assetCard?.dataset.assetType;

      if (assetType) {

        lightboxImages =
          Array.from(
            document.querySelectorAll(
              `#paid-assets-grid .asset-card[data-asset-type="${assetType}"] img`
            )
          ).filter(
            image => {

              return (
                image.src &&
                image.id !==
                  "lightbox-image"
              );

            }
          );

        return;

      }

    }


    if (
      sourceImage &&
      sourceImage.closest(
        "#free-psd-grid"
      )
    ) {

      lightboxImages =
        Array.from(
          document.querySelectorAll(
            "#free-psd-grid .psd-card img"
          )
        ).filter(
          image => {

            return (
              image.src &&
              image.id !==
                "lightbox-image"
            );

          }
        );

      return;

    }


    if (
      sourceImage &&
      sourceImage.closest(
        "#paid-psd-grid"
      )
    ) {

      lightboxImages =
        Array.from(
          document.querySelectorAll(
            "#paid-psd-grid .psd-card img"
          )
        ).filter(
          image => {

            return (
              image.src &&
              image.id !==
                "lightbox-image"
            );

          }
        );

      return;

    }


    lightboxImages =
      Array.from(
        document.querySelectorAll(
          ".portfolio-grid img, #free-assets-grid img, #paid-assets-grid img, #free-psd-grid img, #paid-psd-grid img"
        )
      ).filter(
        image => {

          return (
            image.src &&
            image.id !==
              "lightbox-image"
          );

        }
      );

  }


  /* =======================================================
     UPDATE ZOOM
  ======================================================= */

  function updateZoom() {

    if (!lightboxImage) {
      return;
    }

    lightboxImage.style.transform =
      `translate3d(${moveX}px, ${moveY}px, 0) scale(${zoomLevel})`;

    if (zoomReset) {

      zoomReset.textContent =
        `${Math.round(
          zoomLevel * 100
        )}%`;

    }

  }


  /* =======================================================
     OPEN LIGHTBOX
  ======================================================= */

  function openLightbox(
    index
  ) {

    if (
      !lightbox ||
      !lightboxImage ||
      !lightboxImages.length
    ) {

      return;

    }

    lightboxIndex =
      (
        index +
        lightboxImages.length
      ) %
      lightboxImages.length;

    const source =
      lightboxImages[
        lightboxIndex
      ];

    lightboxImage.src =
      source.currentSrc ||
      source.src;

    lightboxImage.alt =
      source.alt ||
      "";

    zoomLevel = 1;

    moveX = 0;

    moveY = 0;

    updateZoom();

    lightbox.hidden =
      false;

    document.body.classList.add(
      "lightbox-open"
    );

  }


  /* =======================================================
     CLOSE LIGHTBOX
  ======================================================= */

  function closeLightbox() {

    if (!lightbox) {
      return;
    }

    lightbox.hidden =
      true;

    document.body.classList.remove(
      "lightbox-open"
    );

    if (lightboxImage) {

      lightboxImage.src =
        "";

      lightboxImage.style.transform =
        "";

    }

  }


  /* =======================================================
     NEXT / PREVIOUS
  ======================================================= */

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


  /* =======================================================
     ZOOM
  ======================================================= */

  function zoomPlus() {

    zoomLevel =
      Math.min(
        zoomLevel + 0.25,
        4
      );

    updateZoom();

  }

  function zoomMinus() {

    zoomLevel =
      Math.max(
        zoomLevel - 0.25,
        0.5
      );

    updateZoom();

  }

  function resetZoom() {

    zoomLevel = 1;

    moveX = 0;

    moveY = 0;

    updateZoom();

  }


  /* =======================================================
     PREPARE IMAGES
  ======================================================= */

  function prepareImages() {

    const images =
      document.querySelectorAll(
        ".portfolio-grid img, #free-assets-grid img, #paid-assets-grid img, #free-psd-grid img, #paid-psd-grid img"
      );

    images.forEach(
      image => {

        if (
          image.dataset.lightboxReady ===
          "true"
        ) {

          return;

        }

        image.dataset.lightboxReady =
          "true";

        image.style.cursor =
          "zoom-in";

        image.addEventListener(
          "click",
          event => {

            if (
              event.target.closest(
                "button, a"
              )
            ) {

              return;

            }

            collectLightboxImages(
              image
            );

            const newIndex =
              lightboxImages.indexOf(
                image
              );

            openLightbox(
              newIndex >= 0
                ? newIndex
                : 0
            );

          }
        );

      }
    );

  }


  /* =======================================================
     LIGHTBOX BUTTONS
  ======================================================= */

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


  /* =======================================================
     KEYBOARD CONTROLS
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        !lightbox ||
        lightbox.hidden
      ) {

        return;

      }

      if (
        event.key ===
        "Escape"
      ) {

        closeLightbox();

        return;

      }

      if (
        event.key ===
        "ArrowRight"
      ) {

        nextImage();

      }

      if (
        event.key ===
        "ArrowLeft"
      ) {

        previousImage();

      }

      if (
        event.key === "+" ||
        event.key === "="
      ) {

        zoomPlus();

      }

      if (
        event.key === "-"
      ) {

        zoomMinus();

      }

      if (
        event.key === "0"
      ) {

        resetZoom();

      }

    }
  );


  /* =======================================================
     MOUSE WHEEL ZOOM
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

        if (
          event.deltaY < 0
        ) {

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
     TOUCH / POINTER DRAG
  ======================================================= */

  let dragging = false;

  let startX = 0;

  let startY = 0;

  if (lightboxImage) {

    lightboxImage.addEventListener(
      "pointerdown",
      event => {

        if (
          zoomLevel <= 1
        ) {

          return;

        }

        dragging = true;

        startX =
          event.clientX -
          moveX;

        startY =
          event.clientY -
          moveY;

        lightboxImage.classList.add(
          "dragging"
        );

        if (
          lightboxImage.setPointerCapture
        ) {

          lightboxImage.setPointerCapture(
            event.pointerId
          );

        }

        event.preventDefault();

      }
    );

    lightboxImage.addEventListener(
      "pointermove",
      event => {

        if (!dragging) {
          return;
        }

        moveX =
          event.clientX -
          startX;

        moveY =
          event.clientY -
          startY;

        lightboxImage.style.transform =
          `translate3d(${moveX}px, ${moveY}px, 0) scale(${zoomLevel})`;

        event.preventDefault();

      }
    );

    function stopDragging(
      event
    ) {

      if (!dragging) {
        return;
      }

      dragging = false;

      lightboxImage.classList.remove(
        "dragging"
      );

      if (
        event &&
        lightboxImage.hasPointerCapture &&
        lightboxImage.hasPointerCapture(
          event.pointerId
        )
      ) {

        lightboxImage.releasePointerCapture(
          event.pointerId
        );

      }

    }

    lightboxImage.addEventListener(
      "pointerup",
      stopDragging
    );

    lightboxImage.addEventListener(
      "pointercancel",
      stopDragging
    );

    lightboxImage.addEventListener(
      "lostpointercapture",
      stopDragging
    );

  }


  /* =======================================================
     REVEAL ANIMATION
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );

  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

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

            }
          );

        },
        {
          threshold:
            0.12
        }
      );

    revealElements.forEach(
      element =>
        observer.observe(
          element
        )
    );

  } else {

    revealElements.forEach(
      element =>
        element.classList.add(
          "visible"
        )
    );

  }


  /* =======================================================
     OBSERVE DYNAMIC IMAGES
  ======================================================= */

  const assetObserver =
    new MutationObserver(
      () => {

        prepareImages();

      }
    );

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

  if (freePSDGrid) {

    assetObserver.observe(
      freePSDGrid,
      {
        childList: true,
        subtree: true
      }
    );

  }

  if (paidPSDGrid) {

    assetObserver.observe(
      paidPSDGrid,
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
     INITIALISATION
  ======================================================= */

  renderAllAssets();

  prepareImages();

  setLanguage(
    currentLanguage
  );


  /* =======================================================
     CONSOLE CONFIRMATION
  ======================================================= */

  console.log(
    "WISE.GRAPHIXDESIGN — script.js loaded successfully."
  );

});
