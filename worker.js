/**
 * =========================================================
 * WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER
 * =========================================================
 *
 * Frontend:
 *   index.html
 *   styles.css
 *   brand.css
 *   script.js
 *   images/*
 *
 * Backend API:
 *   /api/health
 *   /api/checkout
 *   /api/payment-status
 *   /api/download
 *
 * Future:
 *   MonCash
 *   R2
 *   Secure paid downloads
 * =========================================================
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * -------------------------------------------------------
     * CORS / BASIC HEADERS
     * -------------------------------------------------------
     */

    const headers = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
    };

    /*
     * -------------------------------------------------------
     * API ROUTES
     * -------------------------------------------------------
     */

    if (url.pathname.startsWith("/api/")) {
      return handleAPI(request, env, url, headers);
    }

    /*
     * -------------------------------------------------------
     * STATIC WEBSITE
     * -------------------------------------------------------
     *
     * Tout sa ki pa /api/* ale dirèkteman nan ASSETS.
     *
     * Sa vle di:
     * /              -> index.html
     * /index.html    -> index.html
     * /styles.css    -> styles.css
     * /script.js     -> script.js
     * /sitemap.xml   -> sitemap.xml
     * /robots.txt    -> robots.txt
     * /images/...    -> images
     */

    const response = await env.ASSETS.fetch(request);

    /*
     * Add security headers without modifying
     * the original asset response.
     */

    const newHeaders = new Headers(response.headers);

    for (const [key, value] of Object.entries(headers)) {
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

async function handleAPI(request, env, url, securityHeaders) {

  /*
   * -------------------------------------------------------
   * GET /api/health
   * -------------------------------------------------------
   *
   * Simple endpoint pou verifye Worker la ap mache.
   */

  if (url.pathname === "/api/health") {
    return jsonResponse(
      {
        success: true,
        service: "Wise.graphixdesign Worker",
        status: "online",
        payment: "not_configured",
        storage: "not_configured"
      },
      200,
      securityHeaders
    );
  }


  /*
   * -------------------------------------------------------
   * POST /api/checkout
   * -------------------------------------------------------
   *
   * Sa a se baz checkout la.
   *
   * MonCash poko konekte.
   * Nou pap voye kliyan an nan okenn payment gateway
   * jiskaske credentials/API yo konfigire.
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
        securityHeaders
      );
    }

    const productId = body?.productId;
    const productName = body?.productName;
    const price = body?.price;

    if (!productId) {
      return jsonResponse(
        {
          success: false,
          error: "productId is required."
        },
        400,
        securityHeaders
      );
    }

    /*
     * IMPORTANT:
     *
     * Pa konsidere price kliyan an voye kòm pri final la.
     *
     * Lè nou konekte database/product catalog la,
     * Worker la ap verifye productId epi jwenn vrè pri a.
     */

    return jsonResponse(
      {
        success: true,
        status: "checkout_ready",
        product: {
          id: productId,
          name: productName || null,
          requestedPrice: price || null
        },
        payment: {
          provider: "MonCash",
          status: "not_configured"
        },
        message:
          "Checkout la pare. MonCash poko konekte."
      },
      200,
      securityHeaders
    );
  }


  /*
   * -------------------------------------------------------
   * GET /api/payment-status
   * -------------------------------------------------------
   *
   * Pita li pral verifye si transaction MonCash la reyisi.
   */

  if (
    url.pathname === "/api/payment-status" &&
    request.method === "GET"
  ) {

    const transactionId =
      url.searchParams.get("transactionId");

    if (!transactionId) {
      return jsonResponse(
        {
          success: false,
          error: "transactionId is required."
        },
        400,
        securityHeaders
      );
    }

    return jsonResponse(
      {
        success: true,
        transactionId,
        status: "not_configured",
        message:
          "Payment verification poko konekte ak MonCash."
      },
      200,
      securityHeaders
    );
  }


  /*
   * -------------------------------------------------------
   * GET /api/download
   * -------------------------------------------------------
   *
   * Pita route sa a ap bay kliyan an yon download URL
   * ki soti nan R2 apre payment la verifye.
   *
   * PA mete fichye premium yo dirèkteman nan public images/
   * si ou vle yo rete pwoteje.
   */

  if (
    url.pathname === "/api/download" &&
    request.method === "GET"
  ) {

    const productId =
      url.searchParams.get("productId");

    if (!productId) {
      return jsonResponse(
        {
          success: false,
          error: "productId is required."
        },
        400,
        securityHeaders
      );
    }

    /*
     * R2 poko konekte.
     */

    return jsonResponse(
      {
        success: false,
        status: "not_configured",
        productId,
        message:
          "Secure download poko aktive. R2 + payment verification nesesè."
      },
      503,
      securityHeaders
    );
  }


  /*
   * -------------------------------------------------------
   * API ROUTE NOT FOUND
   * -------------------------------------------------------
   */

  return jsonResponse(
    {
      success: false,
      error: "API route not found."
    },
    404,
    securityHeaders
  );
}


/**
 * =========================================================
 * JSON RESPONSE HELPER
 * =========================================================
 */

function jsonResponse(data, status = 200, extraHeaders = {}) {

  const headers = new Headers({
    "Content-Type": "application/json; charset=UTF-8",
    "Cache-Control": "no-store",
    ...extraHeaders
  });

  return new Response(
    JSON.stringify(data, null, 2),
    {
      status,
      headers
    }
  );
}
