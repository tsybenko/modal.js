module.exports = (document => function(el, triggers = [], options = {}) {

	this.initedHook = function(cb) {cb()};
	// this.triggerAddedHook = function(cb) {cb()};

	/**
	 * Predefined events of the module
	 */
	this.events = {
		beforeOpen: function(data) {
			return new CustomEvent('beforeOpen', {detail: data, cancelable: true});
		},
		opened: function(data) {
			return new CustomEvent('opened', {detail: data});
		},
		beforeClose: function(data) {
			return new CustomEvent('beforeClose', {detail: data, cancelable: true});
		},
		closed: function(data) {
			return new CustomEvent('closed', {detail: data});
		},
		// toggle: function() {}
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

	/**
	 * Handler of "Escape" keyboard button
	 * @param e {KeyboardEvent}
	 */
	let escHandler = function(e) {
		if (e.key === "Escape") {
			if (this.isShow()) {
				this.toggleModal();
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
		if (rootEl.dispatchEvent(this.events.beforeOpen(e))) {
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
		if (rootEl.dispatchEvent(this.events.beforeClose(e))) {
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

	/**
	 * Will call handler "cb" before modal window will be opened
	 *
	 * @param cb {Function}
	 */
	this.beforeOpen = function(cb) {
		rootEl.addEventListener('beforeOpen', function(e) {cb(e)});
	};

	/**
	 * Will call handler "cb" after modal window was opened
	 *
	 * @param cb {Function}
	 */
	this.opened = function(cb) {
		rootEl.addEventListener('opened', function(e) {cb(e)});
	};

	/**
	 * Will call handler "cb" calls before modal window will be closed
	 *
	 * @param cb {Function}
	 */
	this.beforeClose = function(cb) {
		rootEl.addEventListener('beforeClose', function(e) {cb(e)});
	};

	/**
	 * Will call handler "cb" after modal window was closed
	 *
	 * @param cb {Function}
	 */
	this.closed = function(cb) {
		rootEl.addEventListener('closed', function(e) {cb(e)});
	};

})(document);