var Xerox = require('../index.js');

var mock;

function validator(test, expected) {
	var i = 0;
	return function(a, b) {
		var equal = a == b;
		test.ok(equal === expected[i], i + ': ' + a + ' == ' + b);
		i++;
	};
}

module.exports = {
	setUp: function(done) {
		mock = new Xerox('Test');
		done();
	},
	copy: {
		member: {
			expects: function(test) {
				test.expect(6);
				var func = mock.copy(validator(test, [true, true, true, false, true, false]), 'func');
				func.expects(1, 2, 3);

				var obj = new Xerox.documents.Test();
				obj.func(1, 2, 3);
				obj.func(3, 2, 1);
				test.done();
			},
			throws: function(test) {
				test.expect(1);
				var func = mock.copy(null, 'func');
				var err = new Error('test');
				func.throws(err);

				var obj = new Xerox.documents.Test();
				try {
					obj.func();
				} catch(e) {
					test.equal(err, e);
				}
				test.done();
			},
			sets: function(test) {
				test.expect(2);
				var func = mock.copy(null, 'func');
				func.sets('val', 1);

				var obj = new Xerox.documents.Test();
				test.equal(null, obj.val);
				obj.func();
				test.equal(1, obj.val);
				test.done();
			},
			yields: function(test) {
				test.expect(1);
				var func = mock.copy(null, 'func');
				func.yields(10);

				var obj = new Xerox.documents.Test();
				var val = obj.func();
				test.equal(10, val);
				test.done();
			},
			callback: function(test) {
				test.expect(2);
				var func = mock.copy(null, 'func');
				func.callback(null, 10);

				var obj = new Xerox.documents.Test();
				obj.func(function(err, val) {
					test.equal(null, err);
					test.equal(10, val);
					test.done();
				});
			},
			calls: function(test) {
				test.expect(1);
				var func = mock.copy(null, 'func');
				func.calls(function() {
					test.ok(true);
				});

				var obj = new Xerox.documents.Test();
				obj.func();
				test.done();
			},
			then: function(test) {
				test.expect(2);
				var func = mock.copy(null, 'func');
				func.yields(1)
					.then()
					.yields(2);

				var obj = new Xerox.documents.Test();
				test.equal(1, obj.func());
				test.equal(2, obj.func());
				test.done();
			}
		},
		constructor: function(test) {
			test.expect(3);
			var func = mock.copy(validator(test, [true, true, false]), '@construct');
			func.expects(1, 2, 3);

			var obj = new Xerox.documents.Test(1, 2, 4);
			test.done();
		}
	},
	print: function(test) {
		test.expect(4);
		var func = mock.print('func', 10, { err: null, val: 20 });

		test.ok(func instanceof Xerox.Template);
		var obj = new Xerox.documents.Test();
		var val = obj.func(function(err, val) {
			test.equal(null, err);
			test.equal(20, val);
			test.done();
		});
		test.equal(10, val);
	},
	document: {
		print: function(test) {
			test.expect(2);
			var obj;

			obj = new Xerox.documents.Test();
			mock.print('func', 10);

			mock.document(obj).print('func', 20);

			test.equal(obj.func(), 20);
			obj = new Xerox.documents.Test();
			test.equal(obj.func(), 10);
			test.done();
		},
		copy: function(test) {
			test.expect(2);
			var obj;

			obj = new Xerox.documents.Test();
			mock.copy(validator(test, [true]), 'func')
				.expects(10);

			mock.document(obj)
				.copy(validator(test, [true]), 'func')
				.expects(20);

			obj.func(20);
			obj = new Xerox.documents.Test();
			obj.func(10);
			test.done();
		}
	}
};
