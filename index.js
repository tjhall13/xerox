var util = require('util');

var constructors = { };

function Context(template) {
	this.properties = { };
	this.later = [];
}

function Template(test, func, method) {
	var context = new Context(this);
	var sequence = [];
	var index = 0;
	if(method == '@construct') {
		constructors[func] = validator;
	} else {
		func[method] = validator;
	}
	
	function validator() {
		if(index === 0) {
			sequence.push(context);
		}
		if(sequence.length) {
			context = sequence.shift();
		}
		index++;

		var inputs = Array.prototype.slice.call(arguments);
		var callback, i;
		if(context.cb && typeof inputs[inputs.length - 1] == 'function') {
			callback = inputs[inputs.length - 1];
			inputs.pop();
		}
		if(context.args) {
			for(i = 0; i < context.args.length; i++) {
				test(context.args[i], inputs[i]);
			}
		}
		if(context.err) {
			throw context.err;
		} else {
			for(var property in context.properties) {
				this[property] = context.properties[property];
			}
			if(context.cb && callback) {
				process.nextTick(function() {
					callback(context.cb.err, context.cb.val);
				});
			}
			for(i = 0; i < context.later.length; i++) {
				context.later[i].call();
			}
			if(context.val) {
				return context.val;
			}
		}
	}

	this.expects = function() {
		context.args = arguments;
		return this;
	};
	this.throws = function(error) {
		context.err = error;
		return this;
	};
	this.sets = function(property, value) {
		context.properties[property] = value;
		return this;
	};
	if(method != '@construct') {
		this.yields = function(value) {
			context.val = value;
			return this;
		};
		this.callback = function(error, value) {
			context.cb = { err: error, val: value };
			return this;
		};
	}
	this.calls = function(callback) {
		context.later.push(callback);
		return this;
	};
	this.then = function() {
		sequence.push(context);
		context = new Context();
		return this;
	};
}

function Copier(proto) {
	this._prototype = proto;
}

Copier.prototype.copy = function(test, method) {
	return new Template(test, this._prototype, method);
};

Copier.prototype.print = function(method, val, cb) {
	var template = new Template(null, this._prototype, method);
	if(cb) {
		template.callback(cb.err, cb.val);
	}
	if(val) {
		template.yields(val);
	}
	return template;
};

function Xerox(name) {
	var Document = function() {
		if(typeof constructors[name] == 'function') {
			constructors[name].apply(this, arguments);
		}
	};
	Xerox.documents[name] = Document;
	Copier.call(this, Document.prototype);
	this.copy = function(test, method) {
		if(method == '@construct') {
			return new Xerox.Template(test, name, method);
		} else {
			return new Xerox.Template(test, Document.prototype, method);
		}
	};
	this.document = function(doc) {
		return new Copier(doc);
	};
}
util.inherits(Xerox, Copier);

Xerox.documents = { };
Xerox.Template = Template;

module.exports = Xerox;
