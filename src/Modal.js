export default (function(el, triggers = [], options = {}) {

	this.initedHook = function(cb) {cb()};
	// this.triggerAddedHook = function(cb) {cb()};

	this.events = {
		beforeOpen: function(data) {
			return new CustomEvent('beforeOpen', {detail: data});
		},
		opened: function(data) {
			return new CustomEvent('opened', {detail: data});
		},
		beforeClose: function(data) {
			return new CustomEvent('beforeClose', {detail: data});
		},
		closed: function(data) {
			return new CustomEvent('closed', {detail: data});
		},
		// toggle: function() {}
	};

	this.el = el;

	this.options = options;
	let rootEl = this.options.rootEl || document;

	rootEl.addEventListener('keyup', (function(e) {
		if (e.keyCode === 27) {
			if (this.isShow()) {
				this.toggleModal();
			}
		}
	}).bind(this));

	this.triggers = [];

	/** Show modal window */
	this.showModal = function() {
		rootEl.dispatchEvent(this.events.beforeOpen());
		this.el.style.display = 'flex';
		rootEl.dispatchEvent(this.events.opened());
	};

	/** Hide modal window */
	this.hideModal = function() {
		rootEl.dispatchEvent(this.events.beforeClose());
		this.el.style.display = 'none';
		rootEl.dispatchEvent(this.events.closed());

		this.isHidden = function() {
			return this.el.style.display == 'none';
		};

		this.isShow = function() {
			return !this.isHidden();
		}
	};

	/** Toggle modal window */
	this.toggleModal = function() {
		console.log('toggleModal');
		if (this.isHidden()) {
			this.showModal();
		} else {
			this.hideModal();
		}
	};

	this.initedHook((function() {
		this.hideModal();
	}).bind(this));


	this.handleTrigger = (function(e) {
		this.toggleModal();
	}).bind(this);

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
	 * @param cb
	 */
	this.beforeOpen = function(cb) {
		rootEl.addEventListener('beforeOpen', function(e) {cb(e)});
	};

	/**
	 * Will call handler "cb" after modal window was opened
	 *
	 * @param cb
	 */
	this.opened = function(cb) {
		rootEl.addEventListener('opened', function(e) {cb(e)});
	};

	/**
	 * Will call handler "cb" calls before modal window will be closed
	 *
	 * @param cb
	 */
	this.beforeClose = function(cb) {
		rootEl.addEventListener('beforeClose', function(e) {cb(e)});
	};

	/**
	 * Will call handler "cb" after modal window was closed
	 *
	 * @param cb
	 */
	this.closed = function(cb) {
		rootEl.addEventListener('closed', function(e) {cb(e)});
	};

})(window);