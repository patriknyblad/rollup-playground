(function () {
	'use strict';

	var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
	function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }


	var babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};

	babelHelpers.classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	babelHelpers.createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	babelHelpers.defineProperty = function (obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

	babelHelpers.inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	babelHelpers.possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	babelHelpers.toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	babelHelpers;

	var ATTR_PREFIX = '__preactattr_';
	var HAS_DOM = typeof document !== 'undefined';
	var EMPTY = {};
	var NO_RENDER = { render: false };
	var SYNC_RENDER = { renderSync: true };
	var DOM_RENDER = { build: true };
	var EMPTY_BASE = '';
	var TEXT_CONTENT = !HAS_DOM || 'textContent' in document ? 'textContent' : 'nodeValue';
	var NON_DIMENSION_PROPS = {
		boxFlex: 1, boxFlexGroup: 1, columnCount: 1, fillOpacity: 1, flex: 1, flexGrow: 1,
		flexPositive: 1, flexShrink: 1, flexNegative: 1, fontWeight: 1, lineClamp: 1, lineHeight: 1,
		opacity: 1, order: 1, orphans: 1, strokeOpacity: 1, widows: 1, zIndex: 1, zoom: 1
	};

	var toArray = function toArray(obj) {
		var arr = [];
		for (var i = obj.length; i--;) {
			arr[i] = obj[i];
		}return arr;
	};

	var hop = Object.prototype.hasOwnProperty;

	/** Create a caching wrapper for the given function.
	 *	@private
	 */
	var memoize = function memoize(fn) {
		var mem = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		return function (k) {
			return hop.call(mem, k) ? mem[k] : mem[k] = fn(k);
		};
	};

	/** Get a deep property value from the given object, expressed in dot-notation.
	 *	@private
	 */
	var delve = function delve(obj, key) {
		return key.split('.').map(function (p) {
			return obj = obj && obj[p];
		}), obj;
	};

	/** Global options
	 *	@public
	 *	@namespace {Object}
	 */
	var options = {
		/** If `true`, `prop` changes trigger synchronous component updates.
	  *	@boolean
	  */
		syncComponentUpdates: true
	};

	/** Global hook methods
	 *	@public
	 *	@namespace {Object}
	 */
	var hooks = {

		/** Processes all created VNodes.
	  *	@param {VNode} vnode	A newly-created VNode to normalize/process
	  *	@protected
	  */

		vnode: function vnode(_ref) {
			var attributes = _ref.attributes;

			if (!attributes) return;

			var s = attributes.style;
			if (s && !s.substring) {
				attributes.style = styleObjToCss(s);
			}

			var c = attributes['class'];
			if (hop.call(attributes, 'className')) {
				c = attributes['class'] = attributes.className;
				delete attributes.className;
			}
			if (c && !c.substring) {
				attributes['class'] = hashToClassName(c);
			}
		}
	};

	/** Base Component class, for he ES6 Class method of creating Components
	 *	@public
	 *
	 *	@example
	 *	class MyFoo extends Component {
	 *		render(props, state) {
	 *			return <div />;
	 *		}
	 *	}
	 */
	var Component = function () {
		function Component() {
			babelHelpers.classCallCheck(this, Component);

			/** @private */
			this._dirty = this._disableRendering = false;
			/** @private */
			this._linkedStates = {};
			/** @public */
			this.nextProps = this.base = null;
			/** @type {object} */
			this.props = hook(this, 'getDefaultProps') || {};
			/** @type {object} */
			this.state = hook(this, 'getInitialState') || {};
			// @TODO remove me?
			hook(this, 'initialize');
		}

		/** Returns a `boolean` value indicating if the component should re-render when receiving the given `props` and `state`.
	  *	@param {object} props
	  *	@param {object} state
	  */
		// shouldComponentUpdate() {
		// 	return true;
		// }

		/** Returns a function that sets a state property when called.
	  *	Calling linkState() repeatedly with the same arguments returns a cached link function.
	  *
	  *	Provides some built-in special cases:
	  *		- Checkboxes and radio buttons link their boolean `checked` value
	  *		- Inputs automatically link their `value` property
	  *		- Event paths fall back to any associated Component if not found on an element
	  *		- If linked value is a function, will invoke it and use the result
	  *
	  *	@param {string} key				The path to set - can be a dot-notated deep key
	  *	@param {string} [eventPath]		If set, attempts to find the new state value at a given dot-notated path within the object passed to the linkedState setter.
	  *	@returns {function} linkStateSetter(e)
	  *
	  *	@example Update a "text" state value when an input changes:
	  *		<input onChange={ this.linkState('text') } />
	  *
	  *	@example Set a deep state value on click
	  *		<button onClick={ this.linkState('touch.coords', 'touches.0') }>Tap</button
	  */


		babelHelpers.createClass(Component, [{
			key: 'linkState',
			value: function linkState(key, eventPath) {
				var c = this._linkedStates,
				    cacheKey = key + '|' + (eventPath || '');
				return c[cacheKey] || (c[cacheKey] = createLinkedState(this, key, eventPath));
			}

			/** Update component state by copying properties from `state` to `this.state`.
	   *	@param {object} state		A hash of state properties to update with new values
	   */

		}, {
			key: 'setState',
			value: function setState(state) {
				extend(this.state, state);
				triggerComponentRender(this);
			}

			/** @private */

		}, {
			key: 'setProps',
			value: function setProps(props, opts) {
				return setComponentProps(this, props, opts);
			}

			/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
	   *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
	   *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
	   *	@param {object} state		The component's current state
	   *	@returns VNode
	   */

		}, {
			key: 'render',
			value: function render(props) {
				return h('div', null, props.children);
			}
		}]);
		return Component;
	}();

	/** Virtual DOM Node */
	var VNode = function VNode(nodeName, attributes, children) {
		babelHelpers.classCallCheck(this, VNode);

		/** @type {string|function} */
		this.nodeName = nodeName;

		/** @type {object<string>|undefined} */
		this.attributes = attributes;

		/** @type {array<VNode>|undefined} */
		this.children = children;
	};
	VNode.prototype.__isVNode = true;

	/** Render JSX into a `parent` Element.
	 *	@param {VNode} vnode		A (JSX) VNode to render
	 *	@param {Element} parent		DOM element to render into
	 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
	 *	@public
	 *
	 *	@example
	 *	// render a div into <body>:
	 *	render(<div id="hello">hello!</div>, document.body);
	 *
	 *	@example
	 *	// render a "Thing" component into #foo:
	 *	const Thing = ({ name }) => <span>{ name }</span>;
	 *	render(<Thing name="one" />, document.querySelector('#foo'));
	 */
	function render(vnode, parent, merge) {
		var existing = merge && merge._component && merge._componentConstructor === vnode.nodeName,
		    built = build(merge, vnode),
		    c = !existing && built._component;
		if (c) deepHook(c, 'componentWillMount');
		if (built.parentNode !== parent) {
			parent.appendChild(built);
		}
		if (c) deepHook(c, 'componentDidMount');
		return built;
	}

	/** @public JSX/hyperscript reviver
	 *	@see http://jasonformat.com/wtf-is-jsx
	 *  @example
	 *  /** @jsx h *\/
	 *  import { render, h } from 'preact';
	 *  render(<span>foo</span>, document.body);
	 */
	function h(nodeName, attributes) {
		for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			args[_key - 2] = arguments[_key];
		}

		var children = void 0,
		    sharedArr = [],
		    len = args.length,
		    arr = void 0,
		    lastSimple = void 0;
		if (len) {
			children = [];
			for (var i = 0; i < len; i++) {
				var _p = args[i];
				if (empty(_p)) continue;
				if (_p.join) {
					arr = _p;
				} else {
					arr = sharedArr;
					arr[0] = _p;
				}
				for (var j = 0; j < arr.length; j++) {
					var child = arr[j],
					    simple = !empty(child) && !isVNode(child);
					if (simple) child = String(child);
					if (simple && lastSimple) {
						children[children.length - 1] += child;
					} else if (!empty(child)) {
						children.push(child);
					}
					lastSimple = simple;
				}
			}
		}

		if (attributes && attributes.children) {
			delete attributes.children;
		}

		var p = new VNode(nodeName, attributes || undefined, children || undefined);
		hook(hooks, 'vnode', p);
		return p;
	}

	/** Invoke a "hook" method with arguments if it exists.
	 *	@private
	 */
	function hook(obj, name) {
		var fn = obj[name];

		for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
			args[_key2 - 2] = arguments[_key2];
		}

		if (fn && typeof fn === 'function') return fn.apply(obj, args);
	}

	/** Invoke hook() on a component and child components (recursively)
	 *	@private
	 */
	function deepHook(obj) {
		for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
			args[_key3 - 1] = arguments[_key3];
		}

		do {
			hook.apply(undefined, [obj].concat(args));
		} while (obj = obj._component);
	}

	/** Fast check if an object is a VNode.
	 *	@private
	 */
	function isVNode(obj) {
		return obj && obj.__isVNode === true;
	}

	/** Check if a value is `null` or `undefined`.
	 *	@private
	 */
	function empty(x) {
		return x === null || x === undefined;
	}

	/** Check if two nodes are equivalent.
	 *	@param {Element} node
	 *	@param {VNode} vnode
	 *	@private
	 */
	function isSameNodeType(node, vnode) {
		if (node.nodeType === 3) {
			return typeof vnode === 'string';
		}
		if (isFunctionalComponent(vnode)) return true;
		var nodeName = vnode.nodeName;
		if (typeof nodeName === 'function') return node._componentConstructor === nodeName;
		return node.nodeName.toLowerCase() === nodeName;
	}

	/** Check if a VNode is a reference to a stateless functional component.
	 *	A function component is represented as a VNode whose `nodeName` property is a reference to a function.
	 *	If that function is not a Component (ie, has no `.render()` method on a prototype), it is considered a stateless functional component.
	 *	@param {VNode} vnode	A VNode
	 *	@private
	 */
	function isFunctionalComponent(_ref2) {
		var nodeName = _ref2.nodeName;

		return typeof nodeName === 'function' && !nodeName.prototype.render;
	}

	/** Construct a resultant VNode from a VNode referencing a stateless functional component.
	 *	@param {VNode} vnode	A VNode with a `nodeName` property that is a reference to a function.
	 *	@private
	 */
	function buildFunctionalComponent(vnode) {
		return vnode.nodeName(getNodeProps(vnode)) || EMPTY_BASE;
	}

	/** Mark component as dirty and queue up a render.
	 *	@param {Component} component
	 *	@private
	 */
	function triggerComponentRender(component) {
		if (!component._dirty) {
			component._dirty = true;
			renderQueue.add(component);
		}
	}

	/** Set a component's `props` (generally derived from JSX attributes).
	*	@param {Object} props
	*	@param {Object} [opts]
	*	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
	*	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
	 */
	function setComponentProps(component, props) {
		var opts = arguments.length <= 2 || arguments[2] === undefined ? EMPTY : arguments[2];

		var d = component._disableRendering;
		component._disableRendering = true;
		hook(component, 'componentWillReceiveProps', props, component.props);
		component.nextProps = props;
		component._disableRendering = d;
		if (opts.render !== false) {
			if (opts.renderSync || options.syncComponentUpdates) {
				renderComponent(component);
			} else {
				triggerComponentRender(component);
			}
		}
	}

	/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
	 *	@param {Component} component
	 *	@param {Object} [opts]
	 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
	 *	@private
	 */
	function renderComponent(component, opts) {
		if (component._disableRendering) return;

		component._dirty = false;

		var p = component.nextProps,
		    s = component.state;

		if (component.base) {
			if (hook(component, 'shouldComponentUpdate', p, s) === false) {
				component.props = p;
				return;
			}

			hook(component, 'componentWillUpdate', p, s);
		}

		component.props = p;

		var rendered = hook(component, 'render', p, s),
		    childComponent = rendered && rendered.nodeName,
		    base = void 0;

		if (typeof childComponent === 'function' && childComponent.prototype.render) {
			// set up high order component link

			var inst = component._component;
			if (inst && inst.constructor !== childComponent) {
				unmountComponent(inst.base, inst, false);
				inst = null;
			}

			var childProps = getNodeProps(rendered);

			if (inst) {
				setComponentProps(inst, childProps, SYNC_RENDER);
			} else {
				inst = componentRecycler.create(childComponent, childProps);
				inst._parentComponent = component;
				component._component = inst;
				if (component.base) deepHook(inst, 'componentWillMount');
				setComponentProps(inst, childProps, NO_RENDER);
				renderComponent(inst, DOM_RENDER);
				if (component.base) deepHook(inst, 'componentDidMount');
			}

			base = inst.base;
		} else {
			// destroy high order component link
			if (component._component) {
				unmountComponent(component.base, component._component);
			}
			component._component = null;

			if (component.base || opts && opts.build) {
				base = build(component.base, rendered || EMPTY_BASE, component);
			}
		}

		if (component.base && base !== component.base) {
			var _p2 = component.base.parentNode;
			if (_p2) _p2.replaceChild(base, component.base);
		}

		component.base = base;
		if (base) {
			base._component = component;
			base._componentConstructor = component.constructor;
		}

		hook(component, 'componentDidUpdate', p, s);

		return rendered;
	}

	/** Apply the Component referenced by a VNode to the DOM.
	 *	@param {Element} dom	The DOM node to mutate
	 *	@param {VNode} vnode	A Component-referencing VNode
	 *	@returns {Element} dom	The created/mutated element
	 *	@private
	 */
	function buildComponentFromVNode(dom, vnode) {
		var c = dom && dom._component;

		if (isFunctionalComponent(vnode)) {
			var p = build(dom, buildFunctionalComponent(vnode));
			p._componentConstructor = vnode.nodeName;
			return p;
		}

		var isOwner = c && dom._componentConstructor === vnode.nodeName;
		while (c && !isOwner && (c = c._parentComponent)) {
			isOwner = c.constructor === vnode.nodeName;
		}

		if (isOwner) {
			setComponentProps(c, getNodeProps(vnode), SYNC_RENDER);
		} else {
			if (c) {
				unmountComponent(dom, c);
				dom = null;
			}
			dom = createComponentFromVNode(vnode, dom);
		}

		return dom;
	}

	/** Instantiate and render a Component, given a VNode whose nodeName is a constructor.
	 *	@param {VNode} vnode
	 *	@private
	 */
	function createComponentFromVNode(vnode, dom) {
		var props = getNodeProps(vnode);
		var component = componentRecycler.create(vnode.nodeName, props);
		if (dom) component.base = dom;
		setComponentProps(component, props, NO_RENDER);
		renderComponent(component, DOM_RENDER);

		// let node = component.base;
		//if (!node._component) {
		//	node._component = component;
		//	node._componentConstructor = vnode.nodeName;
		//}

		return component.base;
	}

	/** Remove a component from the DOM and recycle it.
	 *	@param {Element} dom			A DOM node from which to unmount the given Component
	 *	@param {Component} component	The Component instance to unmount
	 *	@private
	 */
	function unmountComponent(dom, component, remove) {
		// console.warn('unmounting mismatched component', component);

		hook(component, 'componentWillUnmount');
		if (remove !== false) {
			if (dom._component === component) {
				delete dom._component;
				delete dom._componentConstructor;
			}
			var base = component.base;
			if (base && base.parentNode) {
				base.parentNode.removeChild(base);
			}
		}
		component._parentComponent = null;
		hook(component, 'componentDidUnmount');
		componentRecycler.collect(component);
	}

	/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
	 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
	 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
	 *	@returns {Element} dom			The created/mutated element
	 *	@private
	 */
	function build(dom, vnode) {
		var out = dom,
		    nodeName = vnode.nodeName;

		if (typeof nodeName === 'function' && !nodeName.prototype.render) {
			vnode = buildFunctionalComponent(vnode);
			nodeName = vnode.nodeName;
		}

		if (typeof nodeName === 'function') {
			return buildComponentFromVNode(dom, vnode);
		}

		if (typeof vnode === 'string') {
			if (dom) {
				if (dom.nodeType === 3) {
					dom[TEXT_CONTENT] = vnode;
					return dom;
				} else if (dom.nodeType === 1) {
					recycler.collect(dom);
				}
			}
			return document.createTextNode(vnode);
		}

		if (nodeName === null || nodeName === undefined) {
			nodeName = 'x-undefined-element';
		}

		if (!dom) {
			out = recycler.create(nodeName);
		} else if (dom.nodeName.toLowerCase() !== nodeName) {
			out = recycler.create(nodeName);
			appendChildren(out, toArray(dom.childNodes));
			// reclaim element nodes
			if (dom.nodeType === 1) recycler.collect(dom);
		}

		// apply attributes
		var old = getNodeAttributes(out) || EMPTY,
		    attrs = vnode.attributes || EMPTY;

		// removed attributes
		if (old !== EMPTY) {
			for (var name in old) {
				if (hop.call(old, name)) {
					var o = attrs[name];
					if (o === undefined || o === null) {
						setAccessor(out, name, null, old[name]);
					}
				}
			}
		}

		// new & updated attributes
		if (attrs !== EMPTY) {
			for (var _name in attrs) {
				if (hop.call(attrs, _name)) {
					var value = attrs[_name];
					if (value !== undefined && value !== null) {
						var prev = getAccessor(out, _name, old[_name]);
						if (value != prev) {
							setAccessor(out, _name, value, prev);
						}
					}
				}
			}
		}

		var children = toArray(out.childNodes);
		var keyed = {};
		for (var i = children.length; i--;) {
			var t = children[i].nodeType;
			var key = void 0;
			if (t === 3) {
				key = t.key;
			} else if (t === 1) {
				key = children[i].getAttribute('key');
			} else {
				continue;
			}
			if (key) keyed[key] = children.splice(i, 1)[0];
		}
		var newChildren = [];

		if (vnode.children) {
			for (var _i = 0, vlen = vnode.children.length; _i < vlen; _i++) {
				var vchild = vnode.children[_i];
				// if (isFunctionalComponent(vchild)) {
				// 	vchild = buildFunctionalComponent(vchild);
				// }
				var _attrs = vchild.attributes,
				    _key4 = void 0,
				    child = void 0;
				if (_attrs) {
					_key4 = _attrs.key;
					child = _key4 && keyed[_key4];
				}

				// attempt to pluck a node of the same type from the existing children
				if (!child) {
					var len = children.length;
					if (children.length) {
						for (var j = 0; j < len; j++) {
							if (isSameNodeType(children[j], vchild)) {
								child = children.splice(j, 1)[0];
								break;
							}
						}
					}
				}

				// morph the matched/found/created DOM child to match vchild (deep)
				newChildren.push(build(child, vchild));
			}
		}

		// apply the constructed/enhanced ordered list to the parent
		for (var _i2 = 0, _len4 = newChildren.length; _i2 < _len4; _i2++) {
			// we're intentionally re-referencing out.childNodes here as it is a live NodeList
			if (out.childNodes[_i2] !== newChildren[_i2]) {
				var _child = newChildren[_i2],
				    c = _child._component,
				    next = out.childNodes[_i2 + 1];
				if (c) deepHook(c, 'componentWillMount');
				if (next) {
					out.insertBefore(_child, next);
				} else {
					out.appendChild(_child);
				}
				if (c) deepHook(c, 'componentDidMount');
			}
		}

		// remove orphaned children
		for (var _i3 = 0, _len5 = children.length; _i3 < _len5; _i3++) {
			var _child2 = children[_i3],
			    _c = _child2._component;
			if (_c) hook(_c, 'componentWillUnmount');
			_child2.parentNode.removeChild(_child2);
			if (_c) {
				hook(_c, 'componentDidUnmount');
				componentRecycler.collect(_c);
			} else if (_child2.nodeType === 1) {
				recycler.collect(_child2);
			}
		}

		return out;
	}

	/** Create an Event handler function that sets a given state property.
	 *	@param {Component} component	The component whose state should be updated
	 *	@param {string} key				A dot-notated key path to update in the component's state
	 *	@param {string} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component
	 *	@returns {function} linkedStateHandler
	 *	@private
	 */
	function createLinkedState(component, key, eventPath) {
		var path = key.split('.'),
		    p0 = path[0];
		return function (e) {
			var t = this,
			    obj = component.state,
			    v = void 0,
			    i = void 0;
			if (typeof eventPath === 'string') {
				v = delve(e, eventPath);
				if (empty(v) && (t = t._component)) {
					v = delve(t, eventPath);
				}
			} else {
				v = (t.nodeName + t.type).match(/^input(checkbox|radio)$/i) ? t.checked : t.value;
			}
			if (typeof v === 'function') v = v.call(t);
			for (i = 0; i < path.length - 1; i++) {
				obj = obj[path[i]] || {};
			}
			obj[path[i]] = v;
			component.setState(babelHelpers.defineProperty({}, p0, component.state[p0]));
		};
	}

	/** Managed queue of dirty components to be re-rendered.
	 *	@private
	 */
	var renderQueue = {
		// items/itemsOffline swap on each process() call (just a simple pool technique)
		items: [],
		itemsOffline: [],

		add: function add(component) {
			if (renderQueue.items.push(component) !== 1) return;

			var d = hooks.debounceRendering;
			if (d) d(renderQueue.process);else setTimeout(renderQueue.process, 0);
		},
		process: function process() {
			var items = renderQueue.items,
			    len = items.length;
			if (!len) return;
			renderQueue.items = renderQueue.itemsOffline;
			renderQueue.items.length = 0;
			renderQueue.itemsOffline = items;
			while (len--) {
				if (items[len]._dirty) {
					renderComponent(items[len]);
				}
			}
		}
	};

	/** Trigger all queued component renders.
	 *	@function
	 */
	var rerender = renderQueue.process;

	/** DOM node pool, keyed on nodeName.
	 *	@private
	 */
	var recycler = {
		nodes: {},
		normalizeName: memoize(function (name) {
			return name.toUpperCase();
		}),

		collect: function collect(node) {
			recycler.clean(node);
			var name = recycler.normalizeName(node.nodeName),
			    list = recycler.nodes[name];
			if (list) list.push(node);else recycler.nodes[name] = [node];
		},
		create: function create(nodeName) {
			var name = recycler.normalizeName(nodeName),
			    list = recycler.nodes[name];
			return list && list.pop() || document.createElement(nodeName);
		},
		clean: function clean(node) {
			if (node.parentNode) node.parentNode.removeChild(node);

			if (node.nodeType === 3) return;

			delete node._component;
			delete node._componentConstructor;

			var len = ATTR_PREFIX.length;
			for (var i in node) {
				if (i.indexOf(ATTR_PREFIX) === 0) {
					setAccessor(node, i.substring(len), null, node[i]);
				}
			}

			// if (node.childNodes.length>0) {
			// 	console.warn(`Warning: Recycler collecting <${node.nodeName}> with ${node.childNodes.length} children.`);
			// 	toArray(node.childNodes).forEach(recycler.collect);
			// }
		}
	};

	/** Retains a pool of Components for re-use, keyed on component name.
	 *	@private
	 */
	var componentRecycler = {
		components: {},

		collect: function collect(component) {
			var name = component.constructor.name,
			    list = componentRecycler.components[name];
			if (list) list.push(component);else componentRecycler.components[name] = [component];
		},
		create: function create(ctor, props) {
			var list = componentRecycler.components[ctor.name];
			if (list && list.length) {
				for (var i = list.length; i--;) {
					if (list[i].constructor === ctor) {
						return list.splice(i, 1)[0];
					}
				}
			}
			return new ctor(props);
		}
	};

	/** Append multiple children to a Node.
	 *	Uses a Document Fragment to batch when appending 2 or more children
	 *	@private
	 */
	function appendChildren(parent, children) {
		var len = children.length;
		if (len <= 2) {
			parent.appendChild(children[0]);
			if (len === 2) parent.appendChild(children[1]);
			return;
		}

		var frag = document.createDocumentFragment();
		for (var i = 0; i < len; i++) {
			frag.appendChild(children[i]);
		}parent.appendChild(frag);
	}

	/** Retrieve the value of a rendered attribute
	 *	@private
	 */
	function getAccessor(node, name, value) {
		var key = '' + ATTR_PREFIX + name;
		if (name !== 'type' && name in node) return node[name];
		if (name === 'class') return node.className;
		if (name === 'style') return node.style.cssText;
		if (hop.call(node, key)) return node[key];
		return value;
	}

	/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
	 *	If `value` is `null`, the attribute/handler will be removed.
	 *	@private
	 *	@param {Element} node	Element to mutate
	 *	@param {String} name	prop to set
	 *	@param {Any} value		new value to apply
	 *	@param {Any} old		old value (not currently used)
	 */
	function setAccessor(node, name, value) {
		if (name === 'class') {
			node.className = value;
		} else if (name === 'style') {
			node.style.cssText = value;
		} else if (name in node && name !== 'type') {
			node[name] = value;
		} else {
			setComplexAccessor(node, name, value);
		}

		node['' + ATTR_PREFIX + name] = getAccessor(node, name, value);
	}

	/** For props without explicit behavior, apply to a Node as event handlers or attributes.
	 *	@private
	 */
	function setComplexAccessor(node, name, value) {
		if (name.substring(0, 2) === 'on') {
			var _type = normalizeEventName(name),
			    l = node._listeners || (node._listeners = {});
			if (!l[_type]) node.addEventListener(_type, eventProxy);
			l[_type] = value;
			// @TODO automatically remove proxy event listener when no handlers are left
			return;
		}

		var type = typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value);
		if (value === null) {
			node.removeAttribute(name);
		} else if (type !== 'function' && type !== 'object') {
			node.setAttribute(name, value);
		}
	}

	/** Proxy an event to hooked event handlers
	 *	@private
	 */
	function eventProxy(e) {
		var fn = this._listeners[normalizeEventName(e.type)];
		if (fn) return fn.call(this, hook(hooks, 'event', e) || e);
	}

	/** Convert an Event name/type to lowercase and strip any "on*" prefix.
	 *	@function
	 *	@private
	 */
	var normalizeEventName = memoize(function (t) {
		return t.replace(/^on/i, '').toLowerCase();
	});

	/** Get a node's attributes as a hashmap, regardless of type.
	 *	@private
	 */
	function getNodeAttributes(node) {
		var list = node.attributes;
		if (!list || !list.getNamedItem) return list;
		if (list.length) return getAttributesAsObject(list);
	}

	/** Convert a DOM `.attributes` NamedNodeMap to a hashmap.
	 *	@private
	 */
	function getAttributesAsObject(list) {
		var attrs = {};
		for (var i = list.length; i--;) {
			var item = list[i];
			attrs[item.name] = item.value;
		}
		return attrs;
	}

	/** Reconstruct Component-style `props` from a VNode
	 *	@private
	 */
	function getNodeProps(vnode) {
		var props = extend({}, vnode.attributes);
		if (vnode.children) {
			props.children = vnode.children;
		}
		return props;
	}

	/** Convert a hashmap of styles to CSSText
	 *	@private
	 */
	function styleObjToCss(s) {
		var str = '',
		    sep = ': ',
		    term = '; ';
		for (var prop in s) {
			if (hop.call(s, prop)) {
				var val = s[prop];
				str += jsToCss(prop);
				str += sep;
				str += val;
				if (typeof val === 'number' && !hop.call(NON_DIMENSION_PROPS, prop)) {
					str += 'px';
				}
				str += term;
			}
		}
		return str;
	}

	/** Convert a hashmap of CSS classes to a space-delimited className string
	 *	@private
	 */
	function hashToClassName(c) {
		var str = '';
		for (var prop in c) {
			if (c[prop]) {
				if (str) str += ' ';
				str += prop;
			}
		}
		return str;
	}

	/** Convert a JavaScript camel-case CSS property name to a CSS property name
	 *	@private
	 *	@function
	 */
	var jsToCss = memoize(function (s) {
		return s.replace(/([A-Z])/, '-$1').toLowerCase();
	});

	/** Copy own-properties from `props` onto `obj`.
	 *	@returns obj
	 *	@private
	 */
	function extend(obj, props) {
		for (var i in props) {
			if (hop.call(props, i)) {
				obj[i] = props[i];
			}
		}return obj;
	}

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) == 'object';
	}

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object,
	 *  else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
	}

	var ponyfill = __commonjs(function (module) {
		'use strict';

		module.exports = function symbolObservablePonyfill(root) {
			var result;
			var _Symbol = root.Symbol;

			if (typeof _Symbol === 'function') {
				if (_Symbol.observable) {
					result = _Symbol.observable;
				} else {
					result = _Symbol('observable');
					_Symbol.observable = result;
				}
			} else {
				result = '@@observable';
			}

			return result;
		};
	});

	var require$$0 = ponyfill && (typeof ponyfill === 'undefined' ? 'undefined' : babelHelpers.typeof(ponyfill)) === 'object' && 'default' in ponyfill ? ponyfill['default'] : ponyfill;

	var index = __commonjs(function (module, exports, global) {
	  /* global window */
	  'use strict';

	  module.exports = require$$0(global || window || __commonjs_global);
	});

	var $$observable = index && (typeof index === 'undefined' ? 'undefined' : babelHelpers.typeof(index)) === 'object' && 'default' in index ? index['default'] : index;

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, initialState, enhancer) {
	  var _ref2;

	  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = initialState;
	    initialState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, initialState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = initialState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!isPlainObject(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }

	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
	   */
	  function observable() {
	    var _ref;

	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */

	      subscribe: function subscribe(observer) {
	        if ((typeof observer === 'undefined' ? 'undefined' : babelHelpers.typeof(observer)) !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[$$observable] = function () {
	      return this;
	    }, _ref;
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[$$observable] = observable, _ref2;
	}

	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if (true && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	var Counter = function Counter(_ref) {
	  var value = _ref.value;
	  var onIncrement = _ref.onIncrement;
	  var onDecrement = _ref.onDecrement;
	  var onRemoveCounter = _ref.onRemoveCounter;
	  return h(
	    'div',
	    null,
	    h(
	      'h1',
	      null,
	      value
	    ),
	    h(
	      'button',
	      { onClick: onDecrement },
	      '-'
	    ),
	    h(
	      'button',
	      { onClick: onIncrement },
	      '+'
	    ),
	    h(
	      'button',
	      { onClick: onRemoveCounter },
	      'Remove this counter'
	    )
	  );
	};

	var counter = function counter() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? [0] : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case 'ADD_COUNTER':
	      return addCounter(state);
	    case 'REMOVE_COUNTER':
	      return removeCounter(state, action.index);
	    case 'INCREMENT':
	      return incrementCounter(state, action.index);
	    case 'DECREMENT':
	      return decrementCounter(state, action.index);
	    default:
	      return state;
	  }
	};

	var addCounter = function addCounter(list) {
	  return [].concat(babelHelpers.toConsumableArray(list), [0]);
	};

	var removeCounter = function removeCounter(list, index) {
	  return [].concat(babelHelpers.toConsumableArray(list.slice(0, index)), babelHelpers.toConsumableArray(list.slice(index + 1)));
	};

	var incrementCounter = function incrementCounter(list, index) {
	  return [].concat(babelHelpers.toConsumableArray(list.slice(0, index)), [list[index] + 1], babelHelpers.toConsumableArray(list.slice(index + 1)));
	};

	var decrementCounter = function decrementCounter(list, index) {
	  return [].concat(babelHelpers.toConsumableArray(list.slice(0, index)), [list[index] - 1], babelHelpers.toConsumableArray(list.slice(index + 1)));
	};

	var store = createStore(counter);

	var App = function (_Component) {
	  babelHelpers.inherits(App, _Component);

	  function App() {
	    babelHelpers.classCallCheck(this, App);
	    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
	  }

	  babelHelpers.createClass(App, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      this.setState({ counters: store.getState() });

	      return h(
	        'div',
	        null,
	        this.state.counters.map(function (value, index) {
	          return h(Counter, {
	            key: index,
	            value: value,
	            onIncrement: function onIncrement() {
	              return store.dispatch({ type: 'INCREMENT', index: index });
	            },
	            onDecrement: function onDecrement() {
	              return store.dispatch({ type: 'DECREMENT', index: index });
	            },
	            onRemoveCounter: function onRemoveCounter() {
	              return store.dispatch({ type: 'REMOVE_COUNTER', index: index });
	            }
	          });
	        }),
	        h(
	          'button',
	          { onClick: function onClick() {
	              return store.dispatch({ type: 'ADD_COUNTER' });
	            } },
	          'Add counter'
	        ),
	        h(
	          'button',
	          { onClick: function onClick() {
	              return store.dispatch({
	                type: 'REMOVE_COUNTER',
	                index: _this2.state.counters.length - 1
	              });
	            } },
	          'Remove counter'
	        )
	      );
	    }
	  }]);
	  return App;
	}(Component);

	render(h(App, null), document.querySelector('[data-js="main"]'));

}());