/**
 * =========================================================
 * WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER
 * =========================================================
 *
 * FRONTEND:
 * index.html
 * styles.css
 * brand.css
 * script.js
 * images/*
 *
 * API:
 * GET  /api/health
 * GET  /api/moncash-token
 * POST /api/checkout
 * GET  /api/payment-status
 * GET  /api/download
 *
 * PAYMENT:
 * MonCash Sandbox -> CONNECTED FOR TOKEN TEST
 * NatCash        -> PREPARE
 *
 * STORAGE:
 * Cloudflare R2 -> PREPARE
 *
 * IMPORTANT:
 * Client ID / Client Secret yo pa ekri nan code la.
 * Yo dwe rete nan Cloudflare Secrets.
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
            env.MONCASH_CLIENT_ID &&
            env.MONCASH_CLIENT_SECRET
              ? "credentials_configured"
              : "not_configured",

          natcash:
            env.NATCASH_API_KEY
              ? "credentials_configured"
              : "not_configured"
        },

        storage: {
          r2:
            env.PAID_ASSETS
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
   * GET /api/moncash-token
   * =======================================================
   *
   * TEST:
   *
   * Worker -> MonCash Sandbox -> Access Token
   *
   * IMPORTANT:
   * Nou pa janm retounen Client Secret la.
   */

  if (
    url.pathname === "/api/moncash-token" &&
    request.method === "GET"
  ) {

    /*
     * Verifye credentials yo egziste.
     */

    if (
      !env.MONCASH_CLIENT_ID ||
      !env.MONCASH_CLIENT_SECRET
    ) {
      return jsonResponse(
        {
          success: false,

          status:
            "credentials_missing",

          message:
            "MONCASH_CLIENT_ID oswa MONCASH_CLIENT_SECRET pa configured nan Cloudflare Secrets."
        },
        500,
        headers
      );
    }


    /*
     * MonCash Sandbox API.
     */

    const tokenUrl =
      "https://sandbox.moncashbutton.digicelgroup.com/Api/oauth/token";


    /*
     * Basic Authentication:
     *
     * username = Client ID
     * password = Client Secret
     */

    const basicCredentials =
      btoa(
        `${env.MONCASH_CLIENT_ID}:${env.MONCASH_CLIENT_SECRET}`
      );


    try {

      const tokenResponse =
        await fetch(
          tokenUrl,
          {
            method: "POST",

            headers: {
              "Authorization":
                `Basic ${basicCredentials}`,

              "Accept":
                "application/json",

              "Content-Type":
                "application/x-www-form-urlencoded"
            },

            body:
              "scope=read,write&grant_type=client_credentials"
          }
        );


      /*
       * Li repons MonCash la.
       */

      const rawText =
        await tokenResponse.text();


      let tokenData;

      try {
        tokenData =
          JSON.parse(rawText);
      } catch {
        tokenData = {
          raw: rawText
        };
      }


      /*
       * Si MonCash pa bay 2xx.
       */

      if (!tokenResponse.ok) {

        return jsonResponse(
          {
            success: false,

            status:
              "moncash_auth_failed",

            httpStatus:
              tokenResponse.status,

            message:
              "MonCash Sandbox pa aksepte credentials yo.",

            moncashResponse:
              tokenData
          },
          502,
          headers
        );
      }


      /*
       * Token jwenn.
       *
       * Pou sekirite, nou PA retounen token an
       * nan repons browser la.
       */

      if (!tokenData?.access_token) {

        return jsonResponse(
          {
            success: false,

            status:
              "token_missing",

            message:
              "MonCash reponn men pa gen access_token nan repons lan.",

            moncashResponse:
              tokenData
          },
          502,
          headers
        );
      }


      /*
       * KONEKSYON MONCASH OK.
       */

      return jsonResponse(
        {
          success: true,

          status:
            "moncash_authenticated",

          provider:
            "MonCash Sandbox",

          message:
            "Worker la reyisi jwenn Access Token MonCash Sandbox la.",

          tokenType:
            tokenData.token_type || "bearer",

          expiresIn:
            tokenData.expires_in || null,

          scope:
            tokenData.scope || "read,write"
        },
        200,
        headers
      );

    } catch (error) {

      return jsonResponse(
        {
          success: false,

          status:
            "moncash_connection_error",

          message:
            "Worker la pa t kapab kontakte MonCash Sandbox.",

          error:
            error?.message || "Unknown error"
        },
        502,
        headers
      );
    }
  }


  /*
   * =======================================================
   * POST /api/checkout
   * =======================================================
   *
   * TEMPORARY CHECKOUT
   *
   * Payment reyèl poko fèt nan route sa a.
   * Pwochen etap la se konekte CreatePayment.
   */

  if (
    url.pathname === "/api/checkout" &&
    request.method === "POST"
  ) {

    let body;

    try {
      body =
        await request.json();
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
     * Payment methods nou sipòte.
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
     * Order ID.
     */

    const orderId =
      createOrderId();


    /*
     * Payment status.
     */

    let paymentStatus =
      "not_configured";


    if (
      String(paymentMethod).toLowerCase() ===
      "moncash"
    ) {

      paymentStatus =
        env.MONCASH_CLIENT_ID &&
        env.MONCASH_CLIENT_SECRET
          ? "credentials_configured"
          : "not_configured";
    }


    if (
      String(paymentMethod).toLowerCase() ===
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

          requestedPrice
        },

        payment: {
          method:
            paymentMethod ||
            "not_selected",

          status:
            paymentStatus
        },

        message:
          "Checkout la pare. CreatePayment MonCash ap vini nan pwochen etap la."
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

        transactionId,

        status:
          "not_configured",

        paid:
          false,

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
     * R2 poko configured.
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
     * Poko bay fichye a.
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
