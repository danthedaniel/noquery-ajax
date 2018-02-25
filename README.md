# noquery-ajax

[![npm version](https://badge.fury.io/js/noquery-ajax.svg)](https://badge.fury.io/js/noquery-ajax)

A minimalistic Javascript library meant to be a replacement for jQuery's $.ajax.

noquery-ajax does not support all of the features of jQuery's ajax functionality,
but it should handle enough so that most sites can simply perform a global
replace of `$.ajax` for `ajax`. It's less than 2KB when minified, and less than 1KB
when minified and gzipped (888 Bytes as of v0.3.0).

##### Installation

    npm install noquery-ajax --save

##### Importing into a Project

ES6:

```javascript
import {ajax} from 'noquery-ajax';
```

Or with a require statement:

```javascript
var ajax = require('noquery-ajax').ajax;
```

##### Parameters

Parameters are passed to ajax() as a single object. The valid keys for ajax are
detailed below.

* `url` - string, the target of the AJAX request **(defaults to current page)**
* `method` - string, the HTTP request method **(defaults to 'GET')**
* `data` - string or object, the POST data/url parameters. Will be encoded as `application/x-www-form-urlencoded`.
* `dataType` - string, when set to json, ajax() will automatically parse the response as json **(defaults to 'json')**
* `headers` - object, relates header names to header values
* `success` - function or array of functions, a callback that is invoked when the response code is 2XX
* `error` - function or array of functions, a callback that is invoked when the response code is 4XX-5XX or 0
* `statusCode` - object, relates status codes to callbacks
* `async` - boolean, whether the XHR is executed asynchronously **(defaults to true)**

Notes:

* If a success callback is provided, as well as a statusCode callback for code
200, both callbacks will be executed

##### Usage:

```js
ajax({
  url: "/api/my_endpoint.json",
  method: "GET",
  data: {
    foo: "bar"
  },
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  success: function(data, statusText, xhr) {
    alert(data);
  },
  error: function(xhr, statusText) {
    console.error("Error occurred");
  },
  statusCode: {
    422: function() {
      console.log('Invalid entity!');
    }
  }
});
```
