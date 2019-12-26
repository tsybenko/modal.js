module.exports = (document => function(el, options = {}) {

	this.initedHook = function(cb) {cb()};

	/**
	 * Predefined events of the module
	 */
	const events = {
		inited: data => new CustomEvent('inited', { detail: data }),
		beforeOpen: data => new CustomEvent('beforeOpen', { detail: data }),
		onOpen: data => new CustomEvent('onOpen', { detail: data, cancelable: true }),
		opened: data => new CustomEvent('opened', { detail: data }),
		beforeClose: data => new CustomEvent('beforeClose', { detail: data }),
		onClose: data => new CustomEvent('onClose', { detail: data, cancelable: true }),
		closed: data => new CustomEvent('closed', { detail: data }),
		onToggle: data => new CustomEvent('onToggle', { detail: data }),
	};

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
			}

			el.dispatchEvent(events.opened(e));
		}
	};

	/**
	 * Hide modal window
	 */
	this.hideModal = function(e) {
		el.dispatchEvent(events.beforeClose(e))

		if (el.dispatchEvent(events.onClose(e))) {
			el.style.visibility = 'hidden';

			if (el.classList.contains('opened')) {
				el.classList.remove('opened');
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

	// for (let [key] of Object.entries(events)) {
	// 	this[`${key}`] = handler => el.addEventListener('key', event => handler(event));
	// }

	const hooks = {
		inited: handler => el.addEventListener('inited', event => handler(event)),
		beforeOpen: handler => el.addEventListener('beforeOpen', event => handler(event)),
		onOpen: handler => el.addEventListener('onOpen', event => handler(event)),
		opened: handler => el.addEventListener('opened', event => handler(event)),
		beforeClose: handler => el.addEventListener('beforeClose', event => handler(event)),
		onClose: handler => el.addEventListener('onClose', event => handler(event)),
		closed: handler => el.addEventListener('closed', event => handler(event))
	};

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