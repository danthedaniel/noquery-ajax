/**
 * A minimalistic replacement for jQuery's $.ajax.
 */
declare module "noquery-ajax" {
  type Callback = Success | Error;
  type Success = (data: any, statusText: string, xhr: XMLHttpRequest) => void;
  type Error = (xhr: XMLHttpRequest, statusText: string) => void;

  interface AjaxOptions {
    /**
     * Address to connect to.
     */
    url?: string,

    /**
     * HTTP method to use.
     */
    method?: string,

    /**
     * Request body or query parameters.
     */
    data?: object,

    /**
     * When `"json"` this automatically decodes all returned data as JSON.
     */
    dataType?: string,

    /**
     * HTTP request headers.
     */
    headers?: { [name: string]: string },

    /**
     * Whether to use cookies with cross-origin requests.
     */
    withCredentials?: boolean,

    /**
     * Whether to perform the request asynchronously.
     */
    async?: boolean,

    /**
     * Mapping from status codes to callback functions.
     */
    statusCode?: { [code: number]: Callback },

    /**
     * Function or functions invoked for a 2XX HTTP code.
     */
    success?: Success | Success[],

    /**
     * Function or functions invoked for a 4XX-5XX HTTP code.
     */
    error?: Error | Error[]
  }

  /**
   * Perform an XHR request.
   *
   * @param config Options object.
   */
  export const ajax: (config: AjaxOptions) => void;

  /**
   * Combine two objects.
   *
   * @param target The target object.
   * @param obj    The source object. Takes precedence.
   */
  export const mergeObject: <T, U>(target: T, src: U) => T & U;

  /**
   * Using `encodeURIComponent`, encode an object as a string.
   *
   * @param obj Object to serialize.
   */
  export const serialize: (obj: object) => string;
}
