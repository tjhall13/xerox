var constructors = { };

function Context() {
	this.properties = { };
}

function Template(test, func, method) {
	var context = new Context();
	var sequence = [];
	var index = 0;
	if(method == '@construct') {
		constructors[func] = validator;
	} else {
		func.prototype[method] = validator;
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
		var callback;
		if(context.cb && typeof inputs[inputs.length - 1] == 'function') {
			callback = inputs[inputs.length - 1];
			inputs.pop();
		}
		if(context.args) {
			for(var i = 0; i < context.args.length; i++) {
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
			if(context.val) {
				return context.val;
			}
		}
	};

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
	this.then = function() {
		sequence.push(context);
		context = new Context();
		return this;
	};
}

function Xerox(name) {
	var Document = function() {
		if(typeof constructors[name] == 'function') {
			constructors[name].apply(this, arguments);
		}
	};
	this.print = function() {
		var output = Object.create(Document.prototype);
		Document.apply(output, arguments);
		return output;
	};
	this.copy = function(test, method) {
		if(method == '@construct') {
			return new Template(test, name, method);
		} else {
			return new Template(test, Document, method);
		}
	};
	Xerox.documents[name] = Document;
}
Xerox.documents = { };

module.exports = Xerox;
