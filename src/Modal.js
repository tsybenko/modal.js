module.exports = (document => function(el, triggers = [], options = {}) {

	this.initedHook = function(cb) {cb()};
	// this.triggerAddedHook = function(cb) {cb()};

	/**
	 * Predefined events of the module
	 */
	this.events = {
		inited: data => new CustomEvent('inited', { detail: data }),
		beforeOpen: data => new CustomEvent('beforeOpen', { detail: data }),
		onOpen: data => new CustomEvent('onOpen', { detail: data, cancelable: true }),
		opened: data => new CustomEvent('opened', { detail: data }),
		beforeClose: data => new CustomEvent('beforeClose', { detail: data }),
		onClose: data => new CustomEvent('onClose', { detail: data, cancelable: true }),
		closed: data => new CustomEvent('closed', { detail: data }),
		onToggle: data => new CustomEvent('onToggle', { detail: data }),
	};

	/**
	 * Container
	 */
	this.el = el;

	/**
	 * Options of instance of the module
	 */
	this.options = options;

	/**
	 * Root element (HTML)
	 *
	 * @type {*|Document}
	 */
	let rootEl = this.options.rootEl || document;

	rootEl.dispatchEvent(this.events.inited());

	/**
	 * Handler of "Escape" keyboard button
	 * @param e {KeyboardEvent}
	 */
	let escHandler = function(e) {
		if (e.key === "Escape") {
			if (this.isShow()) {
				this.toggleModal(e);
			}
		}
	};

	/**
	 * Listener of "Escape" keyboard button
	 */
	rootEl.addEventListener('keyup', e => escHandler.call(this, e));

	/**
	 * Triggers
	 *
	 * @type {Array}
	 */
	this.triggers = [];

	/**
	 * Check is modal hidden
	 *
	 * @returns {boolean}
	 */
	this.isHidden = function() {
		return this.el.style.visibility === 'hidden';
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
		rootEl.dispatchEvent(this.events.beforeOpen(e))

		if (rootEl.dispatchEvent(this.events.onOpen(e))) {
			this.el.style.visibility = 'visible';

			if (! this.el.classList.contains('opened')) {
				this.el.classList.add('opened');
			}

			rootEl.dispatchEvent(this.events.opened(e));
		}
	};

	/**
	 * Hide modal window
	 */
	this.hideModal = function(e) {
		rootEl.dispatchEvent(this.events.beforeClose(e))

		if (rootEl.dispatchEvent(this.events.onClose(e))) {
			this.el.style.visibility = 'hidden';

			if (this.el.classList.contains('opened')) {
				this.el.classList.remove('opened');
			}

			rootEl.dispatchEvent(this.events.closed(e));
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
			this.triggers.push(el);
			el.addEventListener(eventName, this.handleTrigger);
			// this.triggerAddedHook(function() {});
			return true;
		}
		return false;
	};

	/** Default trigger */
	this.addTrigger(this.el.querySelector('.btn-close'), 'click');

	// for (let [key] of Object.entries(this.events)) {
	// 	this[`${key}`] = handler => rootEl.addEventListener('key', event => handler(event));
	// }

	const hooks = {
		inited: handler => rootEl.addEventListener('inited', event => handler(event)),
		beforeOpen: handler => rootEl.addEventListener('beforeOpen', event => handler(event)),
		onOpen: handler => rootEl.addEventListener('onOpen', event => handler(event)),
		opened: handler => rootEl.addEventListener('opened', event => handler(event)),
		beforeClose: handler => rootEl.addEventListener('beforeClose', event => handler(event)),
		onClose: handler => rootEl.addEventListener('onClose', event => handler(event)),
		closed: handler => rootEl.addEventListener('closed', event => handler(event))
	};

	this.hooks = hooks;

	this.inited = this.hooks.inited;

	/**
	 * Will call handler "handler" before modal window will be opened
	 *
	 * @param handler {Function}
	 */
	this.beforeOpen = this.hooks.beforeOpen;

	/**
	 * Will call handler "handler" right in moment before modal window will be opened
	 *
	 * @param handler {Function}
	 */
	this.onOpen = this.hooks.onOpen;

	/**
	 * Will call handler "handler" after modal window was opened
	 *
	 * @param handler {Function}
	 */
	this.opened = this.hooks.opened;

	/**
	 * Will call handler "handler" right in moment before modal window was closed
	 *
	 * @param handler {Function}
	 */
	this.onClose = this.hooks.onClose;

	/**
	 * Will call handler "handler" calls before modal window will be closed
	 *
	 * @param handler {Function}
	 */
	this.beforeClose = this.hooks.beforeClose;

	/**
	 * Will call handler "handler" after modal window was closed
	 *
	 * @param handler {Function}
	 */
	this.closed = this.hooks.closed;

})(document);