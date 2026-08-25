/*
=========================================================
WISE.GRAPHIXDESIGN — CLOUDFLARE WORKER FINAL
MONCASH SANDBOX + D1 + BACKBLAZE B2 + ASSETS
=========================================================
*/

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      const securityHeaders = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
      };

      const requestOrigin = request.headers.get("Origin");
      const corsOrigin = requestOrigin || url.origin;

      const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin"
      };

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            ...securityHeaders,
            ...corsHeaders
          }
        });
      }

      if (url.pathname.startsWith("/api/")) {
        return handleAPI(request, env, url, {
          ...securityHeaders,
          ...corsHeaders
        });
      }

      if (!env.ASSETS) {
        return new Response("ASSETS binding is not configured.", {
          status: 500,
          headers: securityHeaders
        });
      }

      const response = await env.ASSETS.fetch(request);
      const newHeaders = new Headers(response.headers);

      for (const [key, value] of Object.entries(securityHeaders)) {
        newHeaders.set(key, value);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Worker internal error.",
          message: error?.message || "Unknown error"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Cache-Control": "no-store"
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

async function handleAPI(request, env, url, headers) {

  /*
  =======================================================
  GET /api/health
  =======================================================
  */

  if (
    url.pathname === "/api/health" &&
    request.method === "GET"
  ) {
    return jsonResponse(
      {
        success: true,
        service: "Wise.graphixdesign Worker",
        status: "online",
        website: "Wise.graphixdesign",

        payment: {
          moncash: {
            clientId: Boolean(env.MONCASH_CLIENT_ID),
            clientSecret: Boolean(env.MONCASH_CLIENT_SECRET)
          },
          natcash: "not_configured"
        },

        database: {
          d1: env.DB ? "configured" : "not_configured"
        },

        storage: {
          backblaze: hasBackblazeConfig(env)
            ? "configured"
            : "not_configured"
        },

        features: {
          downloadCounter: env.DB ? "enabled" : "disabled",
          fileSize: hasBackblazeConfig(env)
            ? "enabled"
            : "disabled",
          paidDownloads:
            env.DB && hasBackblazeConfig(env)
              ? "protected"
              : "disabled"
        },

        timestamp: new Date().toISOString()
      },
      200,
      headers
    );
  }


  /*
  =======================================================
  GET /api/moncash-token
  =======================================================
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
            "MONCASH_CLIENT_ID oswa MONCASH_CLIENT_SECRET pa configured nan Cloudflare Secrets."
        },
        500,
        headers
      );
    }

    try {
      const tokenData = await getMonCashToken(env);

      return jsonResponse(
        {
          success: true,
          status: "moncash_authenticated",
          provider: "MonCash Sandbox",
          message:
            "Worker la reyisi authenticate ak MonCash Sandbox.",
          tokenType: tokenData.token_type || "bearer",
          expiresIn: tokenData.expires_in || null,
          scope: tokenData.scope || "read,write"
        },
        200,
        headers
      );

    } catch (error) {
      return jsonResponse(
        {
          success: false,
          status: error.code || "moncash_auth_failed",
          message:
            error.message || "MonCash authentication failed."
        },
        502,
        headers
      );
    }
  }


  /*
  =======================================================
  POST /api/checkout
  =======================================================
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

    const productId = body?.productId;
    const productName = body?.productName || null;
    const requestedPrice = body?.price;
    const paymentMethod = body?.paymentMethod || "moncash";

    const normalizedPaymentMethod =
      String(paymentMethod).toLowerCase();

    if (!productId) {
      return jsonResponse(
        {
          success: false,
          error: "productId is required."
        },
        400,
        headers
      );
    }

    if (normalizedPaymentMethod !== "moncash") {
      return jsonResponse(
        {
          success: false,
          error: "Payment method not available yet.",
          availableMethods: ["moncash"]
        },
        400,
        headers
      );
    }

    const amount = Number(requestedPrice);

    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonResponse(
        {
          success: false,
          error: "A valid positive price is required."
        },
        400,
        headers
      );
    }

    if (amount > 100000000) {
      return jsonResponse(
        {
          success: false,
          error: "Amount is too large."
        },
        400,
        headers
      );
    }

    if (!env.DB) {
      return jsonResponse(
        {
          success: false,
          status: "d1_not_configured",
          message: "D1 binding DB poko configured."
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
          status: "credentials_missing",
          message:
            "MonCash credentials yo poko configured nan Cloudflare Secrets."
        },
        500,
        headers
      );
    }

    const orderId = createOrderId();

    try {
      await env.DB.prepare(`
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
      `)
        .bind(
          orderId,
          String(productId),
          productName ? String(productName) : null,
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
          status: "d1_order_create_failed",
          orderId,
          message:
            "Worker la pa kapab kreye order la nan D1.",
          error: error?.message || "D1 error"
        },
        500,
        headers
      );
    }

    try {
      const tokenData = await getMonCashToken(env);
      const accessToken = tokenData.access_token;

      const createPaymentUrl =
        "https://sandbox.moncashbutton.digicelgroup.com/Api/v1/CreatePayment";

      const paymentResponse = await fetch(
        createPaymentUrl,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount,
            orderId
          })
        }
      );

      const rawPayment = await paymentResponse.text();

      let paymentData;

      try {
        paymentData = JSON.parse(rawPayment);
      } catch {
        paymentData = {
          raw: rawPayment
        };
      }

      if (!paymentResponse.ok) {
        await updateOrderStatus(
          env,
          orderId,
          "failed",
          null
        );

        return jsonResponse(
          {
            success: false,
            status: "create_payment_failed",
            httpStatus: paymentResponse.status,
            orderId,
            message:
              "MonCash pa t kapab kreye payment la.",
            moncashResponse: paymentData
          },
          502,
          headers
        );
      }

      const paymentToken =
        paymentData?.payment_token?.token;

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
            status: "payment_token_missing",
            orderId,
            message:
              "MonCash reponn men pa gen payment token.",
            moncashResponse: paymentData
          },
          502,
          headers
        );
      }

      const gatewayUrl =
        "https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware/Payment/Redirect?token=" +
        encodeURIComponent(paymentToken);

      return jsonResponse(
        {
          success: true,
          status: "payment_created",
          provider: "MonCash Sandbox",
          orderId,

          product: {
            id: productId,
            name: productName,
            price: amount
          },

          payment: {
            method: "moncash",
            status: "created",
            paymentTokenCreated: true
          },

          redirectUrl: gatewayUrl,
          paymentUrl: gatewayUrl,

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
          status: "moncash_checkout_error",
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
  =======================================================
  GET /api/payment-status
  =======================================================
  */

  if (
    url.pathname === "/api/payment-status" &&
    request.method === "GET"
  ) {
    const transactionId =
      url.searchParams.get("transactionId");

    const orderId =
      url.searchParams.get("orderId");

    if (!transactionId && !orderId) {
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
          status: "d1_not_configured",
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
          status: "credentials_missing",
          message:
            "MonCash credentials yo poko configured."
        },
        500,
        headers
      );
    }

    try {
      let dbOrder = null;

      if (orderId) {
        dbOrder = await getOrderByOrderId(
          env,
          orderId
        );

        if (!dbOrder) {
          return jsonResponse(
            {
              success: false,
              status: "order_not_found",
              orderId,
              message:
                "Order sa a pa jwenn nan D1."
            },
            404,
            headers
          );
        }
      }

      const verification =
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
          verification.paid
            ? "paid"
            : "pending",
          verification.transactionId
        );
      }

      return jsonResponse(
        {
          success: true,
          status: verification.paid
            ? "paid"
            : "not_paid",
          paid: verification.paid,
          orderId: orderId || null,
          transactionId:
            verification.transactionId,
          payment: verification.payment,
          moncashResponse:
            verification.response,
          message: verification.paid
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


  /*
  =======================================================
  GET /api/product-info
  =======================================================
  */

  if (
    url.pathname === "/api/product-info" &&
    request.method === "GET"
  ) {
    const productId =
      url.searchParams.get("productId");

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
          status: "d1_not_configured",
          message:
            "D1 binding DB poko configured."
        },
        503,
        headers
      );
    }

    if (!hasBackblazeConfig(env)) {
      return jsonResponse(
        {
          success: false,
          status:
            "backblaze_not_configured",
          message:
            "Backblaze secrets yo poko configured."
        },
        503,
        headers
      );
    }

    const product =
      await getProductFile(
        env,
        productId
      );

    if (!product) {
      return jsonResponse(
        {
          success: false,
          status:
            "product_not_found",
          productId,
          message:
            "Product sa a poko anrejistre nan product_files."
        },
        404,
        headers
      );
    }

    try {
      const b2Info =
        await getBackblazeFileInfo(
          env,
          product.storage_key
        );

      await updateProductFileSize(
        env,
        productId,
        b2Info.size
      );

      const latestProduct =
        await getProductFile(
          env,
          productId
        );

      return jsonResponse(
        {
          success: true,
          productId:
            latestProduct.product_id,
          productType:
            latestProduct.product_type,
          fileSizeBytes:
            b2Info.size,
          fileSize:
            formatFileSize(
              b2Info.size
            ),
          downloadCount:
            Number(
              latestProduct.download_count || 0
            ),
          storage:
            "backblaze"
        },
        200,
        headers
      );

    } catch (error) {
      return jsonResponse(
        {
          success: false,
          status:
            "backblaze_file_info_error",
          productId,
          message:
            error?.message ||
            "Worker la pa kapab jwenn size fichye a nan Backblaze."
        },
        502,
        headers
      );
    }
  }


  /*
  =======================================================
  GET /api/download
  =======================================================
  */

  if (
    url.pathname === "/api/download" &&
    request.method === "GET"
  ) {
    const productId =
      url.searchParams.get("productId");

    const transactionId =
      url.searchParams.get(
        "transactionId"
      );

    const orderId =
      url.searchParams.get("orderId");

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
            "d1_not_configured",
          message:
            "D1 binding DB poko configured."
        },
        503,
        headers
      );
    }

    if (!hasBackblazeConfig(env)) {
      return jsonResponse(
        {
          success: false,
          status:
            "backblaze_not_configured",
          message:
            "Backblaze secrets yo poko configured."
        },
        503,
        headers
      );
    }

    const product =
      await getProductFile(
        env,
        productId
      );

    if (!product) {
      return jsonResponse(
        {
          success: false,
          status:
            "product_not_found",
          productId,
          message:
            "Product sa a pa jwenn nan product_files."
        },
        404,
        headers
      );
    }

    const productType =
      String(
        product.product_type || ""
      ).toLowerCase();

    const isPaid =
      productType.includes("paid");


    /*
    =====================================================
    PAID PRODUCT PROTECTION
    =====================================================
    */

    if (isPaid) {
      if (!orderId) {
        return jsonResponse(
          {
            success: false,
            status:
              "order_id_required",
            message:
              "Pou yon product peye, orderId obligatwa pou verifye payment ak product la."
          },
          403,
          headers
        );
      }

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
              "order_not_found",
            orderId,
            message:
              "Order sa a pa jwenn nan D1."
          },
          404,
          headers
        );
      }

      if (
        String(
          dbOrder.product_id
        ) !==
        String(productId)
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

      let verification;

      try {
        verification =
          await verifyMonCashPayment(
            env,
            {
              transactionId,
              orderId
            }
          );
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

      if (!verification.paid) {
        return jsonResponse(
          {
            success: false,
            status:
              "payment_not_verified",
            paid: false,
            productId,
            transactionId:
              verification.transactionId,
            orderId,
            message:
              "Payment la poko verifye kòm successful. Download la bloke."
          },
          403,
          headers
        );
      }

      await updateOrderStatus(
        env,
        orderId,
        "paid",
        verification.transactionId
      );

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
    =====================================================
    GET FILE FROM BACKBLAZE
    =====================================================
    */

    let fileResponse;
    let fileInfo;

    try {
      fileInfo =
        await getBackblazeFileInfo(
          env,
          product.storage_key
        );

      fileResponse =
        await downloadBackblazeFile(
          request,
          env,
          product.storage_key
        );

    } catch (error) {
      return jsonResponse(
        {
          success: false,
          status:
            "backblaze_download_error",
          productId,
          message:
            error?.message ||
            "Worker la pa kapab jwenn fichye a nan Backblaze."
        },
        502,
        headers
      );
    }

    if (!fileResponse.ok) {
      return jsonResponse(
        {
          success: false,
          status:
            "file_not_found",
          productId,
          httpStatus:
            fileResponse.status,
          message:
            "Fichye a pa jwenn nan Backblaze."
        },
        fileResponse.status === 404
          ? 404
          : 502,
        headers
      );
    }


    /*
    =====================================================
    UPDATE FILE SIZE
    =====================================================
    */

    await updateProductFileSize(
      env,
      productId,
      fileInfo.size
    );


    /*
    =====================================================
    DOWNLOAD COUNTER
    =====================================================
    */

    const hasRange =
      Boolean(
        request.headers.get("Range")
      );

    let finalDownloadCount =
      Number(
        product.download_count || 0
      );

    if (!hasRange) {
      finalDownloadCount =
        await incrementDownloadCount(
          env,
          productId
        );
    }


    /*
    =====================================================
    DOWNLOAD HEADERS
    =====================================================
    */

    const downloadHeaders =
      new Headers(headers);

    downloadHeaders.set(
      "Content-Type",
      fileResponse.headers.get(
        "Content-Type"
      ) ||
        "application/octet-stream"
    );

    const contentLength =
      fileResponse.headers.get(
        "Content-Length"
      );

    if (contentLength) {
      downloadHeaders.set(
        "Content-Length",
        contentLength
      );
    }

    const contentRange =
      fileResponse.headers.get(
        "Content-Range"
      );

    if (contentRange) {
      downloadHeaders.set(
        "Content-Range",
        contentRange
      );
    }

    downloadHeaders.set(
      "Accept-Ranges",
      "bytes"
    );

    downloadHeaders.set(
      "Content-Disposition",
      `attachment; filename="${safeDownloadFilename(
        product.storage_key
      )}"`
    );

    downloadHeaders.set(
      "Cache-Control",
      "private, no-store, max-age=0"
    );

    downloadHeaders.set(
      "X-Payment-Verified",
      isPaid
        ? "true"
        : "not_required"
    );

    downloadHeaders.set(
      "X-Download-Count",
      String(
        finalDownloadCount
      )
    );

    downloadHeaders.set(
      "X-File-Size",
      String(
        fileInfo.size
      )
    );

    return new Response(
      fileResponse.body,
      {
        status:
          fileResponse.status,
        statusText:
          fileResponse.statusText,
        headers:
          downloadHeaders
      }
    );
  }


  /*
  =======================================================
  API ROUTE NOT FOUND
  =======================================================
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
D1 — GET ORDER
=========================================================
*/

async function getOrderByOrderId(
  env,
  orderId
) {
  if (!env.DB) return null;

  const result =
    await env.DB.prepare(`
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
    `)
      .bind(orderId)
      .first();

  return result || null;
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
  if (!env.DB || !orderId) return;

  if (status === "paid") {
    await env.DB.prepare(`
      UPDATE orders
      SET
        payment_status = ?,
        transaction_id =
          COALESCE(?, transaction_id),
        paid_at =
          COALESCE(paid_at, ?)
      WHERE order_id = ?
    `)
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
    await env.DB.prepare(`
      UPDATE orders
      SET
        payment_status = ?
      WHERE order_id = ?
    `)
      .bind(
        "failed",
        orderId
      )
      .run();

    return;
  }

  await env.DB.prepare(`
    UPDATE orders
    SET
      payment_status = ?,
      transaction_id =
        COALESCE(?, transaction_id)
    WHERE order_id = ?
  `)
    .bind(
      status,
      transactionId || null,
      orderId
    )
    .run();
}


/*
=========================================================
D1 — PRODUCT FILE
=========================================================
*/

async function getProductFile(
  env,
  productId
) {
  if (!env.DB) return null;

  const result =
    await env.DB.prepare(`
      SELECT
        product_id,
        product_type,
        storage_key,
        file_size_bytes,
        download_count,
        created_at,
        updated_at
      FROM product_files
      WHERE product_id = ?
      LIMIT 1
    `)
      .bind(productId)
      .first();

  return result || null;
}


/*
=========================================================
D1 — UPDATE FILE SIZE
=========================================================
*/

async function updateProductFileSize(
  env,
  productId,
  size
) {
  if (!env.DB || !productId) return;

  const safeSize =
    Number.isFinite(Number(size))
      ? Math.max(
          0,
          Math.floor(Number(size))
        )
      : 0;

  await env.DB.prepare(`
    UPDATE product_files
    SET
      file_size_bytes = ?,
      updated_at = ?
    WHERE product_id = ?
  `)
    .bind(
      safeSize,
      new Date().toISOString(),
      productId
    )
    .run();
}


/*
=========================================================
D1 — INCREMENT DOWNLOAD COUNT
=========================================================
*/

async function incrementDownloadCount(
  env,
  productId
) {
  if (!env.DB || !productId) return 0;

  await env.DB.prepare(`
    UPDATE product_files
    SET
      download_count =
        COALESCE(download_count, 0) + 1,
      updated_at = ?
    WHERE product_id = ?
  `)
    .bind(
      new Date().toISOString(),
      productId
    )
    .run();

  const result =
    await env.DB.prepare(`
      SELECT
        download_count
      FROM product_files
      WHERE product_id = ?
      LIMIT 1
    `)
      .bind(productId)
      .first();

  return Number(
    result?.download_count || 0
  );
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

  const rawText =
    await response.text();

  let data;

  try {
    data =
      JSON.parse(rawText);
  } catch {
    data = {
      raw: rawText
    };
  }

  if (!response.ok) {
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
MONCASH PAYMENT VERIFICATION
=========================================================
*/

async function verifyMonCashPayment(
  env,
  {
    transactionId = null,
    orderId = null
  } = {}
) {
  if (!transactionId && !orderId) {
    throw new Error(
      "transactionId or orderId is required."
    );
  }

  const tokenData =
    await getMonCashToken(env);

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
      JSON.parse(rawVerify);
  } catch {
    verifyData = {
      raw: rawVerify
    };
  }

  const payment =
    verifyData?.payment ||
    null;

  const paymentMessage =
    String(
      payment?.message || ""
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
BACKBLAZE CONFIG
=========================================================
*/

function hasBackblazeConfig(
  env
) {
  return Boolean(
    env.B2_APPLICATION_KEY &&
    env.B2_BUCKET_NAME &&
    env.B2_KEY_ID
  );
}


/*
=========================================================
BACKBLAZE AUTHORIZATION
=========================================================
*/

let backblazeAuthCache = null;

async function getBackblazeAuth(
  env
) {
  if (!hasBackblazeConfig(env)) {
    const error =
      new Error(
        "Backblaze secrets yo poko configured."
      );

    error.code =
      "backblaze_credentials_missing";

    throw error;
  }

  if (
    backblazeAuthCache &&
    backblazeAuthCache.expiresAt >
      Date.now()
  ) {
    return backblazeAuthCache.data;
  }

  const basicCredentials =
    btoa(
      `${env.B2_KEY_ID}:${env.B2_APPLICATION_KEY}`
    );

  const authUrl =
    "https://api.backblazeb2.com/b2api/v4/b2_authorize_account";

  const response =
    await fetch(
      authUrl,
      {
        method: "GET",

        headers: {
          "Authorization":
            `Basic ${basicCredentials}`,

          "Accept":
            "application/json"
        }
      }
    );

  const rawText =
    await response.text();

  let data;

  try {
    data =
      JSON.parse(rawText);
  } catch {
    data = {
      raw: rawText
    };
  }

  if (!response.ok) {
    const error =
      new Error(
        data?.message ||
        "Backblaze authentication failed."
      );

    error.code =
      data?.code ||
      "backblaze_auth_failed";

    error.details =
      data;

    throw error;
  }

  const storageApi =
    data?.apiInfo?.storageApi ||
    data?.storageApi ||
    null;

  const downloadUrl =
    storageApi?.downloadUrl ||
    data?.downloadUrl ||
    null;

  const apiUrl =
    storageApi?.apiUrl ||
    data?.apiUrl ||
    null;

  const authorizationToken =
    data?.authorizationToken ||
    null;

  if (
    !downloadUrl ||
    !authorizationToken
  ) {
    const error =
      new Error(
        "Backblaze pa retounen authorizationToken oswa downloadUrl."
      );

    error.code =
      "backblaze_auth_response_invalid";

    error.details =
      data;

    throw error;
  }

  const authData = {
    accountId:
      data?.accountId ||
      null,

    authorizationToken,

    downloadUrl:
      String(
        downloadUrl
      ).replace(
        /\/$/,
        ""
      ),

    apiUrl:
      apiUrl
        ? String(
            apiUrl
          ).replace(
            /\/$/,
            ""
          )
        : null,

    allowed:
      data?.allowed ||
      null
  };

  backblazeAuthCache = {
    data: authData,

    expiresAt:
      Date.now() +
      20 *
      60 *
      60 *
      1000
  };

  return authData;
}


/*
=========================================================
BACKBLAZE FILE INFO
=========================================================
*/

async function getBackblazeFileInfo(
  env,
  storageKey
) {
  const key =
    sanitizeStorageKey(
      storageKey
    );

  if (!key) {
    throw new Error(
      "Invalid Backblaze storage key."
    );
  }

  const auth =
    await getBackblazeAuth(env);

  const fileUrl =
    buildBackblazeDownloadUrl(
      auth.downloadUrl,
      env.B2_BUCKET_NAME,
      key
    );

  const response =
    await fetch(
      fileUrl,
      {
        method: "HEAD",

        headers: {
          "Authorization":
            auth.authorizationToken
        }
      }
    );

  if (!response.ok) {
    const text =
      await response.text();

    const error =
      new Error(
        `Backblaze file info failed (${response.status}).`
      );

    error.code =
      "backblaze_file_info_failed";

    error.details =
      text;

    throw error;
  }

  const contentLength =
    Number(
      response.headers.get(
        "Content-Length"
      ) || 0
    );

  return {
    size:
      Number.isFinite(
        contentLength
      )
        ? contentLength
        : 0,

    contentType:
      response.headers.get(
        "Content-Type"
      ) ||
      "application/octet-stream",

    fileName:
      response.headers.get(
        "X-Bz-File-Name"
      ) ||
      key
  };
}


/*
=========================================================
BACKBLAZE DOWNLOAD
=========================================================
*/

async function downloadBackblazeFile(
  request,
  env,
  storageKey
) {
  const key =
    sanitizeStorageKey(
      storageKey
    );

  if (!key) {
    throw new Error(
      "Invalid Backblaze storage key."
    );
  }

  const auth =
    await getBackblazeAuth(env);

  const fileUrl =
    buildBackblazeDownloadUrl(
      auth.downloadUrl,
      env.B2_BUCKET_NAME,
      key
    );

  const downloadHeaders =
    new Headers();

  downloadHeaders.set(
    "Authorization",
    auth.authorizationToken
  );

  const range =
    request.headers.get(
      "Range"
    );

  if (range) {
    downloadHeaders.set(
      "Range",
      range
    );
  }

  return fetch(
    fileUrl,
    {
      method: "GET",
      headers:
        downloadHeaders
    }
  );
}


/*
=========================================================
BACKBLAZE DOWNLOAD URL
=========================================================
*/

function buildBackblazeDownloadUrl(
  downloadUrl,
  bucketName,
  storageKey
) {
  const bucket =
    encodeURIComponent(
      bucketName
    );

  const key =
    storageKey
      .split("/")
      .map(
        segment =>
          encodeURIComponent(
            segment
          )
      )
      .join("/");

  return `${downloadUrl}/file/${bucket}/${key}`;
}


/*
=========================================================
STORAGE KEY SANITIZE
=========================================================
*/

function sanitizeStorageKey(
  value
) {
  let key =
    String(
      value || ""
    ).trim();

  if (!key) return null;

  if (
    key.includes("..") ||
    key.includes("\\") ||
    key.startsWith("/")
  ) {
    return null;
  }

  if (
    /[\u0000-\u001F\u007F]/.test(
      key
    )
  ) {
    return null;
  }

  if (key.length > 1000) {
    return null;
  }

  return key;
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
    String(
      key || ""
    ).split("/");

  const filename =
    parts[
      parts.length - 1
    ] || "download";

  return filename
    .replace(
      /["\r\n\\]/g,
      "*"
    )
    .replace(
      /[\u0000-\u001F\u007F]/g,
      "*"
    );
}


/*
=========================================================
CREATE ORDER ID
=========================================================
*/

function createOrderId() {
  const random =
    crypto
      .randomUUID()
      .replaceAll("-", "")
      .slice(0, 12)
      .toUpperCase();

  return `WGD-${Date.now()}-${random}`;
}


/*
=========================================================
FORMAT FILE SIZE
=========================================================
*/

function formatFileSize(
  bytes
) {
  const size =
    Number(bytes);

  if (
    !Number.isFinite(size) ||
    size <= 0
  ) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB"
  ];

  const index =
    Math.min(
      Math.floor(
        Math.log(size) /
          Math.log(1024)
      ),
      units.length - 1
    );

  const value =
    size /
    Math.pow(
      1024,
      index
    );

  const decimals =
    index === 0
      ? 0
      : value >= 100
        ? 0
        : value >= 10
          ? 1
          : 2;

  return `${value.toFixed(
    decimals
  )} ${units[index]}`;
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
