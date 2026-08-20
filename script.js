/* =========================================================
   WISE.GRAPHIXDESIGN — FINAL SCRIPT
   AJOUTE OTAN DE ITEMS OU VLE NAN LIST SA YO.
========================================================= */


/* =========================================================
   1. PORTFOLIO
   Ou ka ajoute kantite imaj ou vle.
========================================================= */

const portfolioItems = [

  {
    image: "images/STREET SHUTDOWN.png",
    title: "BACK TO SCHOOL",
    category: "flyer"
  },

  {
    image: "images/flyer00.png",
    title: "Flyer Event",
    category: "flyer"
  },

  {
    image: "images/cover00.png",
    title: "Cover Design",
    category: "cover"
  },

  {
    image: "images/CHANPYON MASTER02.jpg",
    title: "Cover Design",
    category: "cover"
  },

  {
    image: "images/label.png",
    title: "Product Label",
    category: "label"
  },

  {
    image: "images/branding.png",
    title: "Brand Identity",
    category: "brand"
  },

  {
    image: "images/FRITZ HERBY SHOT IT.png",
    title: "FLYER DESIGN",
    category: "flyer"
  }

];


/* =========================================================
   2. PSD GRATIS
========================================================= */

const freePSD = [

  /*
  {
    image: "images/psd-free-01.jpg",
    title: "PSD Flyer 01",
    description: "PSD gratis",
    download: "downloads/psd-free-01.zip"
  }
  */

];


/* =========================================================
   3. PSD PAID
========================================================= */

const paidPSD = [

  /*
  {
    image: "images/psd-paid-01.jpg",
    title: "Premium Flyer",
    description: "PSD premium",
    price: "$10",
    buyUrl: "#"
  }
  */

];


/* =========================================================
   4. ASSET GRATIS
   PNG / BACKGROUND / TEXTURES / MOCKUPS
========================================================= */

const freeAssets = {

  png: [

    /*
    {
      image: "images/assets/png-01.png",
      title: "PNG Element 01",
      description: "PNG gratis",
      download: "downloads/png-01.zip"
    }
    */

  ],

  background: [

    /*
    {
      image: "images/assets/bg-01.jpg",
      title: "Background 01",
      description: "Background gratis",
      download: "downloads/bg-01.zip"
    }
    */

  ],

  texture: [

    /*
    {
      image: "images/assets/texture-01.jpg",
      title: "Texture 01",
      description: "Texture gratis",
      download: "downloads/texture-01.zip"
    }
    */

  ],

  mockup: [

    /*
    {
      image: "images/assets/mockup-01.jpg",
      title: "Mockup 01",
      description: "Mockup gratis",
      download: "downloads/mockup-01.zip"
    }
    */

  ]

};


/* =========================================================
   5. ASSET PAID
   MENM KATEGORI YO
========================================================= */

const paidAssets = {

  png: [

    /*
    {
      image: "images/assets-paid/png-01.png",
      title: "Premium PNG 01",
      description: "PNG premium",
      price: "$5",
      buyUrl: "#"
    }
    */

  ],

  background: [

    /*
    {
      image: "images/assets-paid/bg-01.jpg",
      title: "Premium Background 01",
      description: "Background premium",
      price: "$5",
      buyUrl: "#"
    }
    */

  ],

  texture: [

    /*
    {
      image: "images/assets-paid/texture-01.jpg",
      title: "Premium Texture 01",
      description: "Texture premium",
      price: "$5",
      buyUrl: "#"
    }
    */

  ],

  mockup: [

    /*
    {
      image: "images/assets-paid/mockup-01.jpg",
      title: "Premium Mockup 01",
      description: "Mockup premium",
      price: "$8",
      buyUrl: "#"
    }
    */

  ]

};


/* =========================================================
   UTILITIES
========================================================= */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


function escapeHTML(value = "") {

  return String(value).replace(/[&<>"']/g, character => ({

    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"

  }[character]));

}


/* =========================================================
   PORTFOLIO
========================================================= */

const portfolioGrid = $("#portfolio-grid");


function renderPortfolio(filter = "all") {

  if (!portfolioGrid) return;

  const items =
    filter === "all"
      ? portfolioItems
      : portfolioItems.filter(
          item => item.category === filter
        );


  portfolioGrid.innerHTML = items.map((item, index) => `

    <article
      class="portfolio-card reveal visible"
      data-lightbox-index="${index}"
    >

      <img
        src="${escapeHTML(item.image)}"
        alt="${escapeHTML(item.title)}"
        loading="lazy"
      >

      <p>
        ${escapeHTML(item.title)}
      </p>

    </article>

  `).join("");


  $$(".portfolio-card", portfolioGrid).forEach(card => {

    card.addEventListener("click", () => {

      const visibleItems =
        filter === "all"
          ? portfolioItems
          : portfolioItems.filter(
              item => item.category === filter
            );

      openLightbox(
        visibleItems,
        Number(card.dataset.lightboxIndex)
      );

    });

  });

}


renderPortfolio();


/* =========================================================
   PORTFOLIO FILTERS
========================================================= */

$$(".filters button").forEach(button => {

  button.addEventListener("click", () => {

    $$(".filters button").forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    renderPortfolio(
      button.dataset.filter
    );

  });

});


/* =========================================================
   STORE — PSD GRATIS / PSD PAID
========================================================= */

function renderStoreGrid(
  target,
  items,
  paid = false
) {

  const grid = $(target);

  if (!grid) return;


  if (!items.length) {

    grid.innerHTML = `

      <div class="empty-state">

        Pa gen pwodwi nan kategori sa a ankò.

      </div>

    `;

    return;

  }


  grid.innerHTML = items.map(
    (item, index) => {

      const action = paid

        ? `

          <button
            class="buy"
            type="button"
            data-buy="${index}"
          >

            Achte
            ${item.price
              ? "— " + escapeHTML(item.price)
              : "→"}

          </button>

        `

        : `

          <button
            class="download"
            type="button"
            data-download="${index}"
          >

            Telechaje gratis

          </button>

        `;


      return `

        <article
          class="store-card"
          data-store-index="${index}"
        >

          <img
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(item.title)}"
            loading="lazy"
          >

          <h3>
            ${escapeHTML(item.title)}
          </h3>

          <p>
            ${escapeHTML(
              item.description || ""
            )}
          </p>

          ${
            paid
              ? `
                <strong>
                  ${escapeHTML(
                    item.price || ""
                  )}
                </strong>
              `
              : ""
          }

          ${action}

        </article>

      `;

    }
  ).join("");


  /* Lightbox */

  $$(".store-card > img", grid)
    .forEach((img, index) => {

      img.addEventListener(
        "click",
        () => openLightbox(items, index)
      );

    });


  /* Download */

  $$(".download", grid)
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const item =
            items[
              Number(
                button.dataset.download
              )
            ];

          if (item.download) {

            startDownload(
              item.download
            );

          }

        }
      );

    });


  /* Buy */

  $$(".buy", grid)
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const item =
            items[
              Number(
                button.dataset.buy
              )
            ];


          if (
            item.buyUrl &&
            item.buyUrl !== "#"
          ) {

            window.open(
              item.buyUrl,
              "_blank",
              "noopener"
            );

          } else {

            alert(
              "Mete lyen checkout MonCash ou nan buyUrl pou pwodwi sa a."
            );

          }

        }
      );

    });

}


renderStoreGrid(
  "#free-psd-grid",
  freePSD,
  false
);


renderStoreGrid(
  "#paid-psd-grid",
  paidPSD,
  true
);


/* =========================================================
   PSD FREE / PAID TABS
========================================================= */

$$(".store-tab").forEach(tab => {

  tab.addEventListener(
    "click",
    () => {

      $$(".store-tab").forEach(t => {

        t.classList.remove("active");

        t.setAttribute(
          "aria-selected",
          "false"
        );

      });


      tab.classList.add("active");

      tab.setAttribute(
        "aria-selected",
        "true"
      );


      const free =
        tab.dataset.storeMode === "free";


      const freeArea =
        $("#free-psd-area");

      const paidArea =
        $("#paid-psd-area");


      if (freeArea)
        freeArea.hidden = !free;


      if (paidArea)
        paidArea.hidden = free;

    }
  );

});


/* =========================================================
   ASSET GRATIS / PAID
========================================================= */

let currentFreeAssetType = "png";

let currentPaidAssetType = "png";


function renderAssets(
  type,
  paid = false
) {

  const data =
    paid
      ? paidAssets[type]
      : freeAssets[type];


  const target =
    paid
      ? "#paid-asset-grid"
      : "#asset-grid";


  const grid = $(target);

  if (!grid) return;


  if (!data || !data.length) {

    grid.innerHTML = `

      <div class="empty-state">

        Pa gen asset nan kategori sa a ankò.

      </div>

    `;

    return;

  }


  grid.innerHTML = data.map(
    (item, index) => {

      const action = paid

        ? `

          <button
            class="buy"
            type="button"
            data-buy="${index}"
          >

            Achte
            ${
              item.price
                ? "— " +
                  escapeHTML(
                    item.price
                  )
                : "→"
            }

          </button>

        `

        : `

          <button
            class="download"
            type="button"
            data-download="${index}"
          >

            Telechaje gratis

          </button>

        `;


      return `

        <article class="asset-card">

          <img
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(item.title)}"
            loading="lazy"
          >

          <h3>
            ${escapeHTML(item.title)}
          </h3>

          <p>
            ${escapeHTML(
              item.description || ""
            )}
          </p>

          ${
            paid
              ? `
                <strong>
                  ${escapeHTML(
                    item.price || ""
                  )}
                </strong>
              `
              : ""
          }

          ${action}

        </article>

      `;

    }
  ).join("");


  /* Lightbox */

  $$(".asset-card img", grid)
    .forEach((img, index) => {

      img.addEventListener(
        "click",
        () => openLightbox(data, index)
      );

    });


  /* Download */

  $$(".download", grid)
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const item =
            data[
              Number(
                button.dataset.download
              )
            ];


          if (item.download) {

            startDownload(
              item.download
            );

          }

        }
      );

    });


  /* Buy */

  $$(".buy", grid)
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const item =
            data[
              Number(
                button.dataset.buy
              )
            ];


          if (
            item.buyUrl &&
            item.buyUrl !== "#"
          ) {

            window.open(
              item.buyUrl,
              "_blank",
              "noopener"
            );

          } else {

            alert(
              "Mete lyen checkout MonCash ou nan buyUrl pou asset sa a."
            );

          }

        }
      );

    });

}


renderAssets(
  "png",
  false
);


renderAssets(
  "png",
  true
);


/* =========================================================
   ASSET FREE / PAID TABS
========================================================= */

$$(".asset-main-tab").forEach(tab => {

  tab.addEventListener(
    "click",
    () => {

      $$(".asset-main-tab").forEach(t => {

        t.classList.remove("active");

        t.setAttribute(
          "aria-selected",
          "false"
        );

      });


      tab.classList.add("active");

      tab.setAttribute(
        "aria-selected",
        "true"
      );


      const free =
        tab.dataset.assetMode === "free";


      const freeArea =
        $("#free-assets-area");

      const paidArea =
        $("#paid-assets-area");


      if (freeArea)
        freeArea.hidden = !free;


      if (paidArea)
        paidArea.hidden = free;

    }
  );

});


/* =========================================================
   ASSET GRATIS CATEGORIES
========================================================= */

$$(".asset-type").forEach(tab => {

  tab.addEventListener(
    "click",
    () => {

      $$(".asset-type").forEach(t =>
        t.classList.remove("active")
      );


      tab.classList.add("active");


      currentFreeAssetType =
        tab.dataset.assetType;


      renderAssets(
        currentFreeAssetType,
        false
      );

    }
  );

});


/* =========================================================
   ASSET PAID CATEGORIES
========================================================= */

$$(".paid-asset-type").forEach(tab => {

  tab.addEventListener(
    "click",
    () => {

      $$(".paid-asset-type").forEach(t =>
        t.classList.remove("active")
      );


      tab.classList.add("active");


      currentPaidAssetType =
        tab.dataset.paidAssetType;


      renderAssets(
        currentPaidAssetType,
        true
      );

    }
  );

});


/* =========================================================
   DOWNLOAD MODAL
========================================================= */

const modal =
  $("#download-modal");

const modalClose =
  $("#modal-close");


function startDownload(url) {

  const link =
    document.createElement("a");


  link.href = url;

  link.download = "";


  document.body.appendChild(link);

  link.click();

  link.remove();


  if (modal)
    modal.hidden = false;

}


if (modalClose) {

  modalClose.addEventListener(
    "click",
    () => {
      modal.hidden = true;
    }
  );

}


if (modal) {

  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        modal.hidden = true;

      }

    }
  );

}


/* =========================================================
   HERO SLIDESHOW
========================================================= */

const slides =
  $$(".hero-slideshow .slide");

const dots =
  $$(".slide-dots .dot");


let slideIndex = 0;

let slideTimer;


function showSlide(index) {

  if (!slides.length)
    return;


  slideIndex =
    (index + slides.length)
    % slides.length;


  slides.forEach(
    (slide, index) => {

      slide.classList.toggle(
        "active",
        index === slideIndex
      );

    }
  );


  dots.forEach(
    (dot, index) => {

      dot.classList.toggle(
        "active",
        index === slideIndex
      );

    }
  );

}


function startSlideshow() {

  clearInterval(
    slideTimer
  );


  slideTimer =
    setInterval(
      () => {

        showSlide(
          slideIndex + 1
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


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
  $("#mb");

const nav =
  $("#main-nav");


if (menuButton) {

  menuButton.addEventListener(
    "click",
    () => {

      const open =
        nav.classList.toggle(
          "open"
        );


      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );

    }
  );

}


/* =========================================================
   LANGUAGE MENU
========================================================= */

const langButton =
  $("#lb");

const langMenu =
  $("#lm");


if (langButton) {

  langButton.addEventListener(
    "click",
    event => {

      event.stopPropagation();


      const open =
        langMenu.classList.toggle(
          "open"
        );


      langButton.setAttribute(
        "aria-expanded",
        String(open)
      );

    }
  );

}


document.addEventListener(
  "click",
  () => {

    if (langMenu)
      langMenu.classList.remove(
        "open"
      );


    if (langButton)
      langButton.setAttribute(
        "aria-expanded",
        "false"
      );

  }
);


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICK LINK
========================================================= */

$$(
  "#main-nav > a"
).forEach(link => {

  link.addEventListener(
    "click",
    () => {

      if (nav)
        nav.classList.remove(
          "open"
        );


      if (menuButton)
        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

    }
  );

});


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

  ht: {

    navWork:
      "Travay mwen yo",

    navStore:
      "Boutik PSD",

    navFree:
      "Asset gratis",

    navServices:
      "Sèvis",

    heroEyebrow:
      "STIDYO DESIGN KREYATIF",

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

    storeEyebrow:
      "02 / DIGITAL STORE",

    storeTitle:
      "Boutik <em>PSD.</em>",

    freeEyebrow:
      "03 / FREE RESOURCES",

    freeTitle:
      "Asset <em>gratis.</em>",

    servicesEyebrow:
      "04 / SERVICES",

    servicesTitle:
      "Sèvis pou <em>biznis.</em>"

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
      "Premium graphic design, editable PSDs and digital resources for brands and businesses that want to stand out.",

    heroPrimary:
      "View my work ↗",

    heroSecondary:
      "Buy PSD →",

    workEyebrow:
      "01 / PORTFOLIO",

    workTitle:
      "My <em>work.</em>",

    storeEyebrow:
      "02 / DIGITAL STORE",

    storeTitle:
      "PSD <em>Store.</em>",

    freeEyebrow:
      "03 / FREE RESOURCES",

    freeTitle:
      "Free <em>assets.</em>",

    servicesEyebrow:
      "04 / SERVICES",

    servicesTitle:
      "Services for <em>business.</em>"

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
      "Design graphique premium, PSD modifiables et ressources numériques pour les marques et entreprises.",

    heroPrimary:
      "Voir mes travaux ↗",

    heroSecondary:
      "Acheter un PSD →",

    workEyebrow:
      "01 / PORTFOLIO",

    workTitle:
      "Mes <em>travaux.</em>",

    storeEyebrow:
      "02 / BOUTIQUE DIGITALE",

    storeTitle:
      "Boutique <em>PSD.</em>",

    freeEyebrow:
      "03 / RESSOURCES GRATUITES",

    freeTitle:
      "Assets <em>gratuits.</em>",

    servicesEyebrow:
      "04 / SERVICES",

    servicesTitle:
      "Services pour <em>entreprises.</em>"

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
      "Diseño gráfico premium, PSD editables y recursos digitales para marcas y negocios.",

    heroPrimary:
      "Ver mis trabajos ↗",

    heroSecondary:
      "Comprar PSD →",

    workEyebrow:
      "01 / PORTAFOLIO",

    workTitle:
      "Mis <em>trabajos.</em>",

    storeEyebrow:
      "02 / TIENDA DIGITAL",

    storeTitle:
      "Tienda <em>PSD.</em>",

    freeEyebrow:
      "03 / RECURSOS GRATIS",

    freeTitle:
      "Assets <em>gratis.</em>",

    servicesEyebrow:
      "04 / SERVICIOS",

    servicesTitle:
      "Servicios para <em>negocios.</em>"

  }

};


const langNames = {

  ht:
    "Kreyòl",

  en:
    "English",

  fr:
    "Français",

  es:
    "Español"

};


function setLanguage(lang) {

  const dict =
    translations[lang]
    || translations.ht;


  $$("[data-i18n]")
    .forEach(element => {

      const key =
        element.dataset.i18n;


      if (dict[key]) {

        element.textContent =
          dict[key];

      }

    });


  $$("[data-i18n-html]")
    .forEach(element => {

      const key =
        element.dataset.i18nHtml;


      if (dict[key]) {

        element.innerHTML =
          dict[key];

      }

    });


  const currentLang =
    $("#current-lang");


  if (currentLang) {

    currentLang.textContent =
      langNames[lang]
      || "Kreyòl";

  }


  document.documentElement.lang =
    lang;


  localStorage.setItem(
    "wiseLanguage",
    lang
  );

}


$$(".lang-menu button")
  .forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        setLanguage(
          button.dataset.lang
        );


        if (langMenu)
          langMenu.classList.remove(
            "open"
          );


        if (langButton)
          langButton.setAttribute(
            "aria-expanded",
            "false"
          );

      }
    );

  });


setLanguage(
  localStorage.getItem(
    "wiseLanguage"
  ) || "ht"
);


/* =========================================================
   REVEAL ANIMATION
========================================================= */

if ("IntersectionObserver" in window) {

  const revealObserver =
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

            }

          }
        );

      },
      {
        threshold: 0.08
      }
    );


  $$(".reveal")
    .forEach(element =>
      revealObserver.observe(
        element
      )
    );

}


/* =========================================================
   LIGHTBOX
   GRAN PLAN
   PREV / NEXT
   ZOOM
========================================================= */

const lightbox =
  $("#image-lightbox");

const lightboxImage =
  $("#lightbox-image");

const lightboxClose =
  $("#lightbox-close");

const lightboxPrev =
  $("#lightbox-prev");

const lightboxNext =
  $("#lightbox-next");

const zoomIn =
  $("#zoom-in");

const zoomOut =
  $("#zoom-out");

const zoomReset =
  $("#zoom-reset");


let lightboxItems = [];

let lightboxIndex = 0;

let zoom = 1;


/* =========================================================
   OPEN
========================================================= */

function openLightbox(
  items,
  index = 0
) {

  if (
    !items ||
    !items.length ||
    !lightbox
  )
    return;


  lightboxItems =
    items;


  lightboxIndex =
    index;


  zoom = 1;


  updateLightbox();


  lightbox.hidden =
    false;


  document.body.classList.add(
    "lightbox-open"
  );

}


/* =========================================================
   UPDATE
========================================================= */

function updateLightbox() {

  if (
    !lightboxItems.length ||
    !lightboxImage
  )
    return;


  const item =
    lightboxItems[
      lightboxIndex
    ];


  lightboxImage.src =
    item.image;


  lightboxImage.alt =
    item.title || "";


  applyZoom();

}


/* =========================================================
   CLOSE
========================================================= */

function closeLightbox() {

  if (!lightbox)
    return;


  lightbox.hidden =
    true;


  document.body.classList.remove(
    "lightbox-open"
  );


  if (lightboxImage)
    lightboxImage.src = "";

}


/* =========================================================
   ZOOM
========================================================= */

function applyZoom() {

  if (!lightboxImage)
    return;


  lightboxImage.style.transform =
    `scale(${zoom})`;


  if (zoomReset) {

    zoomReset.textContent =
      Math.round(
        zoom * 100
      ) + "%";

  }

}


/* =========================================================
   NEXT / PREVIOUS
========================================================= */

function changeLightbox(
  step
) {

  if (
    !lightboxItems.length
  )
    return;


  lightboxIndex =
    (
      lightboxIndex +
      step +
      lightboxItems.length
    ) %
    lightboxItems.length;


  zoom = 1;


  updateLightbox();

}


/* =========================================================
   BUTTONS
========================================================= */

if (lightboxClose) {

  lightboxClose.addEventListener(
    "click",
    closeLightbox
  );

}


if (lightboxPrev) {

  lightboxPrev.addEventListener(
    "click",
    () =>
      changeLightbox(-1)
  );

}


if (lightboxNext) {

  lightboxNext.addEventListener(
    "click",
    () =>
      changeLightbox(1)
  );

}


if (zoomIn) {

  zoomIn.addEventListener(
    "click",
    () => {

      zoom =
        Math.min(
          3,
          zoom + 0.25
        );


      applyZoom();

    }
  );

}


if (zoomOut) {

  zoomOut.addEventListener(
    "click",
    () => {

      zoom =
        Math.max(
          0.5,
          zoom - 0.25
        );


      applyZoom();

    }
  );

}


if (zoomReset) {

  zoomReset.addEventListener(
    "click",
    () => {

      zoom = 1;

      applyZoom();

    }
  );

}


/* =========================================================
   CLICK BACKGROUND TO CLOSE
========================================================= */

if (lightbox) {

  lightbox.addEventListener(
    "click",
    event => {

      if (
        event.target === lightbox
      ) {

        closeLightbox();

      }

    }
  );

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      !lightbox ||
      lightbox.hidden
    )
      return;


    if (
      event.key === "Escape"
    ) {

      closeLightbox();

    }


    if (
      event.key === "ArrowLeft"
    ) {

      changeLightbox(-1);

    }


    if (
      event.key === "ArrowRight"
    ) {

      changeLightbox(1);

    }


    if (
      event.key === "+"
    ) {

      zoom =
        Math.min(
          3,
          zoom + 0.25
        );

      applyZoom();

    }


    if (
      event.key === "-"
    ) {

      zoom =
        Math.max(
          0.5,
          zoom - 0.25
        );

      applyZoom();

    }

  }
);


/* =========================================================
   SWIPE TELEFÒN
========================================================= */

let touchStartX = 0;


if (lightbox) {

  lightbox.addEventListener(
    "touchstart",
    event => {

      touchStartX =
        event.changedTouches[0]
          .screenX;

    },
    {
      passive: true
    }
  );


  lightbox.addEventListener(
    "touchend",
    event => {

      const touchEndX =
        event.changedTouches[0]
          .screenX;


      const difference =
        touchEndX -
        touchStartX;


      if (
        Math.abs(difference) > 50
      ) {

        changeLightbox(
          difference > 0
            ? -1
            : 1
        );

      }

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   FIN WISE.GRAPHIXDESIGN
========================================================= */
