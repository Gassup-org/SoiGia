import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Response {

      // ==========================================
      // 2xx SUCCESSFUL RESPONSES
      // ==========================================
      ok<T>(message?: string, data?: T): Response;
      created<T>(message?: string, data?: T): Response;
      accepted<T>(message?: string, data?: T): Response;
      noContent(): Response;

      // ==========================================
      // 3xx REDIRECTION MESSAGES
      // ==========================================
      /** 301 Moved Permanently - URL đã chuyển vĩnh viễn */
      movedPermanently(url: string): Response;
      /** 302 Found - Chuyển hướng tạm thời (Phổ biến nhất) */
      found(url: string): Response;
      /** 303 See Other - Chuyển hướng sau khi POST/PUT thành công (Chuyển phương thức về GET) */
      seeOther(url: string): Response;
      /** 304 Not Modified - Tài nguyên không đổi, báo Client dùng Cache (KHÔNG CÓ BODY) */
      notModified(): Response;
      /** 307 Temporary Redirect - Chuyển hướng tạm thời (Giữ nguyên HTTP Method, ví dụ POST -> POST) */
      temporaryRedirect(url: string): Response;
      /** 308 Permanent Redirect - Chuyển hướng vĩnh viễn (Giữ nguyên HTTP Method) */
      permanentRedirect(url: string): Response;

      // ==========================================
      // 4xx CLIENT ERROR RESPONSES
      // ==========================================
      /** 400 Bad Request - Cú pháp yêu cầu không hợp lệ / Thiếu field validation */
      badRequest<E = any>(message?: string, errors?: E): Response;
      /** 401 Unauthorized - Chưa xác thực (Chưa đăng nhập / Token hết hạn) */
      unauthorized(message?: string): Response;
      /** 402 Payment Required - Yêu cầu thanh toán (Hiếm dùng) */
      paymentRequired(message?: string): Response;
      /** 403 Forbidden - Đã xác thực nhưng không có quyền truy cập */
      forbidden(message?: string): Response;
      /** 404 Not Found - Không tìm thấy tài nguyên */
      notFound(message?: string): Response;
      /** 405 Method Not Allowed - Phương thức HTTP không được hỗ trợ cho Endpoint này */
      methodNotAllowed(message?: string): Response;
      /** 408 Request Timeout - Hết thời gian chờ yêu cầu từ client */
      requestTimeout(message?: string): Response;
      /** 409 Conflict - Xung đột dữ liệu (vd: Trùng Email, trùng Username) */
      conflict(message?: string): Response;
      /** 410 Gone - Tài nguyên đã bị xóa vĩnh viễn */
      gone(message?: string): Response;
      /** 415 Unsupported Media Type - Định dạng file upload/payload không đúng (vd: gửi XML thay vì JSON) */
      unsupportedMediaType(message?: string): Response;
      /** 422 Unprocessable Entity - Lỗi Validate dữ liệu đầu vào */
      unprocessableEntity<E = any>(message?: string, errors?: E): Response;
      /** 429 Too Many Requests - Vượt quá giới hạn lượt gọi API (Rate limiting) */
      tooManyRequests(message?: string): Response;

      // ==========================================
      // 5xx SERVER ERROR RESPONSES
      // ==========================================
      /** 500 Internal Server Error - Lỗi hệ thống/server không xác định */
      internalServerError<E = any>(message?: string, error?: E): Response;
      /** 501 Not Implemented - Server chưa hỗ trợ phương thức/chức năng này */
      notImplemented(message?: string): Response;
      /** 502 Bad Gateway - Server nhận phản hồi không hợp lệ từ Gateway/Upstream */
      badGateway(message?: string): Response;
      /** 503 Service Unavailable - Server bị quá tải hoặc đang bảo trì */
      serviceUnavailable(message?: string): Response;
      /** 504 Gateway Timeout - Gateway hết thời gian chờ phản hồi từ Upstream */
      gatewayTimeout(message?: string): Response;
    }
  }
}

export const responseHandler = (_req: Request, res: Response, next: NextFunction) => {
  // Helper đóng gói JSON response chuẩn
  const buildJson = (success: boolean, status: number, message: string, data?: unknown, errors?: unknown) => {
    return res.status(status).json({
      success,
      status,
      message,
      ...(data !== undefined && { data }),
      ...(errors !== undefined && { errors }),
      timestamp: new Date().toISOString()
    });
  };

  // 2xx SUCCESS
  res.ok = (message = 'Success', data) => buildJson(true, 200, message, data);
  res.created = (message = 'Created', data) => buildJson(true, 201, message, data);
  res.accepted = (message = 'Accepted', data) => buildJson(true, 202, message, data);
  res.noContent = () => res.status(204).send();

  // 3xx REDIRECT
  res.movedPermanently = (url) => {
    res.redirect(301, url);
    return res;
  };
  res.found = (url) => {
    res.redirect(302, url);
    return res;
  };
  res.seeOther = (url) => {
    res.redirect(303, url);
    return res;
  };
  res.notModified = () => res.status(304).send();
  res.temporaryRedirect = (url) => {
    res.redirect(307, url);
    return res;
  };
  res.permanentRedirect = (url) => {
    res.redirect(308, url);
    return res;
  };

  // 4xx CLIENT ERROR
  res.badRequest = (message = 'Bad Request', errors) => buildJson(false, 400, message, undefined, errors);
  res.unauthorized = (message = 'Unauthorized') => buildJson(false, 401, message);
  res.paymentRequired = (message = 'Payment Required') => buildJson(false, 402, message);
  res.forbidden = (message = 'Forbidden') => buildJson(false, 403, message);
  res.notFound = (message = 'Not Found') => buildJson(false, 404, message);
  res.methodNotAllowed = (message = 'Method Not Allowed') => buildJson(false, 405, message);
  res.requestTimeout = (message = 'Request Timeout') => buildJson(false, 408, message);
  res.conflict = (message = 'Conflict') => buildJson(false, 409, message);
  res.gone = (message = 'Resource Gone') => buildJson(false, 410, message);
  res.unsupportedMediaType = (message = 'Unsupported Media Type') => buildJson(false, 415, message);
  res.unprocessableEntity = (message = 'Unprocessable Entity', errors) => buildJson(false, 422, message, undefined, errors);
  res.tooManyRequests = (message = 'Too Many Requests') => buildJson(false, 429, message);

  // 5xx SERVER ERROR
  res.internalServerError = (message = 'Internal Server Error', error) => buildJson(false, 500, message, undefined, error);
  res.notImplemented = (message = 'Not Implemented') => buildJson(false, 501, message);
  res.badGateway = (message = 'Bad Gateway') => buildJson(false, 502, message);
  res.serviceUnavailable = (message = 'Service Unavailable') => buildJson(false, 503, message);
  res.gatewayTimeout = (message = 'Gateway Timeout') => buildJson(false, 504, message);

  next();
};
