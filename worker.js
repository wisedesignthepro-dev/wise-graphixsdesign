/**
 * =========================================================
 * WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER FINAL
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
 * MonCash Sandbox -> Token test
 * NatCash        -> Prepare
 *
 * STORAGE:
 * Cloudflare R2 -> PAID_ASSETS
 *
 * IMPORTANT:
 * MONCASH_CLIENT_ID
 * MONCASH_CLIENT_SECRET
 *
 * dwe rete nan Cloudflare Secrets.
 *
 * =========================================================
 */

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      /*
       * =====================================================
       * SECURITY HEADERS
       * =====================================================
       */

      const securityHeaders = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy":
          "camera=(), microphone=(), geolocation=()"
      };

      /*
       * =====================================================
       * CORS
       * =====================================================
       *
       * Nou itilize origin request la.
       * Sa evite louvri API a pou tout sit.
       */

      const requestOrigin =
        request.headers.get("Origin");

      const corsOrigin =
        requestOrigin || url.origin;

      const corsHeaders = {
        "Access-Control-Allow-Origin":
          corsOrigin,

        "Access-Control-Allow-Methods":
          "GET, POST, OPTIONS",

        "Access-Control-Allow-Headers":
          "Content-Type",

        "Access-Control-Max-Age":
          "86400",

        "Vary":
          "Origin"
      };

      /*
       * =====================================================
       * CORS PREFLIGHT
       * =====================================================
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
       * =====================================================
       * API
       * =====================================================
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
       * =====================================================
       * STATIC WEBSITE
       * =====================================================
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

      /*
       * Cloudflare ASSETS
       */

      const response =
        await env.ASSETS.fetch(request);

      /*
       * Ajoute security headers
       * san modifye kontni sit la.
       */

      const newHeaders =
        new Headers(response.headers);

      for (
        const [key, value]
        of Object.entries(securityHeaders)
      ) {
        newHeaders.set(
          key,
          value
        );
      }

      return new Response(
        response.body,
        {
          status:
            response.status,

          statusText:
            response.statusText,

          headers:
            newHeaders
        }
      );

    } catch (error) {

      /*
       * =====================================================
       * GLOBAL ERROR
       * =====================================================
       */

      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Worker internal error.",
          message:
            error?.message ||
            "Unknown error"
        }),
        {
          status: 500,

          headers: {
            "Content-Type":
              "application/json; charset=UTF-8",

            "Cache-Control":
              "no-store"
          }
        }
      );
    }
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

  /**
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

          moncash: {
            clientId:
              Boolean(
                env.MONCASH_CLIENT_ID
              ),

            clientSecret:
              Boolean(
                env.MONCASH_CLIENT_SECRET
              )
          },

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


  /**
   * =======================================================
   * GET /api/moncash-token
   * =======================================================
   *
   * TEST:
   *
   * Worker
   *   ↓
   * MonCash Sandbox
   *   ↓
   * Access Token
   *
   * Client Secret la PA JANM soti
   * nan Worker la.
   */

  if (
    url.pathname === "/api/moncash-token" &&
    request.method === "GET"
  ) {

    /*
     * Verify Secrets yo.
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
     * MonCash Sandbox OAuth endpoint.
     */

    const tokenUrl =
      "https://sandbox.moncashbutton.digicelgroup.com/Api/oauth/token";


    /*
     * Basic Authentication
     *
     * Client ID
     * +
     * Client Secret
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
            method:
              "POST",

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
       * Li repons lan kòm text
       * anvan JSON parse.
       */

      const rawText =
        await tokenResponse.text();


      let tokenData;

      try {

        tokenData =
          JSON.parse(rawText);

      } catch {

        tokenData = {
          raw:
            rawText
        };
      }


      /*
       * MonCash pa bay 2xx.
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
       * Verify access_token.
       */

      if (
        !tokenData ||
        !tokenData.access_token
      ) {

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
       * SECURITY:
       *
       * Nou PA retounen access_token
       * nan browser la.
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
            tokenData.token_type ||
            "bearer",

          expiresIn:
            tokenData.expires_in ||
            null,

          scope:
            tokenData.scope ||
            "read,write"
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
            error?.message ||
            "Unknown error"
        },

        502,

        headers
      );
    }
  }


  /**
   * =======================================================
   * POST /api/checkout
   * =======================================================
   *
   * Checkout preparasyon.
   *
   * Sa poko fè CreatePayment.
   * Li sèlman prepare order la.
   */

  if (
    url.pathname === "/api/checkout" &&
    request.method === "POST"
  ) {

    let body;

    /*
     * Parse JSON.
     */

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


    /*
     * Product.
     */

    const productId =
      body?.productId;


    const productName =
      body?.productName ||
      null;


    const requestedPrice =
      body?.price ||
      null;


    const paymentMethod =
      body?.paymentMethod ||
      null;


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
     * Payment methods.
     */

    const allowedPaymentMethods = [
      "moncash",
      "natcash"
    ];


    const normalizedPaymentMethod =
      paymentMethod
        ? String(
            paymentMethod
          ).toLowerCase()
        : null;


    /*
     * Verify payment method.
     */

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
     * Order ID.
     */

    const orderId =
      createOrderId();


    /*
     * Payment status.
     */

    let paymentStatus =
      "not_configured";


    /*
     * MONCASH
     */

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


    /*
     * NATCASH
     */

    if (
      normalizedPaymentMethod ===
      "natcash"
    ) {

      paymentStatus =
        env.NATCASH_API_KEY

          ? "credentials_configured"

          : "not_configured";
    }


    /*
     * Response.
     */

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
            normalizedPaymentMethod ||
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


  /**
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


    /*
     * Transaction ID obligatwa.
     */

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
     * Payment verification
     * poko konekte.
     */

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


  /**
   * =======================================================
   * GET /api/download
   * =======================================================
   *
   * Download PAID asset yo
   * dwe pase nan verification payment.
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
     * R2 pa configured.
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
     * Payment transaction obligatwa.
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
     * Payment verification
     * poko konekte.
     *
     * Pa janm bay R2 file la
     * anvan payment verifye.
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


  /**
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
