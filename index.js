/*
 * ajax.js - A minimalistic replacement for jQuery's $.ajax
 * by teaearlgraycold, based on minAjax by flouthoc
 */

var configDefaults = {
  url: window.location.pathname,
  method: 'GET',
  async: true,
  dataType: 'json',
  statusCode: {}
};

/**
 * Return an instantianted XHR object
 *
 * @returns  {XMLHttpRequest}
 */
function initXMLhttp() {
  if (window.XMLHttpRequest) {
    // IE7, firefox, chrome etc.
    return new XMLHttpRequest();
  } else {
    // IE6
    return new ActiveXObject('Microsoft.XMLHTTP');
  }
}

/**
 * Combine two JSON objects (shallowly), from 'obj' into 'targetObj'
 *
 * @param  {Object} targetObj
 * @param  {Object} obj
 */
function mergeObject(targetObj, obj) {
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof targetObj[prop] === 'undefined') {
        targetObj[prop] = obj[prop];
      }
    }
  };
}

/**
 * Serialize JSON as query parameters
 *
 * @param   {Object} obj
 * @param   {String} prefix
 * @returns {String}
 */
function serialize(obj, prefix) {
  var str = [];
  var prop;

  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      var key = prefix ? prefix + '[' + prop + ']' : prop;
      var val = obj[prop];

      if (val !== null && typeof val === 'object') {
        str.push(serialize(val, key));
      } else if (val !== null && typeof val !== 'undefined') {
        str.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
      }
    }
  }

  return str.join('&');
}

/**
 * Add HTTP headers to an xmlhttp object
 *
 * @param  {XMLHttpRequest} xmlhttp
 * @param  {Object} headers
 */
function addHeaders(xmlhttp, headers) {
  for (header_name in headers) {
    if (headers.hasOwnProperty(header_name)) {
      xmlhttp.setRequestHeader(header_name, headers[header_name]);
    }
  }
}

/**
 * Perform XHR with concise formatting for function parameters, copying the
 * style of jQuery's $.ajax.
 *
 * @param  {Object} config
 */
function ajax(config) {
  'use strict';

  config = config || {};

  /* Config Structure
  {
    url: string
    type: string [GET, POST, HEAD, DELETE, PATCH, PUT]
    async: bool
    data: object
    dataType: string
    headers: object
    success: function
    error: function
    statusCode: object {code: function, ...}
  }
  */

  // Apply defaults
  mergeObject(config, configDefaults);

  var xmlhttp = initXMLhttp();

  xmlhttp.onreadystatechange = function() {
    // If the request is finished
    if (xmlhttp.readyState == 4) {
      // If the status is a success code
      if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
        var response = xmlhttp.responseText;

        if (config.dataType === 'json') {
          try {
            response = JSON.parse(response);
          } catch (SyntaxError) {
            console.error('Server response is not valid json, although dataType was specified as json');
          }
        }

        if (config.success) {
          if (config.success.constructor == Array) {
            config.success.forEach(function(success_callback, i) {
              success_callback(response, xmlhttp.statusText, xmlhttp);
            });
          } else {
            config.success(response, xmlhttp.statusText, xmlhttp);
          }
        }

        // Try the statusCode object
        if (typeof config.statusCode[xmlhttp.status] !== 'undefined') {
          config.statusCode[xmlhttp.status](response, xmlhttp.statusText, xmlhttp);
        }
      }

      // If the status is an error code
      else if ((xmlhttp.status >= 400 && xmlhttp.status < 600) || xmlhttp.status == 0) {
        if (config.error) {
          if (config.error.constructor == Array) {
            config.error.forEach(function(error_callback, i) {
              error_callback(xmlhttp, xmlhttp.statusText);
            });
          } else {
            config.error(xmlhttp, xmlhttp.statusText);
          }
        }

        // Try the statusCode object
        if (typeof config.statusCode[xmlhttp.status] !== 'undefined') {
          config.statusCode[xmlhttp.status](xmlhttp, xmlhttp.statusText);
        }
      }
    }
  };

  var encodedData = serialize(config.data);

  if (config.method === 'POST') {
    xmlhttp.open('POST', config.url, config.async);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    if (typeof config.headers !== 'undefined') {
      addHeaders(xmlhttp, config.headers);
    }

    xmlhttp.send(encodedData);
  } else {
    var full_url = config.url + (encodedData === '' ? '' : '?' + encodedData);
    xmlhttp.open(config.method, full_url, config.async);

    if (typeof config.headers !== 'undefined') {
      addHeaders(xmlhttp, config.headers);
    }

    xmlhttp.send();
  }
}

module.exports = {
  serialize: serialize,
  mergeObject: mergeObject,
  ajax: ajax
};
