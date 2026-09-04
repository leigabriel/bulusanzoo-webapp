const { Readable, Writable } = require('node:stream');

let app;
let schemaInitialization;

function getApp() {
  if (!app) app = require('./app');
  if (!schemaInitialization) {
    const ensureEventPaymentSchema = require('./database/ensure-event-payment-schema');
    const ensureAIAssistSchema = require('./database/ensure-ai-assist-schema');
    const ensureAuthSchema = require('./database/ensure-auth-schema');
    const ensureSiteVisitSchema = require('./database/ensure-site-visit-schema');
    schemaInitialization = Promise.all([
      ensureEventPaymentSchema(),
      ensureAIAssistSchema(),
      ensureAuthSchema(),
      ensureSiteVisitSchema()
    ]).catch((error) => console.error('Database schema initialization failed:', error.message));
  }
  return app;
}

class ExpressRequest extends Readable {
  constructor(request, body) {
    super();
    const url = new URL(request.url);
    this.method = request.method;
    this.url = `${url.pathname}${url.search}`;
    this.originalUrl = this.url;
    this.headers = Object.fromEntries(request.headers);
    this.rawHeaders = [...request.headers].flatMap(([key, value]) => [key, value]);
    this.httpVersion = '1.1';
    this.socket = { remoteAddress: this.headers['x-forwarded-for']?.split(',')[0]?.trim() || '127.0.0.1', encrypted: url.protocol === 'https:' };
    this.connection = this.socket;
    this._sourceBody = body;
    this._read = this._read.bind(this);
    this._destroy = (error, callback) => callback(error);
  }
  _read() {
    if (this._sourceBody) this.push(this._sourceBody);
    this._sourceBody = null;
    this.push(null);
  }
}

class ExpressResponse extends Writable {
  constructor(resolve, requestMethod) {
    super();
    this.statusCode = 200;
    this.statusMessage = '';
    this.headersSent = false;
    this._headers = new Map();
    this._chunks = [];
    this._resolve = resolve;
    this._requestMethod = requestMethod;
    this._write = this._write.bind(this);
    this.write = this.write.bind(this);
    this.end = this.end.bind(this);
    this.setHeader = this.setHeader.bind(this);
    this.getHeader = this.getHeader.bind(this);
    this.getHeaders = this.getHeaders.bind(this);
    this.hasHeader = this.hasHeader.bind(this);
    this.removeHeader = this.removeHeader.bind(this);
    this.writeHead = this.writeHead.bind(this);
    this.flushHeaders = this.flushHeaders.bind(this);
  }
  _write(chunk, encoding, callback) { this._chunks.push(Buffer.from(chunk)); callback(); }
  setHeader(name, value) { this._headers.set(name.toLowerCase(), value); return this; }
  getHeader(name) { return this._headers.get(name.toLowerCase()); }
  getHeaders() { return Object.fromEntries(this._headers); }
  hasHeader(name) { return this._headers.has(name.toLowerCase()); }
  removeHeader(name) { this._headers.delete(name.toLowerCase()); }
  writeHead(statusCode, statusMessage, headers) {
    this.statusCode = statusCode;
    if (typeof statusMessage === 'object') headers = statusMessage;
    else if (statusMessage) this.statusMessage = statusMessage;
    if (headers) Object.entries(headers).forEach(([name, value]) => this.setHeader(name, value));
    this.headersSent = true;
    return this;
  }
  flushHeaders() { this.headersSent = true; }
  end(chunk, encoding, callback) {
    if (chunk) this._chunks.push(Buffer.from(chunk, typeof encoding === 'string' ? encoding : undefined));
    const headers = new Headers();
    this._headers.forEach((value, key) => {
      if (Array.isArray(value)) value.forEach((item) => headers.append(key, String(item)));
      else if (value !== undefined) headers.set(key, String(value));
    });
    const hasBody = this._requestMethod !== 'HEAD' && ![204, 205, 304].includes(this.statusCode);
    this._resolve(new Response(hasBody ? Buffer.concat(this._chunks) : null, { status: this.statusCode, statusText: this.statusMessage || undefined, headers }));
    if (typeof encoding === 'function') encoding();
    else if (callback) callback();
    return this;
  }
}

async function handle(request) {
  const body = request.method === 'GET' || request.method === 'HEAD' ? null : Buffer.from(await request.arrayBuffer());
  return new Promise((resolve, reject) => {
    const req = new ExpressRequest(request, body);
    if (body && !req.headers['content-length']) req.headers['content-length'] = String(body.length);
    const res = new ExpressResponse(resolve, request.method);
    getApp().handle(req, res, reject);
  });
}

module.exports = { handle };
