/**
 * =========================================================
 * WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER
 * MONCASH SANDBOX
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
 * MonCash Sandbox
 *
 * STORAGE:
 * Cloudflare R2 -> PAID_ASSETS
 *
 * SECRETS:
 * MONCASH_CLIENT_ID
 * MONCASH_CLIENT_SECRET
 *
 * NATCASH:
 * PA KONFIGIRE POU KOUNYE A
 *
 * IMPORTANT:
 * Pa gen MONCASH_MODE ki nesesè.
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
            "not_configured"
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
   * TEST ONLY
   *
   * Nou pa janm voye access_token
   * bay browser la.
   */

  if (
    url.pathname === "/api/moncash-token" &&
    request.method === "GET"
  ) {

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

    try {

      const tokenData =
        await getMonCashToken(env);

      return jsonResponse(
        {
          success: true,

          status:
            "moncash_authenticated",

          provider:
            "MonCash Sandbox",

          message:
            "Worker la reyisi authenticate ak MonCash Sandbox.",

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
            error.code ||
            "moncash_auth_failed",

          message:
            error.message ||
            "MonCash authentication failed."
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
   * WORKFLOW:
   *
   * Browser
   *   ↓
   * Worker
   *   ↓
   * MonCash OAuth
   *   ↓
   * CreatePayment
   *   ↓
   * Payment Gateway URL
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


    /*
     * Product information
     */

    const productId =
      body?.productId;

    const productName =
      body?.productName ||
      null;

    const requestedPrice =
      body?.price;


    /*
     * Payment method
     */

    const paymentMethod =
      body?.paymentMethod ||
      "moncash";


    const normalizedPaymentMethod =
      String(
        paymentMethod
      ).toLowerCase();


    /*
     * Product ID obligatwa
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
     * Pou kounye a nou aksepte sèlman MonCash.
     *
     * NatCash ap ajoute pita.
     */

    if (
      normalizedPaymentMethod !==
      "moncash"
    ) {

      return jsonResponse(
        {
          success: false,

          error:
            "Payment method not available yet.",

          availableMethods:
            ["moncash"]
        },

        400,

        headers
      );
    }


    /*
     * Verify amount
     */

    const amount =
      Number(
        requestedPrice
      );


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      return jsonResponse(
        {
          success: false,

          error:
            "A valid positive price is required."
        },

        400,

        headers
      );
    }


    /*
     * MonCash itilize kantite lajan
     * kòm amount.
     */

    if (
      amount > 100000000
    ) {

      return jsonResponse(
        {
          success: false,

          error:
            "Amount is too large."
        },

        400,

        headers
      );
    }


    /*
     * Order ID inik
     */

    const orderId =
      createOrderId();


    /*
     * Verify MonCash credentials
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
            "MonCash credentials yo poko configured nan Cloudflare Secrets."
        },

        500,

        headers
      );
    }


    try {

      /*
       * ===================================================
       * GET ACCESS TOKEN
       * ===================================================
       */

      const tokenData =
        await getMonCashToken(env);


      const accessToken =
        tokenData.access_token;


      /*
       * ===================================================
       * CREATE PAYMENT
       * ===================================================
       */

      const createPaymentUrl =
        "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/CreatePayment";


      const paymentResponse =
        await fetch(
          createPaymentUrl,
          {
            method:
              "POST",

            headers: {

              "Authorization":
                `Bearer ${accessToken}`,

              "Accept":
                "application/json",

              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                amount,
                orderId
              })
          }
        );


      const rawPayment =
        await paymentResponse.text();


      let paymentData;

      try {

        paymentData =
          JSON.parse(
            rawPayment
          );

      } catch {

        paymentData = {
          raw:
            rawPayment
        };
      }


      /*
       * CreatePayment failed
       */

      if (
        !paymentResponse.ok
      ) {

        return jsonResponse(
          {
            success: false,

            status:
              "create_payment_failed",

            httpStatus:
              paymentResponse.status,

            orderId,

            message:
              "MonCash pa t kapab kreye payment la.",

            moncashResponse:
              paymentData
          },

          502,

          headers
        );
      }


      /*
       * Payment token
       */

      const paymentToken =
        paymentData
          ?.payment_token
          ?.token;


      if (!paymentToken) {

        return jsonResponse(
          {
            success: false,

            status:
              "payment_token_missing",

            orderId,

            message:
              "MonCash reponn men pa gen payment token.",

            moncashResponse:
              paymentData
          },

          502,

          headers
        );
      }


      /*
       * MonCash Sandbox Gateway
       */

      const gatewayUrl =
        "https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware/Payment/Redirect?token=" +
        encodeURIComponent(
          paymentToken
        );


      /*
       * Response pou frontend
       */

      return jsonResponse(
        {
          success: true,

          status:
            "payment_created",

          provider:
            "MonCash Sandbox",

          orderId,

          product: {

            id:
              productId,

            name:
              productName,

            price:
              amount
          },

          payment: {

            method:
              "moncash",

            status:
              "created",

            paymentTokenCreated:
              true
          },

          /*
           * Frontend lan ka itilize
           * redirectUrl pou voye kliyan
           * sou MonCash.
           */

          redirectUrl:
            gatewayUrl,

          paymentUrl:
            gatewayUrl,

          message:
            "Payment MonCash la kreye. Redireksyon kliyan an sou MonCash."
        },

        200,

        headers
      );

    } catch (error) {

      return jsonResponse(
        {
          success: false,

          status:
            "moncash_checkout_error",

          orderId,

          message:
            error?.message ||
            "Worker la pa t kapab kreye payment MonCash la."
        },

        502,

        headers
      );
    }
  }


  /**
   * =======================================================
   * GET /api/payment-status
   * =======================================================
   *
   * Verifye yon transaction oswa order
   * dirèkteman ak MonCash.
   *
   * Li sipòte:
   *
   * ?transactionId=XXXX
   *
   * oswa
   *
   * ?orderId=XXXX
   */

  if (
    url.pathname === "/api/payment-status" &&
    request.method === "GET"
  ) {

    const transactionId =
      url.searchParams.get(
        "transactionId"
      );

    const orderId =
      url.searchParams.get(
        "orderId"
      );


    if (
      !transactionId &&
      !orderId
    ) {

      return jsonResponse(
        {
          success: false,

          error:
            "transactionId or orderId is required."
        },

        400,

        headers
      );
    }


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
            "MonCash credentials yo poko configured."
        },

        500,

        headers
      );
    }


    try {

      const tokenData =
        await getMonCashToken(env);


      const accessToken =
        tokenData.access_token;


      let endpoint;

      let requestBody;


      /*
       * Transaction ID
       */

      if (transactionId) {

        endpoint =
          "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/RetrieveTransactionPayment";

        requestBody =
          {
            transactionId
          };

      } else {

        /*
         * Order ID
         */

        endpoint =
          "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/RetrieveOrderPayment";

        requestBody =
          {
            orderId
          };
      }


      const verifyResponse =
        await fetch(
          endpoint,
          {
            method:
              "POST",

            headers: {

              "Authorization":
                `Bearer ${accessToken}`,

              "Accept":
                "application/json",

              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                requestBody
              )
          }
        );


      const rawVerify =
        await verifyResponse.text();


      let verifyData;

      try {

        verifyData =
          JSON.parse(
            rawVerify
          );

      } catch {

        verifyData = {
          raw:
            rawVerify
        };
      }


      /*
       * MonCash response status
       */

      const payment =
        verifyData?.payment ||
        null;


      const paymentMessage =
        String(
          payment?.message ||
          ""
        ).toLowerCase();


      const isPaid =
        verifyResponse.ok &&
        (
          paymentMessage ===
          "successful"
        );


      return jsonResponse(
        {
          success:
            true,

          status:
            isPaid
              ? "paid"
              : "not_paid",

          paid:
            isPaid,

          orderId:
            orderId ||
            null,

          transactionId:
            transactionId ||
            payment?.transaction_id ||
            null,

          payment:
            payment,

          moncashResponse:
            verifyData,

          message:
            isPaid
              ? "Payment MonCash verifye avèk siksè."
              : "Payment la poko verifye kòm successful."
        },

        200,

        headers
      );

    } catch (error) {

      return jsonResponse(
        {
          success: false,

          status:
            "payment_verification_error",

          message:
            error?.message ||
            "Worker la pa t kapab verifye payment la."
        },

        502,

        headers
      );
    }
  }


  /**
   * =======================================================
   * GET /api/download
   * =======================================================
   *
   * IMPORTANT:
   *
   * Pa bay R2 file la sof si MonCash
   * verifye payment la kòm successful.
   *
   * Paramèt:
   *
   * productId
   * +
   * transactionId
   *
   * oswa
   *
   * productId
   * +
   * orderId
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

    const orderId =
      url.searchParams.get(
        "orderId"
      );


    /*
     * Product ID
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
     * R2
     */

    if (!env.PAID_ASSETS) {

      return jsonResponse(
        {
          success: false,

          status:
            "r2_not_configured",

          message:
            "PAID_ASSETS R2 binding poko configured."
        },

        503,

        headers
      );
    }


    /*
     * Payment reference
     */

    if (
      !transactionId &&
      !orderId
    ) {

      return jsonResponse(
        {
          success: false,

          status:
            "payment_reference_missing",

          error:
            "transactionId or orderId is required.",

          message:
            "Payment verification nesesè anvan download."
        },

        403,

        headers
      );
    }


    /*
     * Verify payment BEFORE R2.
     */

    let paymentCheck;

    try {

      const tokenData =
        await getMonCashToken(env);


      const accessToken =
        tokenData.access_token;


      let endpoint;

      let requestBody;


      if (transactionId) {

        endpoint =
          "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/RetrieveTransactionPayment";

        requestBody =
          {
            transactionId
          };

      } else {

        endpoint =
          "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/RetrieveOrderPayment";

        requestBody =
          {
            orderId
          };
      }


      const verifyResponse =
        await fetch(
          endpoint,
          {
            method:
              "POST",

            headers: {

              "Authorization":
                `Bearer ${accessToken}`,

              "Accept":
                "application/json",

              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                requestBody
              )
          }
        );


      const rawVerify =
        await verifyResponse.text();


      let verifyData;

      try {

        verifyData =
          JSON.parse(
            rawVerify
          );

      } catch {

        verifyData = {
          raw:
            rawVerify
        };
      }


      const payment =
        verifyData?.payment ||
        null;


      const paymentMessage =
        String(
          payment?.message ||
          ""
        ).toLowerCase();


      const paid =
        verifyResponse.ok &&
        paymentMessage ===
        "successful";


      paymentCheck = {
        paid,
        payment,
        response:
          verifyData
      };

    } catch (error) {

      return jsonResponse(
        {
          success: false,

          status:
            "payment_verification_error",

          message:
            "Payment la pa t kapab verifye anvan download.",

          error:
            error?.message ||
            "Unknown error"
        },

        502,

        headers
      );
    }


    /*
     * NEVER serve R2 before payment success.
     */

    if (
      !paymentCheck.paid
    ) {

      return jsonResponse(
        {
          success: false,

          status:
            "payment_not_verified",

          paid:
            false,

          productId,

          transactionId:
            transactionId ||
            paymentCheck
              ?.payment
              ?.transaction_id ||
            null,

          orderId:
            orderId ||
            null,

          message:
            "Payment la poko verifye kòm successful. Download la bloke."
        },

        403,

        headers
      );
    }


    /*
     * =====================================================
     * R2 OBJECT KEY
     * =====================================================
     *
     * IMPORTANT:
     * ProductId la dwe koresponn ak non
     * fichye PSD ou mete nan R2.
     *
     * Egzanp:
     *
     * productId = flyer-01.psd
     *
     * R2 object = flyer-01.psd
     *
     * Si pita ou itilize yon lòt estrikti
     * folder, nou ka chanje SA sèlman.
     */

    const safeProductId =
      sanitizeR2Key(
        productId
      );


    if (!safeProductId) {

      return jsonResponse(
        {
          success: false,

          error:
            "Invalid productId."
        },

        400,

        headers
      );
    }


    /*
     * R2 lookup
     */

    const object =
      await env.PAID_ASSETS.get(
        safeProductId
      );


    if (!object) {

      return jsonResponse(
        {
          success: false,

          status:
            "file_not_found",

          productId,

          message:
            "Payment verifye, men fichye PSD la pa jwenn nan R2."
        },

        404,

        headers
      );
    }


    /*
     * Download headers
     */

    const downloadHeaders = {
      ...headers,

      "Content-Type":
        object.httpMetadata?.contentType ||
        "application/octet-stream",

      "Content-Disposition":
        `attachment; filename="${safeDownloadFilename(
          safeProductId
        )}"`,

      "Cache-Control":
        "private, no-store, max-age=0",

      "X-Payment-Verified":
        "true"
    };


    /*
     * R2 file
     */

    return new Response(
      object.body,
      {
        status:
          200,

        headers:
          downloadHeaders
      }
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
 * MONCASH TOKEN
 * =========================================================
 */

async function getMonCashToken(
  env
) {

  if (
    !env.MONCASH_CLIENT_ID ||
    !env.MONCASH_CLIENT_SECRET
  ) {

    const error =
      new Error(
        "MONCASH_CLIENT_ID oswa MONCASH_CLIENT_SECRET pa configured."
      );

    error.code =
      "credentials_missing";

    throw error;
  }


  const tokenUrl =
    "https://sandbox.moncashbutton.digicelgroup.com/Api/oauth/token";


  const basicCredentials =
    btoa(
      `${env.MONCASH_CLIENT_ID}:${env.MONCASH_CLIENT_SECRET}`
    );


  const response =
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


  const rawText =
    await response.text();


  let data;

  try {

    data =
      JSON.parse(
        rawText
      );

  } catch {

    data = {
      raw:
        rawText
    };
  }


  if (
    !response.ok
  ) {

    const error =
      new Error(
        "MonCash Sandbox pa aksepte credentials yo."
      );

    error.code =
      "moncash_auth_failed";

    error.details =
      data;

    throw error;
  }


  if (
    !data ||
    !data.access_token
  ) {

    const error =
      new Error(
        "MonCash pa retounen access_token."
      );

    error.code =
      "token_missing";

    error.details =
      data;

    throw error;
  }


  return data;
}


/**
 * =========================================================
 * CREATE ORDER ID
 * =========================================================
 */

function createOrderId() {

  const random =
    crypto.randomUUID()
      .replaceAll(
        "-",
        ""
      )
      .slice(
        0,
        12
      )
      .toUpperCase();


  return (
    `WGD-${Date.now()}-${random}`
  );
}


/**
 * =========================================================
 * SANITIZE R2 KEY
 * =========================================================
 */

function sanitizeR2Key(
  value
) {

  let key =
    String(
      value || ""
    ).trim();


  if (!key) {
    return null;
  }


  /*
   * Pa pèmèt:
   *
   * ../
   * /
   * backslash
   *
   * pou evite path traversal.
   */

  if (
    key.includes("..") ||
    key.includes("\\") ||
    key.startsWith("/")
  ) {

    return null;
  }


  /*
   * Pa pèmèt control characters.
   */

  if (
    /[\u0000-\u001F\u007F]/.test(
      key
    )
  ) {

    return null;
  }


  /*
   * Limite longè key.
   */

  if (
    key.length > 500
  ) {

    return null;
  }


  return key;
}


/**
 * =========================================================
 * DOWNLOAD FILENAME
 * =========================================================
 */

function safeDownloadFilename(
  key
) {

  const parts =
    key.split("/");

  const filename =
    parts[
      parts.length - 1
    ] ||
    "download";


  return filename
    .replace(
      /["\r\n\\]/g,
      "_"
    );
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
