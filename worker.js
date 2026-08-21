/**
 * =========================================================
 * WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER
 * =========================================================
 *
 * Website:
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
 * Payment:
 *   MonCash / NatCash — prepare
 *
 * Storage:
 *   Cloudflare R2 — prepare
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    };

    const responseHeaders = {
      ...securityHeaders,
      ...corsHeaders
    };

    /*
     * -------------------------------------------------------
     * OPTIONS / CORS PREFLIGHT
     * -------------------------------------------------------
     */

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: responseHeaders
      });
    }

    /*
     * -------------------------------------------------------
     * API ROUTES
     * -------------------------------------------------------
     */

    if (url.pathname.startsWith("/api/")) {
      return handleAPI(
        request,
        env,
        url,
        responseHeaders
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

    const newHeaders = new Headers(
      response.headers
    );

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

        status:
          "online",

        website:
          "Wise.graphixdesign",

        payment: {
          moncash:
            "not_configured",

          natcash:
            "not_configured"
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
          error:
            "Invalid JSON request."
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
     * Payment methods ki aksepte.
     */

    const allowedPaymentMethods = [
      "moncash",
      "natcash"
    ];

    const normalizedPaymentMethod =
      paymentMethod
        ? String(paymentMethod).toLowerCase()
        : null;


    if (
      normalizedPaymentMethod &&
      !allowedPaymentMethods.includes(
        normalizedPaymentMethod
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
     * Kreye order ID.
     */

    const orderId =
      createOrderId();


    /*
     * Payment configuration status.
     */

    let paymentStatus =
      "not_configured";


    if (
      normalizedPaymentMethod ===
      "moncash"
    ) {
      paymentStatus =
        env.MONCASH_CLIENT_ID &&
        env.MONCASH_CLIENT_SECRET
          ? "credentials_configured"
          : "not_configured";
    }


    if (
      normalizedPaymentMethod ===
      "natcash"
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
          id:
            productId,

          name:
            productName,

          requestedPrice:
            requestedPrice
        },

        payment: {
          method:
            normalizedPaymentMethod ||
            "not_selected",

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


    return jsonResponse(
      {
        success: true,

        transactionId:

          transactionId,

        status:
          "not_configured",

        paid:
          false,

        message:
          "Payment verification poko konekte ak MonCash/NatCash."
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
   * Route pou secure paid downloads.
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
     * R2 poko konekte.
     */

    if (!env.PAID_ASSETS) {
      return jsonResponse(
        {
          success: false,

          status:
            "not_configured",

          productId:

            productId,

          message:
            "Secure download poko aktive. R2 poko konekte."
        },
        503,
        headers
      );
    }


    /*
     * Payment verification obligatwa.
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
     * Payment poko verifye.
     */

    return jsonResponse(
      {
        success: false,

        status:
          "payment_not_verified",

        productId:
          productId,

        transactionId:
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
      status:
        status,

      headers:
        responseHeaders
    }
  );
}
