const { BEFORE_OPEN, ON_OPEN, OPENED, BEFORE_CLOSE, ON_CLOSE, CLOSED } = require('./constants');

module.exports = element => ({
	// inited: handler => element.addEventListener('inited', event => handler(event)),
	[BEFORE_OPEN]: handler => element.addEventListener(BEFORE_OPEN, event => handler(event)),
	[ON_OPEN]: handler => element.addEventListener(ON_OPEN, event => handler(event)),
	[OPENED]: handler => element.addEventListener(OPENED, event => handler(event)),
	[BEFORE_CLOSE]: handler => element.addEventListener(BEFORE_CLOSE, event => handler(event)),
	[ON_CLOSE]: handler => element.addEventListener(ON_CLOSE, event => handler(event)),
	[CLOSED]: handler => element.addEventListener(CLOSED, event => handler(event))
});