/**
 * =========================================================
 * WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER FINAL
 * MONCASH SANDBOX + D1 + R2
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
 * DATABASE:
 * Cloudflare D1
 * Binding:
 * DB
 *
 * STORAGE:
 * Cloudflare R2
 * Binding:
 * PAID_ASSETS
 *
 * ASSETS:
 * Cloudflare Pages/Worker Assets
 * Binding:
 * ASSETS
 *
 * SECRETS:
 * MONCASH_CLIENT_ID
 * MONCASH_CLIENT_SECRET
 *
 * NATCASH:
 * PA KONFIGIRE POU KOUNYE A
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

        database: {

          d1:
            env.DB
              ? "configured"
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
   * Validate product
   *   ↓
   * Create order in D1
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
     * Aksepte sèlman MonCash pou kounye a.
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
     * Verify D1
     */

    if (!env.DB) {

      return jsonResponse(
        {
          success: false,

          status:
            "d1_not_configured",

          message:
            "D1 binding DB poko configured."
        },

        503,

        headers
      );
    }


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


    /*
     * Order ID inik
     */

    const orderId =
      createOrderId();


    /*
     * =====================================================
     * CREATE ORDER IN D1
     * =====================================================
     */

    try {

      await env.DB.prepare(
        `
        INSERT INTO orders (
          order_id,
          product_id,
          product_name,
          amount,
          payment_method,
          payment_status,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `
      )
      .bind(
        orderId,
        String(productId),
        productName
          ? String(productName)
          : null,
        amount,
        normalizedPaymentMethod,
        "pending",
        new Date().toISOString()
      )
      .run();

    } catch (error) {

      return jsonResponse(
        {
          success: false,

          status:
            "d1_order_create_failed",

          orderId,

          message:
            "Worker la pa kapab kreye order la nan D1.",

          error:
            error?.message ||
            "D1 error"
        },

        500,

        headers
      );
    }


    /*
     * =====================================================
     * MONCASH PAYMENT
     * =====================================================
     */

    try {

      /*
       * GET ACCESS TOKEN
       */

      const tokenData =
        await getMonCashToken(env);


      const accessToken =
        tokenData.access_token;


      /*
       * CREATE PAYMENT
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

        await updateOrderStatus(
          env,
          orderId,
          "failed",
          null
        );

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

        await updateOrderStatus(
          env,
          orderId,
          "failed",
          null
        );

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

      await updateOrderStatus(
        env,
        orderId,
        "failed",
        null
      );

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
   * Verifye payment ak MonCash
   * epi mete rezilta a nan D1.
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


    if (!env.DB) {

      return jsonResponse(
        {
          success: false,

          status:
            "d1_not_configured",

          message:
            "D1 binding DB poko configured."
        },

        503,

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

      /*
       * Si orderId la disponib,
       * verifye li nan D1 anvan.
       */

      let dbOrder = null;

      if (orderId) {

        dbOrder =
          await getOrderByOrderId(
            env,
            orderId
          );

        if (!dbOrder) {

          return jsonResponse(
            {
              success: false,

              status:
                "order_not_found",

              orderId,

              message:
                "Order sa a pa jwenn nan D1."
            },

            404,

            headers
          );
        }
      }


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
       * MonCash response
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
        paymentMessage ===
        "successful";


      const finalTransactionId =
        transactionId ||
        payment?.transaction_id ||
        payment?.transactionId ||
        null;


      /*
       * =====================================================
       * UPDATE D1
       * =====================================================
       */

      if (orderId) {

        await updateOrderStatus(
          env,
          orderId,
          isPaid
            ? "paid"
            : "pending",
          finalTransactionId
        );
      }


      return jsonResponse(
        {
          success: true,

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
            finalTransactionId,

          payment:
            payment,

          moncashResponse:
            verifyData,

          message:
            isPaid
              ? "Payment MonCash verifye avèk siksè epi D1 mete ajou."
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
   * Payment dwe successful.
   *
   * Product ID + orderId
   *
   * oswa
   *
   * Product ID + transactionId
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
     * D1
     */

    if (!env.DB) {

      return jsonResponse(
        {
          success: false,

          status:
            "d1_not_configured",

          message:
            "D1 binding DB poko configured."
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
     * =====================================================
     * D1 ORDER CHECK
     * =====================================================
     */

    let dbOrder = null;

    if (orderId) {

      dbOrder =
        await getOrderByOrderId(
          env,
          orderId
        );

      if (!dbOrder) {

        return jsonResponse(
          {
            success: false,

            status:
              "order_not_found",

            message:
              "Order sa a pa jwenn nan D1."
          },

          404,

          headers
        );
      }


      /*
       * Product dwe menm ak order la.
       */

      if (
        String(
          dbOrder.product_id
        ) !==
        String(
          productId
        )
      ) {

        return jsonResponse(
          {
            success: false,

            status:
              "product_mismatch",

            message:
              "Product la pa koresponn ak order sa a."
          },

          403,

          headers
        );
      }
    }


    /*
     * =====================================================
     * VERIFY PAYMENT BEFORE R2
     * =====================================================
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


      const finalTransactionId =
        transactionId ||
        payment?.transaction_id ||
        payment?.transactionId ||
        null;


      paymentCheck = {
        paid,

        payment,

        transactionId:
          finalTransactionId,

        response:
          verifyData
      };


      /*
       * =====================================================
       * UPDATE D1 AFTER VERIFICATION
       * =====================================================
       */

      if (orderId) {

        await updateOrderStatus(
          env,
          orderId,
          paid
            ? "paid"
            : "pending",
          finalTransactionId
        );
      }

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
            paymentCheck
              ?.transactionId ||
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
     * VERIFY D1 PAYMENT STATE
     * =====================================================
     *
     * Si orderId disponib, D1 dwe montre paid.
     */

    if (orderId) {

      const latestOrder =
        await getOrderByOrderId(
          env,
          orderId
        );

      if (
        !latestOrder ||
        latestOrder.payment_status !==
        "paid"
      ) {

        return jsonResponse(
          {
            success: false,

            status:
              "d1_payment_not_confirmed",

            message:
              "MonCash verifye payment la men D1 poko konfime li."
          },

          403,

          headers
        );
      }
    }


    /*
     * =====================================================
     * R2 OBJECT KEY
     * =====================================================
     *
     * ProductId la dwe koresponn ak
     * non fichye PSD la nan R2.
     *
     * Egzanp:
     *
     * productId = flyer-01.psd
     *
     * R2 object = flyer-01.psd
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
 * D1 — GET ORDER
 * =========================================================
 */

async function getOrderByOrderId(
  env,
  orderId
) {

  if (!env.DB) {
    return null;
  }

  const result =
    await env.DB.prepare(
      `
      SELECT
        id,
        order_id,
        product_id,
        product_name,
        amount,
        payment_method,
        payment_status,
        transaction_id,
        created_at,
        paid_at
      FROM orders
      WHERE order_id = ?
      LIMIT 1
      `
    )
    .bind(
      orderId
    )
    .first();

  return result || null;
}


/**
 * =========================================================
 * D1 — UPDATE ORDER STATUS
 * =========================================================
 */

async function updateOrderStatus(
  env,
  orderId,
  status,
  transactionId
) {

  if (!env.DB || !orderId) {
    return;
  }

  if (status === "paid") {

    await env.DB.prepare(
      `
      UPDATE orders
      SET
        payment_status = ?,
        transaction_id = COALESCE(?, transaction_id),
        paid_at = COALESCE(paid_at, ?)
      WHERE order_id = ?
      `
    )
    .bind(
      "paid",
      transactionId || null,
      new Date().toISOString(),
      orderId
    )
    .run();

    return;
  }


  if (status === "failed") {

    await env.DB.prepare(
      `
      UPDATE orders
      SET
        payment_status = ?
      WHERE order_id = ?
      `
    )
    .bind(
      "failed",
      orderId
    )
    .run();

    return;
  }


  /*
   * Pending / lòt status
   */

  await env.DB.prepare(
    `
    UPDATE orders
    SET
      payment_status = ?,
      transaction_id = COALESCE(?, transaction_id)
    WHERE order_id = ?
    `
  )
  .bind(
    status,
    transactionId || null,
    orderId
  )
  .run();
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
   * Pa pèmèt path traversal.
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
