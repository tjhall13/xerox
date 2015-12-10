# Xerox
Xerox is a unit testing mock framework.
## Usage
Xerox is best used with a dependency manager like proxyquire.
To use, simply include in your test file and create a mocked class.
```javascript
// mymock.js
var Xerox = require('xerox');

var mock = new Xerox('MyMock');

module.exports = {
	mock: function(test, method) {
		return mock.copy(test, method);
	},
	proxy: new Xerox.documents.MyMock
};
```

Then use proxyquire to inject `MyMock` as a dependency in your test file.
```javascript
// mytest.js
var proxyquire = require('proxyquire');
var mymock = require('./mymock.js');

var mymodule = proxyquire('./mymodule.js', {
	dependency: mymock.proxy
});
...
```

Then use `mymock.mock` function to mock a specific function exported by the mocked module.
```javascript
...
function test(expected, actual, message) {
	...
}
var myfunc = mymock.mock(test, 'myfunc');

myfunc.expects(1, 'two').yields('3');
mymodule.run(1, 'two');
```

Where the module under test may look like the following:
```javascript
// mymodule.js
var Adder = require('dependency');

var adder = new Adder();

module.exports = {
	run: function(a, b) {
		var value = adder.myfunc(a, b);
		console.log(value);
	}
};
```

## Documentation
### `Xerox`
Class that manages a mock document.

#### `Xerox`
Xerox `Document` constructor.

**Parameters:**
* `name` <`String`>: Name of the class to mock.

#### `Xerox#copy(test, method)`
Creates new template to mock on the provided `Document` with a given name.

**Parameters:**
* `test` <`Function`, `null`>: callback function to test values.
  * `expected`: expected value
  * `actual`: actual value
  * `msg`: optional message to provide
* `method` <`String`>: method name to be added to the prototype.
  * If method is `'@construct'` then the constructor for this class is mocked.

**Returns:**
* <`Template`>: Template to set mock parameters.

### `Template`
Instances of Template are returned by `Xerox#copy`.

#### `Template#expects([arg1, [arg2... [argN]]])`
Sets the arguments the next invocation of the method will expect.

**Parameters:**
* `arg`: Value to expect in next invocation. Will be used with `test`.

**Returns:**
* <`Template`>: Template it was invoked on to allow chaining.

#### `Template#throws(err)`
Sets err that the next invocation will throw after parameters have been verified.

**Parameters:**
* `err`: The error to be thrown.

**Returns:**
* <`Template`>: Template it was invoked on to allow chaining.

#### `Template#sets(property, value)`
Sets a property with the given name and value to the object this object was invoked on.

**Parameters:**
* `property`: The property name to be set.
* `value`: The value for the property to be set.

**Returns:**
* <`Template`>: Template it was invoked on to allow chaining.

#### `Template#yields(value)`
Sets value that will be returned from next invocation.

**Parameters:**
* `value`: The value to be returned.

**Returns:**
* <`Template`>: Template it was invoked on to allow chaining.

#### `Template#callback(err, value)`
Sets callback parameters that will be called from next invocation.  If the last parameter of the mocked function is a function then it is used as a callback with the given parameters.

**Parameters:**
* `err`: The error parameter to be used with the next callback.
* `value`: The value to be used with the callback.

**Returns:**
* <`Template`>: Template it was invoked on to allow chaining.

#### `Template#then()`
Returns a new instance of the invocation to test. This instance will be used on the invocation after the previous instance.

**Returns:**
* <`Template`>: A new template to modify. Allows chaining.

## License
MIT
