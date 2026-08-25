/*
=========================================================
WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER FINAL
MONCASH SANDBOX + D1 + BACKBLAZE B2
=========================================================

FRONTEND:
- index.html
- styles.css
- brand.css
- script.js
- images/*

API:
GET  /api/health
GET  /api/moncash-token
POST /api/checkout
GET  /api/payment-status
GET  /api/file-info
GET  /api/download

PAYMENT:
MonCash Sandbox

DATABASE:
Cloudflare D1
Binding:
DB

STORAGE:
Backblaze B2 S3-Compatible API

SECRETS:
MONCASH_CLIENT_ID
MONCASH_CLIENT_SECRET

B2:
B2_BUCKET_NAME
B2_ENDPOINT
B2_KEY_ID
B2_APPLICATION_KEY

NATCASH:
PA KONFIGIRE POU KOUNYE A
=========================================================
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

      const newHeaders =
        new Headers(response.headers);

      for (
        const [key, value]
        of Object.entries(securityHeaders)
      ) {
        newHeaders.set(key, value);
      }

      return new Response(
        response.body,
        {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Worker internal error.",
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


/*
=========================================================
API HANDLER
=========================================================
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
          backblaze:
            hasB2Config(env)
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
          status: "credentials_missing",
          message:
            "MONCASH_CLIENT_ID oswa MONCASH_CLIENT_SECRET pa configured."
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
      body?.productName ||
      null;

    const requestedPrice =
      body?.price;

    const paymentMethod =
      body?.paymentMethod ||
      "moncash";

    const normalizedPaymentMethod =
      String(
        paymentMethod
      ).toLowerCase();

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

    const orderId =
      createOrderId();

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

    try {

      const tokenData =
        await getMonCashToken(env);

      const accessToken =
        tokenData.access_token;

      const createPaymentUrl =
        "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/CreatePayment";

      const paymentResponse =
        await fetch(
          createPaymentUrl,
          {
            method: "POST",

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

      const gatewayUrl =
        "https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware/Payment/Redirect?token=" +
        encodeURIComponent(
          paymentToken
        );

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
            "Payment MonCash la kreye."
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
            "d1_not_configured"
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
            "credentials_missing"
        },
        500,
        headers
      );
    }

    try {

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
              orderId
            },
            404,
            headers
          );
        }
      }

      const paymentResult =
        await verifyMonCashPayment(
          env,
          {
            transactionId,
            orderId
          }
        );

      if (orderId) {

        await updateOrderStatus(
          env,
          orderId,
          paymentResult.paid
            ? "paid"
            : "pending",
          paymentResult.transactionId
        );
      }

      return jsonResponse(
        {
          success: true,

          status:
            paymentResult.paid
              ? "paid"
              : "not_paid",

          paid:
            paymentResult.paid,

          orderId:
            orderId || null,

          transactionId:
            paymentResult.transactionId,

          payment:
            paymentResult.payment,

          moncashResponse:
            paymentResult.response,

          message:
            paymentResult.paid
              ? "Payment verifye avèk siksè."
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
            "Payment verification failed."
        },
        502,
        headers
      );
    }
  }


  /*
   * =======================================================
   * GET /api/file-info
   * =======================================================
   *
   * Sa se nouvo API pou frontend lan.
   *
   * Egzanp:
   *
   * /api/file-info?productId=flyer-01.psd
   *
   * oswa:
   *
   * /api/file-info?productId=asset-01.png
   */

  if (
    url.pathname === "/api/file-info" &&
    request.method === "GET"
  ) {

    const productId =
      url.searchParams.get(
        "productId"
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

    if (!env.DB) {
      return jsonResponse(
        {
          success: false,
          status:
            "d1_not_configured"
        },
        503,
        headers
      );
    }

    if (!hasB2Config(env)) {
      return jsonResponse(
        {
          success: false,
          status:
            "backblaze_not_configured"
        },
        503,
        headers
      );
    }

    try {

      const file =
        await getFileRecord(
          env,
          productId
        );

      if (!file) {
        return jsonResponse(
          {
            success: false,
            status:
              "file_not_registered",
            productId,
            message:
              "Fichye sa a poko anrejistre nan D1."
          },
          404,
          headers
        );
      }

      const metadata =
        await b2HeadObject(
          env,
          file.object_key
        );

      if (!metadata.exists) {
        return jsonResponse(
          {
            success: false,
            status:
              "file_not_found",
            productId,
            message:
              "Fichye a pa jwenn nan Backblaze B2."
          },
          404,
          headers
        );
      }

      await updateFileSize(
        env,
        productId,
        metadata.size
      );

      const latest =
        await getFileRecord(
          env,
          productId
        );

      return jsonResponse(
        {
          success: true,

          productId,

          fileType:
            latest.file_type,

          accessType:
            latest.access_type,

          fileSize:
            metadata.size,

          fileSizeFormatted:
            formatFileSize(
              metadata.size
            ),

          downloadCount:
            Number(
              latest.download_count || 0
            )
        },
        200,
        headers
      );

    } catch (error) {

      return jsonResponse(
        {
          success: false,
          status:
            "file_info_error",
          message:
            error?.message ||
            "Unable to read file information."
        },
        502,
        headers
      );
    }
  }


  /*
   * =======================================================
   * GET /api/download
   * =======================================================
   *
   * FREE:
   * /api/download?productId=xxx
   *
   * PAID:
   * /api/download?productId=xxx&orderId=xxx
   *
   * Paid yo verifye ak MonCash.
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

    if (!env.DB) {
      return jsonResponse(
        {
          success: false,
          status:
            "d1_not_configured"
        },
        503,
        headers
      );
    }

    if (!hasB2Config(env)) {
      return jsonResponse(
        {
          success: false,
          status:
            "backblaze_not_configured"
        },
        503,
        headers
      );
    }

    try {

      const file =
        await getFileRecord(
          env,
          productId
        );

      if (!file) {
        return jsonResponse(
          {
            success: false,
            status:
              "file_not_registered",
            message:
              "Fichye sa a poko anrejistre nan D1."
          },
          404,
          headers
        );
      }

      /*
       * ===================================================
       * PAID FILE
       * ===================================================
       */

      if (
        file.access_type === "paid"
      ) {

        if (
          !transactionId &&
          !orderId
        ) {
          return jsonResponse(
            {
              success: false,
              status:
                "payment_reference_missing",
              message:
                "Payment verification nesesè."
            },
            403,
            headers
          );
        }

        const paymentResult =
          await verifyMonCashPayment(
            env,
            {
              transactionId,
              orderId
            }
          );

        if (!paymentResult.paid) {
          return jsonResponse(
            {
              success: false,
              status:
                "payment_not_verified",
              paid:
                false,
              productId,
              orderId:
                orderId || null,
              transactionId:
                paymentResult.transactionId,
              message:
                "Payment la poko verifye kòm successful."
            },
            403,
            headers
          );
        }

        /*
         * Si orderId disponib,
         * verifye product la.
         */

        if (orderId) {

          const dbOrder =
            await getOrderByOrderId(
              env,
              orderId
            );

          if (!dbOrder) {
            return jsonResponse(
              {
                success: false,
                status:
                  "order_not_found"
              },
              404,
              headers
            );
          }

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
                  "Product la pa koresponn ak order la."
              },
              403,
              headers
            );
          }

          await updateOrderStatus(
            env,
            orderId,
            "paid",
            paymentResult.transactionId
          );
        }
      }


      /*
       * ===================================================
       * GET FILE FROM BACKBLAZE
       * ===================================================
       */

      const b2Response =
        await b2GetObject(
          env,
          file.object_key
        );

      if (!b2Response.ok) {

        return jsonResponse(
          {
            success: false,
            status:
              "file_not_found",
            message:
              "Fichye a pa jwenn nan Backblaze B2."
          },
          404,
          headers
        );
      }

      const contentType =
        b2Response.headers.get(
          "Content-Type"
        ) ||
        "application/octet-stream";

      const contentLength =
        b2Response.headers.get(
          "Content-Length"
        );

      /*
       * Mete size nan D1.
       */

      if (contentLength) {

        await updateFileSize(
          env,
          productId,
          Number(
            contentLength
          )
        );
      }

      /*
       * Counter +1.
       */

      const updated =
        await incrementDownloadCount(
          env,
          productId
        );

      const downloadHeaders =
        new Headers(headers);

      downloadHeaders.set(
        "Content-Type",
        contentType
      );

      if (contentLength) {
        downloadHeaders.set(
          "Content-Length",
          contentLength
        );
      }

      downloadHeaders.set(
        "Content-Disposition",
        `attachment; filename="${safeDownloadFilename(
          file.object_key
        )}"`
      );

      downloadHeaders.set(
        "Cache-Control",
        "private, no-store, max-age=0"
      );

      downloadHeaders.set(
        "X-Payment-Verified",
        file.access_type === "paid"
          ? "true"
          : "not_required"
      );

      downloadHeaders.set(
        "X-Download-Count",
        String(
          updated.downloadCount
        )
      );

      return new Response(
        b2Response.body,
        {
          status: 200,
          headers:
            downloadHeaders
        }
      );

    } catch (error) {

      return jsonResponse(
        {
          success: false,
          status:
            "download_error",
          message:
            error?.message ||
            "Download failed."
        },
        502,
        headers
      );
    }
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


/*
=========================================================
BACKBLAZE CONFIG
=========================================================
*/

function hasB2Config(env) {
  return Boolean(
    env.B2_BUCKET_NAME &&
    env.B2_ENDPOINT &&
    env.B2_KEY_ID &&
    env.B2_APPLICATION_KEY
  );
}


/*
=========================================================
BACKBLAZE S3 HEAD OBJECT
=========================================================
*/

async function b2HeadObject(
  env,
  objectKey
) {

  const result =
    await b2SignedRequest(
      env,
      "HEAD",
      objectKey
    );

  if (
    result.status === 404
  ) {
    return {
      exists: false,
      size: 0
    };
  }

  if (!result.ok) {
    throw new Error(
      `Backblaze HEAD failed: HTTP ${result.status}`
    );
  }

  return {
    exists: true,

    size:
      Number(
        result.headers.get(
          "Content-Length"
        ) || 0
      )
  };
}


/*
=========================================================
BACKBLAZE S3 GET OBJECT
=========================================================
*/

async function b2GetObject(
  env,
  objectKey
) {

  return b2SignedRequest(
    env,
    "GET",
    objectKey
  );
}


/*
=========================================================
BACKBLAZE AWS SIGV4 REQUEST
=========================================================
*/

async function b2SignedRequest(
  env,
  method,
  objectKey
) {

  const endpoint =
    String(
      env.B2_ENDPOINT
    )
    .replace(
      /\/+$/,
      ""
    );

  const endpointUrl =
    new URL(endpoint);

  const host =
    endpointUrl.host;

  const region =
    extractB2Region(
      endpointUrl
    );

  const encodedKey =
    encodeS3Path(
      objectKey
    );

  const targetUrl =
    `${endpoint}/${env.B2_BUCKET_NAME}/${encodedKey}`;

  const now =
    new Date();

  const amzDate =
    toAmzDate(now);

  const dateStamp =
    amzDate.slice(
      0,
      8
    );

  const service =
    "s3";

  const payloadHash =
    await sha256Hex("");

  const canonicalHeaders =
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const signedHeaders =
    "host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest =
    [
      method,
      `/${env.B2_BUCKET_NAME}/${encodedKey}`,
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join("\n");

  const credentialScope =
    `${dateStamp}/${region}/${service}/aws4_request`;

  const canonicalRequestHash =
    await sha256Hex(
      canonicalRequest
    );

  const stringToSign =
    [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      canonicalRequestHash
    ].join("\n");

  const signingKey =
    await getSignatureKey(
      env.B2_APPLICATION_KEY,
      dateStamp,
      region,
      service
    );

  const signature =
    await hmacHex(
      signingKey,
      stringToSign
    );

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${env.B2_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return fetch(
    targetUrl,
    {
      method,

      headers: {
        "Host":
          host,

        "x-amz-content-sha256":
          payloadHash,

        "x-amz-date":
          amzDate,

        "Authorization":
          authorization
      }
    }
  );
}


/*
=========================================================
AWS SIGNATURE HELPERS
=========================================================
*/

async function sha256Hex(
  value
) {

  const data =
    new TextEncoder().encode(
      value
    );

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return bytesToHex(
    new Uint8Array(
      hash
    )
  );
}


async function hmac(
  key,
  data
) {

  const cryptoKey =
    await crypto.subtle.importKey(
      "raw",
      key,
      {
        name:
          "HMAC",
        hash:
          "SHA-256"
      },
      false,
      ["sign"]
    );

  return new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      new TextEncoder().encode(
        data
      )
    )
  );
}


async function hmacHex(
  key,
  data
) {

  return bytesToHex(
    await hmac(
      key,
      data
    )
  );
}


async function getSignatureKey(
  secret,
  dateStamp,
  region,
  service
) {

  const kDate =
    await hmac(
      new TextEncoder().encode(
        "AWS4" + secret
      ),
      dateStamp
    );

  const kRegion =
    await hmac(
      kDate,
      region
    );

  const kService =
    await hmac(
      kRegion,
      service
    );

  return hmac(
    kService,
    "aws4_request"
  );
}


function bytesToHex(
  bytes
) {

  return Array.from(
    bytes
  )
  .map(
    byte =>
      byte
        .toString(16)
        .padStart(2, "0")
  )
  .join("");
}


/*
=========================================================
BACKBLAZE HELPERS
=========================================================
*/

function extractB2Region(
  endpointUrl
) {

  const host =
    endpointUrl.hostname;

  const match =
    host.match(
      /^s3\.([^.]+)\.backblazeb2\.com$/i
    );

  if (match) {
    return match[1];
  }

  /*
   * Si endpoint la gen yon lòt fòm,
   * itilize region sa a kòm fallback.
   */

  return "us-west-004";
}


function encodeS3Path(
  key
) {

  return String(
    key
  )
  .split("/")
  .map(
    part =>
      encodeURIComponent(
        part
      )
  )
  .join("/");
}


/*
=========================================================
D1 FILE RECORD
=========================================================
*/

async function getFileRecord(
  env,
  productId
) {

  return (
    await env.DB.prepare(
      `
      SELECT
        product_id,
        product_name,
        file_type,
        access_type,
        object_key,
        file_size,
        download_count,
        created_at,
        updated_at
      FROM files
      WHERE product_id = ?
      LIMIT 1
      `
    )
    .bind(
      String(productId)
    )
    .first()
  ) || null;
}


async function updateFileSize(
  env,
  productId,
  fileSize
) {

  await env.DB.prepare(
    `
    UPDATE files
    SET
      file_size = ?,
      updated_at = ?
    WHERE product_id = ?
    `
  )
  .bind(
    Number(fileSize) || 0,
    new Date().toISOString(),
    String(productId)
  )
  .run();
}


async function incrementDownloadCount(
  env,
  productId
) {

  await env.DB.prepare(
    `
    UPDATE files
    SET
      download_count =
        download_count + 1,
      updated_at = ?
    WHERE product_id = ?
    `
  )
  .bind(
    new Date().toISOString(),
    String(productId)
  )
  .run();

  const file =
    await getFileRecord(
      env,
      productId
    );

  return {
    downloadCount:
      Number(
        file?.download_count ||
        0
      )
  };
}


/*
=========================================================
D1 — GET ORDER
=========================================================
*/

async function getOrderByOrderId(
  env,
  orderId
) {

  if (!env.DB) {
    return null;
  }

  return (
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
    .first()
  ) || null;
}


/*
=========================================================
D1 — UPDATE ORDER STATUS
=========================================================
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
        transaction_id =
          COALESCE(
            ?,
            transaction_id
          ),
        paid_at =
          COALESCE(
            paid_at,
            ?
          )
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

  await env.DB.prepare(
    `
    UPDATE orders
    SET
      payment_status = ?,
      transaction_id =
        COALESCE(
          ?,
          transaction_id
        )
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


/*
=========================================================
MONCASH PAYMENT VERIFICATION
=========================================================
*/

async function verifyMonCashPayment(
  env,
  {
    transactionId,
    orderId
  }
) {

  const tokenData =
    await getMonCashToken(
      env
    );

  const accessToken =
    tokenData.access_token;

  let endpoint;
  let requestBody;

  if (transactionId) {

    endpoint =
      "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/RetrieveTransactionPayment";

    requestBody = {
      transactionId
    };

  } else {

    endpoint =
      "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/RetrieveOrderPayment";

    requestBody = {
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

  return {
    paid,

    payment,

    transactionId:
      finalTransactionId,

    response:
      verifyData
  };
}


/*
=========================================================
MONCASH TOKEN
=========================================================
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


/*
=========================================================
CREATE ORDER ID
=========================================================
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


/*
=========================================================
DOWNLOAD FILENAME
=========================================================
*/

function safeDownloadFilename(
  key
) {

  const parts =
    String(key)
      .split("/");

  const filename =
    parts[
      parts.length - 1
    ] ||
    "download";

  return filename.replace(
    /["\r\n\\]/g,
    "_"
  );
}


/*
=========================================================
FILE SIZE
=========================================================
*/

function formatFileSize(
  bytes
) {

  const value =
    Number(bytes) || 0;

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 ** 2) {
    return `${(
      value / 1024
    ).toFixed(1)} KB`;
  }

  if (value < 1024 ** 3) {
    return `${(
      value / (1024 ** 2)
    ).toFixed(1)} MB`;
  }

  return `${(
    value / (1024 ** 3)
  ).toFixed(2)} GB`;
}


/*
=========================================================
JSON RESPONSE
=========================================================
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
