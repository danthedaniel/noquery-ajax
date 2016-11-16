/*
 * ajax.js - A minimalistic replacement for jQuery's $.ajax
 * by teaearlgraycold, based on minAjax by flouthoc
 */

module.exports = {
  /**
   * Perform XHR with concise formatting for function parameters, copying the
   * style of jQuery's $.ajax.
   *
   * @param  {Object} config
   */
  ajax: function(config) {
    'use strict';

    /* Config Structure
    {
      url: string
      type: string [GET, POST, HEAD, DELETE, PATCH, PUT]
      async: bool
      data: object
      success: function
      error: function
      statusCode: object {code: function, ...}
    }
    */

    var configDefaults = {
      method: 'GET',
      async: true,
      dataType: 'json',
      statusCode: {}
    };

    function initXMLhttp() {
      if (window.XMLHttpRequest) {
        // IE7, firefox, chrome etc.
        return new XMLHttpRequest();
      } else {
        // IE6
        return new ActiveXObject('Microsoft.XMLHTTP');
      }
    }

    function mergeObject(targetObj, obj) {
      // Perform a shallow copy from obj to targetObj
      Object.keys(obj).forEach(function(key) {
        if (typeof targetObj[key] === 'undefined') {
          targetObj[key] = obj[key];
        }
      });
    }

    function serialize(obj, prefix) {
      var str = [];
      var prop;

      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          var key = prefix ? prefix + '[' + prop + ']' : prop;
          var val = obj[prop];

          if (val !== null && typeof val === 'object') {
            str.push(serialize(val, key));
          } else {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
          }
        }
      }

      return str.join('&');
    }

    // Apply defaults
    mergeObject(config, configDefaults);

    if (typeof config.url === 'undefined') {
      console.error('No url provided');
      return;
    }

    var xmlhttp = initXMLhttp();

    xmlhttp.onreadystatechange = function() {
      // If the request is finished
      if (xmlhttp.readyState == 4) {
        var response = xmlhttp.responseText;

        if (config.dataType === 'json') {
          try {
            response = JSON.parse(response);
          } catch (SyntaxError) {
            console.error('Server response is not valid json, although dataType was specified as json');
          }
        }

        // If the status is a success code
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
          if (config.success) {
            config.success(response, xmlhttp.readyState);
          }
        }
        // If the status is an error code
        else if (xmlhttp.status >= 400 && xmlhttp.status < 600) {
          if (config.error) {
            config.error(response, xmlhttp.readyState);
          }
        }

        // Try the statusCode object
        if (typeof config.statusCode[xmlhttp.status] !== 'undefined') {
          config.statusCode[xmlhttp.status](response, xmlhttp.readyState);
        }
      }
    };

    var encodedData = serialize(config.data);

    if (config.method === 'POST') {
      xmlhttp.open('POST', config.url, config.async);
      xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xmlhttp.send(encodedData);
    } else {
      var full_url = config.url + (encodedData === '' ? '' : '?' + encodedData);
      xmlhttp.open(config.method, full_url, config.async);
      xmlhttp.send();
    }
  }
};
