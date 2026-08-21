/* =========================================================
   WISE.GRAPHIXDESIGN — FINAL SCRIPT
   Worker checkout integration
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}


/* =========================================================
   1. PORTFOLIO
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
      data-lightbox-group="portfolio"
    >
      <img
        src="${escapeHTML(item.image)}"
        alt="${escapeHTML(item.title)}"
        loading="lazy"
      >

      <p>${escapeHTML(item.title)}</p>
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

    $$(".filters button").forEach(b =>
      b.classList.remove("active")
    );

    button.classList.add("active");

    renderPortfolio(
      button.dataset.filter
    );

  });

});


/* =========================================================
   2. PSD GRATIS
========================================================= */

const freePSD = [
  // {
  //   id: "psd-free-01",
  //   image: "images/psd-free-01.jpg",
  //   title: "PSD Flyer 01",
  //   description: "PSD gratis",
  //   download: "downloads/psd-free-01.zip"
  // }
];


/* =========================================================
   3. PSD PAID
========================================================= */

const paidPSD = [
  // {
  //   id: "psd-paid-01",
  //   image: "images/psd-paid-01.jpg",
  //   title: "Premium Flyer",
  //   description: "PSD premium",
  //   price: "$10"
  // }
];


/* =========================================================
   4. ASSET GRATIS
========================================================= */

const freeAssets = {

  png: [
    // {
    //   id: "png-free-01",
    //   image: "images/assets/png-01.png",
    //   title: "PNG Element 01",
    //   description: "PNG gratis",
    //   download: "downloads/png-01.zip"
    // }
  ],

  background: [
    // {
    //   id: "background-free-01",
    //   image: "images/assets/bg-01.jpg",
    //   title: "Background 01",
    //   description: "Background gratis",
    //   download: "downloads/bg-01.zip"
    // }
  ],

  texture: [
    // {
    //   id: "texture-free-01",
    //   image: "images/assets/texture-01.jpg",
    //   title: "Texture 01",
    //   description: "Texture gratis",
    //   download: "downloads/texture-01.zip"
    // }
  ],

  mockup: [
    // {
    //   id: "mockup-free-01",
    //   image: "images/assets/mockup-01.jpg",
    //   title: "Mockup 01",
    //   description: "Mockup gratis",
    //   download: "downloads/mockup-01.zip"
    // }
  ]

};


/* =========================================================
   5. ASSET PAID
========================================================= */

const paidAssets = {

  png: [
    // {
    //   id: "png-paid-01",
    //   image: "images/assets-paid/png-01.png",
    //   title: "Premium PNG 01",
    //   description: "PNG premium",
    //   price: "$5"
    // }
  ],

  background: [
    // {
    //   id: "background-paid-01",
    //   image: "images/assets-paid/bg-01.jpg",
    //   title: "Premium Background 01",
    //   description: "Background premium",
    //   price: "$5"
    // }
  ],

  texture: [
    // {
    //   id: "texture-paid-01",
    //   image: "images/assets-paid/texture-01.jpg",
    //   title: "Premium Texture 01",
    //   description: "Texture premium",
    //   price: "$5"
    // }
  ],

  mockup: [
    // {
    //   id: "mockup-paid-01",
    //   image: "images/assets-paid/mockup-01.jpg",
    //   title: "Premium Mockup 01",
    //   description: "Mockup premium",
    //   price: "$8"
    // }
  ]

};


/* =========================================================
   WORKER CHECKOUT
========================================================= */

async function startCheckout(item) {

  if (!item) {
    alert("Pwodwi a pa disponib.");
    return;
  }

  const productId =
    item.id ||
    item.productId ||
    item.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  if (!productId) {
    alert("Pwodwi a pa gen yon ID.");
    return;
  }

  const productName =
    item.title || "Digital Product";

  const price =
    item.price || null;

  try {

    const response = await fetch(
      "/api/checkout",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          productId,

          productName,

          price,

          paymentMethod: "moncash"

        })
      }
    );


    let data;

    try {

      data = await response.json();

    } catch {

      throw new Error(
        "Worker la pa voye yon repons JSON."
      );

    }


    if (!response.ok || !data.success) {

      throw new Error(
        data.message ||
        data.error ||
        "Checkout la pa disponib."
      );

    }


    console.log(
      "WISE.GRAPHIXDESIGN CHECKOUT:",
      data
    );


    /*
     * Worker ou a kounye a retounen
     * checkout_ready.
     *
     * CreatePayment MonCash poko
     * aktive nan Worker la.
     */

    if (
      data.payment &&
      data.payment.status ===
        "credentials_configured"
    ) {

      alert(
        "MonCash la byen configured. Checkout la pare."
      );

    } else {

      alert(
        data.message ||
        "Checkout la pare."
      );

    }


    return data;


  } catch (error) {

    console.error(
      "Checkout Error:",
      error
    );

    alert(
      error?.message ||
      "Gen yon pwoblèm pandan checkout la."
    );

    return null;
  }

}


/* =========================================================
   6. STORE CARDS
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
        Ajoute pwodwi yo nan
        <b>script.js</b>.
      </div>
    `;

    return;
  }


  grid.innerHTML =
    items.map((item, index) => {

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
                  escapeHTML(item.price)
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

    }).join("");


  /* IMAGE LIGHTBOX */

  $$(".store-card>img", grid)
    .forEach((img, index) => {

      img.addEventListener(
        "click",
        () => openLightbox(
          items,
          index
        )
      );

    });


  /* FREE DOWNLOAD */

  $$(".download", grid)
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const item =
            items[
              Number(
                btn.dataset.download
              )
            ];

          if (item?.download) {

            startDownload(
              item.download
            );

          }

        }
      );

    });


  /* PAID CHECKOUT */

  $$(".buy", grid)
    .forEach(btn => {

      btn.addEventListener(
        "click",
        async () => {

          const item =
            items[
              Number(
                btn.dataset.buy
              )
            ];

          if (!item) {

            alert(
              "Pwodwi a pa disponib."
            );

            return;
          }


          const originalText =
            btn.textContent;


          btn.disabled = true;

          btn.textContent =
            "Ap prepare...";


          try {

            await startCheckout(
              item
            );

          } finally {

            btn.disabled = false;

            btn.textContent =
              originalText;

          }

        }
      );

    });

}


/* RENDER PSD */

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
   PSD GRATIS / PAID SWITCH
========================================================= */

$$(".store-tab").forEach(tab => {

  tab.addEventListener(
    "click",
    () => {

      $$(".store-tab")
        .forEach(t => {

          t.classList.remove(
            "active"
          );

          t.setAttribute(
            "aria-selected",
            "false"
          );

        });


      tab.classList.add(
        "active"
      );

      tab.setAttribute(
        "aria-selected",
        "true"
      );


      const free =
        tab.dataset.storeMode ===
        "free";


      $("#free-psd-area").hidden =
        !free;

      $("#paid-psd-area").hidden =
        free;

    }
  );

});


/* =========================================================
   7. ASSETS
========================================================= */

let currentFreeAssetType =
  "png";

let currentPaidAssetType =
  "png";


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


  grid.innerHTML =
    data.map((item, index) => {

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
                  escapeHTML(item.price)
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

    }).join("");


  /* LIGHTBOX */

  $$(".asset-card img", grid)
    .forEach((img, index) => {

      img.addEventListener(
        "click",
        () => openLightbox(
          data,
          index
        )
      );

    });


  /* FREE DOWNLOAD */

  $$(".download", grid)
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const item =
            data[
              Number(
                btn.dataset.download
              )
            ];

          if (item?.download) {

            startDownload(
              item.download
            );

          }

        }
      );

    });


  /* PAID CHECKOUT */

  $$(".buy", grid)
    .forEach(btn => {

      btn.addEventListener(
        "click",
        async () => {

          const item =
            data[
              Number(
                btn.dataset.buy
              )
            ];


          if (!item) {

            alert(
              "Asset la pa disponib."
            );

            return;
          }


          const originalText =
            btn.textContent;


          btn.disabled = true;

          btn.textContent =
            "Ap prepare...";


          try {

            await startCheckout(
              item
            );

          } finally {

            btn.disabled = false;

            btn.textContent =
              originalText;

          }

        }
      );

    });

}


/* INITIAL ASSETS */

renderAssets(
  "png",
  false
);

renderAssets(
  "png",
  true
);


/* =========================================================
   ASSET MAIN TABS
========================================================= */

$$(".asset-main-tab")
  .forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        $$(".asset-main-tab")
          .forEach(t => {

            t.classList.remove(
              "active"
            );

            t.setAttribute(
              "aria-selected",
              "false"
            );

          });


        tab.classList.add(
          "active"
        );

        tab.setAttribute(
          "aria-selected",
          "true"
        );


        const free =
          tab.dataset.assetMode ===
          "free";


        $("#free-assets-area")
          .hidden = !free;

        $("#paid-assets-area")
          .hidden = free;

      }
    );

  });


/* =========================================================
   ASSET TYPE TABS
========================================================= */

$$(".asset-type")
  .forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        $$(".asset-type")
          .forEach(t =>
            t.classList.remove(
              "active"
            )
          );


        tab.classList.add(
          "active"
        );


        currentFreeAssetType =
          tab.dataset.assetType;


        renderAssets(
          currentFreeAssetType,
          false
        );

      }
    );

  });


$$(".paid-asset-type")
  .forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        $$(".paid-asset-type")
          .forEach(t =>
            t.classList.remove(
              "active"
            )
          );


        tab.classList.add(
          "active"
        );


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
   8. DOWNLOAD MODAL
========================================================= */

const modal =
  $("#download-modal");

const modalClose =
  $("#modal-close");


function startDownload(url) {

  const a =
    document.createElement("a");

  a.href = url;

  a.download = "";

  document.body.appendChild(a);

  a.click();

  a.remove();


  if (modal) {

    modal.hidden = false;

  }

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
    e => {

      if (e.target === modal) {

        modal.hidden = true;

      }

    }
  );

}


/* =========================================================
   9. HERO SLIDESHOW
========================================================= */

const slides =
  $$(".hero-slideshow .slide");

const dots =
  $$(".slide-dots .dot");

let slideIndex = 0;

let slideTimer;


function showSlide(index) {

  if (!slides.length) return;


  slideIndex =
    (index + slides.length) %
    slides.length;


  slides.forEach(
    (slide, i) => {

      slide.classList.toggle(
        "active",
        i === slideIndex
      );

    }
  );


  dots.forEach(
    (dot, i) => {

      dot.classList.toggle(
        "active",
        i === slideIndex
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
      () =>
        showSlide(
          slideIndex + 1
        ),
      5000
    );

}


dots.forEach(
  (dot, i) => {

    dot.addEventListener(
      "click",
      () => {

        showSlide(i);

        startSlideshow();

      }
    );

  }
);


startSlideshow();


/* =========================================================
   10. MOBILE MENU
========================================================= */

const menuButton =
  $("#mb");

const nav =
  $("#main-nav");


menuButton?.addEventListener(
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


/* =========================================================
   11. LANGUAGE MENU
========================================================= */

const langButton =
  $("#lb");

const langMenu =
  $("#lm");


langButton?.addEventListener(
  "click",
  e => {

    e.stopPropagation();


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


document.addEventListener(
  "click",
  () => {

    langMenu?.classList.remove(
      "open"
    );

    langButton?.setAttribute(
      "aria-expanded",
      "false"
    );

  }
);


/* =========================================================
   12. TRANSLATIONS
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

  }

};


/* =========================================================
   LIGHTBOX
========================================================= */

let lightbox =
  $("#lightbox");

let lightboxImage =
  $("#lightbox-image");

let lightboxClose =
  $("#lightbox-close");


function openLightbox(
  items,
  index
) {

  if (!lightbox || !lightboxImage) {
    return;
  }


  const item =
    items[index];


  if (!item) return;


  lightboxImage.src =
    item.image;


  lightboxImage.alt =
    item.title || "";


  lightbox.hidden =
    false;

}


if (lightboxClose) {

  lightboxClose.addEventListener(
    "click",
    () => {

      lightbox.hidden =
        true;

    }
  );

}


if (lightbox) {

  lightbox.addEventListener(
    "click",
    e => {

      if (e.target === lightbox) {

        lightbox.hidden =
          true;

      }

    }
  );

}


/* =========================================================
   END
========================================================= */
