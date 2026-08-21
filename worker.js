/**
 * =========================================================
 * WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER
 * =========================================================
 *
 * FRONTEND:
 *   index.html
 *   styles.css
 *   brand.css
 *   script.js
 *   images/*
 *
 * API:
 *   GET  /api/health
 *   POST /api/checkout
 *   GET  /api/payment-status
 *   GET  /api/download
 *
 * PAYMENT:
 *   MonCash  -> prepare
 *   NatCash  -> prepare
 *
 * STORAGE:
 *   Cloudflare R2 -> prepare
 *
 * IMPORTANT:
 *   Worker la mache menm si MonCash/NatCash/R2
 *   poko konekte.
 *
 * =========================================================
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * -------------------------------------------------------
     * SECURITY HEADERS
     * -------------------------------------------------------
     */

    const securityHeaders = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "camera=(), microphone=(), geolocation=()"
    };

    /*
     * -------------------------------------------------------
     * CORS
     * -------------------------------------------------------
     */

    const corsHeaders = {
      "Access-Control-Allow-Origin": url.origin,
      "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type",
      "Access-Control-Max-Age": "86400"
    };

    /*
     * -------------------------------------------------------
     * OPTIONS / CORS PREFLIGHT
     * -------------------------------------------------------
     */

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...securityHeaders,
          ...corsHeaders
        }
      });
    }

    /*
     * -------------------------------------------------------
     * API
     * -------------------------------------------------------
     */

    if (url.pathname.startsWith("/api/")) {
      return handleAPI(
        request,
        env,
        url,
        {
          ...securityHeaders,
          ...corsHeaders
        }
      );
    }

    /*
     * -------------------------------------------------------
     * STATIC WEBSITE
     * -------------------------------------------------------
     *
     * Tout sa ki pa /api/* ale nan ASSETS.
     *
     * /
     * /index.html
     * /styles.css
     * /brand.css
     * /script.js
     * /robots.txt
     * /sitemap.xml
     * /images/*
     */

    if (!env.ASSETS) {
      return new Response(
        "ASSETS binding is not configured.",
        {
          status: 500,
          headers: securityHeaders
        }
      );
    }

    const response = await env.ASSETS.fetch(request);

    /*
     * Add security headers.
     */

    const newHeaders = new Headers(response.headers);

    for (const [key, value] of Object.entries(
      securityHeaders
    )) {
      newHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};


/**
 * =========================================================
 * API HANDLER
 * =========================================================
 */

async function handleAPI(
  request,
  env,
  url,
  headers
) {

  /*
   * =======================================================
   * GET /api/health
   * =======================================================
   *
   * Verify Worker la ap fonksyone.
   */

  if (
    url.pathname === "/api/health" &&
    request.method === "GET"
  ) {
    return jsonResponse(
      {
        success: true,

        service:
          "Wise.graphixdesign Worker",

        status: "online",

        website:
          "Wise.graphixdesign",

        payment: {
          moncash: "not_configured",
          natcash: "not_configured"
        },

        storage: {
          r2: env.PAID_ASSETS
            ? "configured"
            : "not_configured"
        },

        timestamp:
          new Date().toISOString()
      },
      200,
      headers
    );
  }


  /*
   * =======================================================
   * POST /api/checkout
   * =======================================================
   *
   * Route sa a resevwa enfòmasyon pwodwi a.
   *
   * IMPORTANT:
   * Nou PA fè payment reyèl toujou.
   *
   * Lè MonCash/NatCash credentials yo disponib,
   * se isit la integration lan ap fèt.
   */

  if (
    url.pathname === "/api/checkout" &&
    request.method === "POST"
  ) {

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        {
          success: false,
          error: "Invalid JSON request."
        },
        400,
        headers
      );
    }

    const productId =
      body?.productId;

    const productName =
      body?.productName || null;

    const requestedPrice =
      body?.price || null;

    const paymentMethod =
      body?.paymentMethod || null;


    /*
     * Product ID obligatwa.
     */

    if (!productId) {
      return jsonResponse(
        {
          success: false,
          error:
            "productId is required."
        },
        400,
        headers
      );
    }


    /*
     * Payment method si kliyan chwazi youn.
     */

    const allowedPaymentMethods = [
      "moncash",
      "natcash"
    ];

    if (
      paymentMethod &&
      !allowedPaymentMethods.includes(
        String(paymentMethod).toLowerCase()
      )
    ) {
      return jsonResponse(
        {
          success: false,
          error:
            "Payment method not supported.",
          allowedMethods:
            allowedPaymentMethods
        },
        400,
        headers
      );
    }


    /*
     * -----------------------------------------------------
     * TEMPORARY CHECKOUT
     * -----------------------------------------------------
     *
     * Sa pèmèt frontend ou a kominike ak Worker la
     * menm anvan payment gateway yo konekte.
     */

    const orderId =
      createOrderId();


    /*
     * -----------------------------------------------------
     * PAYMENT STATUS
     * -----------------------------------------------------
     */

    let paymentStatus =
      "not_configured";

    if (
      paymentMethod === "moncash"
    ) {
      paymentStatus =
        env.MONCASH_CLIENT_ID &&
        env.MONCASH_CLIENT_SECRET
          ? "credentials_configured"
          : "not_configured";
    }

    if (
      paymentMethod === "natcash"
    ) {
      paymentStatus =
        env.NATCASH_API_KEY
          ? "credentials_configured"
          : "not_configured";
    }


    return jsonResponse(
      {
        success: true,

        status:
          "checkout_ready",

        orderId,

        product: {
          id: productId,
          name: productName,
          requestedPrice
        },

        payment: {
          method:
            paymentMethod || "not_selected",

          status:
            paymentStatus
        },

        message:
          "Checkout la pare. Payment gateway la poko aktive."
      },
      200,
      headers
    );
  }


  /*
   * =======================================================
   * GET /api/payment-status
   * =======================================================
   *
   * Pita:
   * Worker la ap verifye transaction MonCash/NatCash.
   */

  if (
    url.pathname === "/api/payment-status" &&
    request.method === "GET"
  ) {

    const transactionId =
      url.searchParams.get(
        "transactionId"
      );

    if (!transactionId) {
      return jsonResponse(
        {
          success: false,
          error:
            "transactionId is required."
        },
        400,
        headers
      );
    }


    /*
     * Payment poko konekte.
     */

    return jsonResponse(
      {
        success: true,

        transactionId,

        status:
          "not_configured",

        paid: false,

        message:
          "Payment verification poko konekte."
      },
      200,
      headers
    );
  }


  /*
   * =======================================================
   * GET /api/download
   * =======================================================
   *
   * Route sa a ap pwoteje paid files yo.
   *
   * PA mete PSD premium yo nan:
   *
   *   images/
   *
   * si ou vle yo rete prive.
   *
   * Lè R2 aktive:
   *
   *   PAID_ASSETS
   *
   * ap sèvi pou storage premium yo.
   */

  if (
    url.pathname === "/api/download" &&
    request.method === "GET"
  ) {

    const productId =
      url.searchParams.get(
        "productId"
      );

    const transactionId =
      url.searchParams.get(
        "transactionId"
      );


    if (!productId) {
      return jsonResponse(
        {
          success: false,
          error:
            "productId is required."
        },
        400,
        headers
      );
    }


    /*
     * -----------------------------------------------------
     * R2 PA KONFIGIRE
     * -----------------------------------------------------
     */

    if (!env.PAID_ASSETS) {
      return jsonResponse(
        {
          success: false,

          status:
            "not_configured",

          productId,

          message:
            "Secure download poko aktive. R2 poko konekte."
        },
        503,
        headers
      );
    }


    /*
     * -----------------------------------------------------
     * PAYMENT VERIFICATION
     * -----------------------------------------------------
     *
     * Pa bay PSD la jis paske moun nan rele
     * /api/download.
     *
     * Pita nou pral verifye transactionId
     * ak MonCash/NatCash anvan download.
     */

    if (!transactionId) {
      return jsonResponse(
        {
          success: false,

          error:
            "transactionId is required.",

          message:
            "Payment verification nesesè anvan download."
        },
        403,
        headers
      );
    }


    /*
     * -----------------------------------------------------
     * PAYMENT PA KONFIME TOUJOU
     * -----------------------------------------------------
     *
     * Pou kounye a, nou pap bay fichye a.
     */

    return jsonResponse(
      {
        success: false,

        status:
          "payment_not_verified",

        productId,

        transactionId,

        message:
          "Payment la poko verifye. Download la bloke."
      },
      403,
      headers
    );
  }


  /*
   * =======================================================
   * API ROUTE NOT FOUND
   * =======================================================
   */

  return jsonResponse(
    {
      success: false,
      error:
        "API route not found."
    },
    404,
    headers
  );
}


/**
 * =========================================================
 * CREATE ORDER ID
 * =========================================================
 */

function createOrderId() {

  const random =
    crypto.randomUUID()
      .replaceAll("-", "")
      .slice(0, 12)
      .toUpperCase();

  return `WGD-${Date.now()}-${random}`;
}


/**
 * =========================================================
 * JSON RESPONSE
 * =========================================================
 */

function jsonResponse(
  data,
  status = 200,
  extraHeaders = {}
) {

  const responseHeaders =
    new Headers({
      "Content-Type":
        "application/json; charset=UTF-8",

      "Cache-Control":
        "no-store",

      ...extraHeaders
    });


  return new Response(
    JSON.stringify(
      data,
      null,
      2
    ),
    {
      status,
      headers:
        responseHeaders
    }
  );
}
