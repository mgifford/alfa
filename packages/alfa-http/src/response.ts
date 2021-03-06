import { Decoder, Encoder } from "@siteimprove/alfa-encoding";
import * as earl from "@siteimprove/alfa-earl";
import * as json from "@siteimprove/alfa-json";

import { Body } from "./body";
import { Headers } from "./headers";

/**
 * @see https://fetch.spec.whatwg.org/#response-class
 */
export class Response implements Body, json.Serializable, earl.Serializable {
  public static of(
    url: string,
    status: number,
    headers: Headers = Headers.empty(),
    body: ArrayBuffer = new ArrayBuffer(0)
  ): Response {
    return new Response(url, status, headers, body);
  }

  public static empty(): Response {
    return Response.of("about:blank", 200);
  }

  private readonly _url: string;
  private readonly _status: number;
  private readonly _headers: Headers;
  private readonly _body: ArrayBuffer;

  private constructor(
    url: string,
    status: number,
    headers: Headers,
    body: ArrayBuffer
  ) {
    this._url = url;
    this._status = status;
    this._headers = headers;
    this._body = body;
  }

  /**
   * @see https://fetch.spec.whatwg.org/#dom-response-url
   */
  public get url(): string {
    return this._url;
  }

  /**
   * @see https://fetch.spec.whatwg.org/#dom-response-status
   */
  public get status(): number {
    return this._status;
  }

  /**
   * @see https://fetch.spec.whatwg.org/#dom-response-headers
   */
  public get headers(): Headers {
    return this._headers;
  }

  /**
   * @see https://fetch.spec.whatwg.org/#dom-body-body
   */
  public get body(): ArrayBuffer {
    return this._body;
  }

  public toJSON(): Response.JSON {
    return {
      url: this._url,
      status: this._status,
      headers: this._headers.toJSON(),
      body: Decoder.decode(new Uint8Array(this._body)),
    };
  }

  public toEARL(): Response.EARL {
    return {
      "@context": {
        http: "http://www.w3.org/2011/http#",
      },
      "@type": ["http:Message", "http:Response"],
      "http:statusCodeValue": this._status,
      "http:headers": this._headers.toEARL(),
      "http:body": {
        "@context": {
          cnt: "http://www.w3.org/2011/content#",
        },
        "@type": ["cnt:Content", "cnt:ContentAsText"],
        "cnt:characterEncoding": "utf-8",
        "cnt:chars": Decoder.decode(new Uint8Array(this._body)),
      },
    };
  }
}

export namespace Response {
  export interface JSON {
    [key: string]: json.JSON;
    url: string;
    status: number;
    headers: Headers.JSON;
    body: string;
  }

  export interface EARL extends earl.EARL {
    "@context": {
      http: "http://www.w3.org/2011/http#";
    };
    "@type": ["http:Message", "http:Response"];
    "http:statusCodeValue": number;
    "http:headers": Headers.EARL;
    "http:body": Body.EARL;
  }

  export function from(json: JSON): Response {
    return Response.of(
      json.url,
      json.status,
      Headers.from(json.headers),
      Encoder.encode(json.body)
    );
  }

  export function isResponse(value: unknown): value is Response {
    return value instanceof Response;
  }
}
