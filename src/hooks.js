module.exports = element => ({
	inited: handler => element.addEventListener('inited', event => handler(event)),
	beforeOpen: handler => element.addEventListener('beforeOpen', event => handler(event)),
	onOpen: handler => element.addEventListener('onOpen', event => handler(event)),
	opened: handler => element.addEventListener('opened', event => handler(event)),
	beforeClose: handler => element.addEventListener('beforeClose', event => handler(event)),
	onClose: handler => element.addEventListener('onClose', event => handler(event)),
	closed: handler => element.addEventListener('closed', event => handler(event))
});