# noquery-ajax
A minimalistic Javascript library meant to be a replacement for jQuery's $.ajax

noquery-ajax does not support all of the features of jQuery's ajax functionality,
but it should handle enough so that most sites can simply perform a global
replace of `$.ajax` for `ajax`.

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
* `data` - string or object, the POST data/url parameters
* `dataType` - string, when set to json, ajax() will automatically parse the response as json **(defaults to 'json')**
* `success` - function or array of functions, a callback that is invoked when the response code is 2XX
* `error` - function or array of functions, a callback that is invoked when the response code is 4XX-5XX or 0
* `statusCode` - object, relates status codes to callbacks
* `async` - boolean, whether the XHR is executed asynchronously **(defaults to true)**

Notes:

* If a success callback is provided, as well as a statusCode callback for code
200, both callbacks will be executed
* No callbacks will be executed if the server does not respond (due to a network error or otherwise)

##### Usage:

```js
ajax({
  url: "/api/my_endpoint.json",
  method: "GET",
  data: {
    foo: "bar"
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
