const aria = require('./plugins/aria');

module.exports = (document => function(el, options = {}) {

	this.initedHook = function(cb) {cb()};

	let plugins = {};

	this.plug = function(plugin) {
		if (! plugins.hasOwnProperty(plugin.name)) {
			plugins = {...plugins, plugin};

			return true;
		}

		return false;
	};

	this.plug(aria);

	const mapPluginsMethod = function (methodName, options) {
		for (let plugin in plugins) {
			if (plugins[plugin].methods.hasOwnProperty(methodName)) {
				plugins[plugin].methods[methodName](options.event, options.element);
			}
		}
	};

	/**
	 * Hooks
	 *
	 * @type {{onClose: (function(*): *), inited: (function(*): *), onOpen: (function(*): *), beforeClose: (function(*): *), closed: (function(*): *), opened: (function(*): *), beforeOpen: (function(*): *)}}
	 */
	const hooks = require('./hooks')(el);

	const events = require('./events');

	el.dispatchEvent(events.inited());

	/**
	 * Handler of "Escape" keyboard button
	 * @param e {KeyboardEvent}
	 */
	let escHandler = (function(e) {
		if (e.key === "Escape") {
			if (this.isShow()) {
				this.toggleModal(e);
			}
		}
	}).bind(this);

	/**
	 * Listener of "Escape" keyboard button
	 */
	document.addEventListener('keyup', event => escHandler.call(this, event));

	/**
	 * Triggers
	 *
	 * @type {Array}
	 */
	this.triggers = (options.hasOwnProperty('triggers'))
		? [...options.triggers]
		: [];

	/**
	 * Check is modal hidden
	 *
	 * @returns {boolean}
	 */
	this.isHidden = function() {
		return el.style.visibility === 'hidden';
	};

	/**
	 * Check is modal shows
	 * Based on "isHidden" method, returns reversed result of "isHidden"
	 *
	 * @returns {boolean}
	 */
	this.isShow = function() {
		return !this.isHidden();
	};

	/**
	 * Show modal window
	 */
	this.showModal = function(e) {
		el.dispatchEvent(events.beforeOpen(e))

		if (el.dispatchEvent(events.onOpen(e))) {
			el.style.visibility = 'visible';

			if (! el.classList.contains('opened')) {
				el.classList.add('opened');

				mapPluginsMethod('showModal', { event: e, element: el });

			}

			el.dispatchEvent(events.opened(e));
		}
	};

	/**
	 * Hide modal window
	 */
	this.hideModal = function(e) {
		el.dispatchEvent(events.beforeClose(e));

		if (el.dispatchEvent(events.onClose(e))) {
			el.style.visibility = 'hidden';

			if (el.classList.contains('opened')) {
				el.classList.remove('opened');

				mapPluginsMethod('hideModal', { event: e, element: el });
			}

			el.dispatchEvent(events.closed(e));
		}
	};

	/**
	 * Toggle modal window
	 */
	this.toggleModal = function(e) {
		this.isHidden() === true
			? this.showModal(e)
			: this.hideModal(e);
	};

	/**
	 * Hides modal when instance was initialised
	 */
	this.initedHook((function() {
		this.hideModal();
	}).bind(this));


	/**
	 * Handler that will be assigned to a trigger
	 */
	this.handleTrigger = (function(e) {
		this.toggleModal(e);
	}).bind(this);

	/**
	 * Sets HTMLDOMElement "el" with event type of eventName as a trigger of toggle method
	 *
	 * @param el {HTMLElement}
	 * @param eventName {String}
	 * @returns {boolean}
	 */
	this.addTrigger = function(el, eventName) {
		if (! this.triggers.includes(el)) {
			this.triggers.push({ element: el, eventType: eventName });
			el.addEventListener(eventName, this.handleTrigger);
			return true;
		}
		return false;
	};

	const mapTriggers = (function() {
		this.triggers.map(trigger => this.addTrigger(trigger.element, trigger.eventType));
	}).bind(this);

	mapTriggers();

	/** Default trigger */
	this.addTrigger(el.querySelector('.btn-close'), 'click');
	this.addTrigger(el.querySelector('.modal__background'), 'click');

	// for (let [key] of Object.entries(events)) {
	// 	this[`${key}`] = handler => el.addEventListener('key', event => handler(event));
	// }

	/**
	 * Will call handler "handler" after the module instantiation
	 *
	 * @param handler {Function}
	 */
	this.inited = hooks.inited;

	/**
	 * Will call handler "handler" before modal window will be opened
	 *
	 * @param handler {Function}
	 */
	this.beforeOpen = hooks.beforeOpen;

	/**
	 * Will call handler "handler" right in moment before modal window will be opened
	 *
	 * @param handler {Function}
	 */
	this.onOpen = hooks.onOpen;

	/**
	 * Will call handler "handler" after modal window was opened
	 *
	 * @param handler {Function}
	 */
	this.opened = hooks.opened;

	/**
	 * Will call handler "handler" right in moment before modal window was closed
	 *
	 * @param handler {Function}
	 */
	this.onClose = hooks.onClose;

	/**
	 * Will call handler "handler" calls before modal window will be closed
	 *
	 * @param handler {Function}
	 */
	this.beforeClose = hooks.beforeClose;

	/**
	 * Will call handler "handler" after modal window was closed
	 *
	 * @param handler {Function}
	 */
	this.closed = hooks.closed;

})(document);