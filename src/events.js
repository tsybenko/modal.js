module.exports = {
	inited: data => new CustomEvent('inited', { detail: data }),
	beforeOpen: data => new CustomEvent('beforeOpen', { detail: data }),
	onOpen: data => new CustomEvent('onOpen', { detail: data, cancelable: true }),
	opened: data => new CustomEvent('opened', { detail: data }),
	beforeClose: data => new CustomEvent('beforeClose', { detail: data }),
	onClose: data => new CustomEvent('onClose', { detail: data, cancelable: true }),
	closed: data => new CustomEvent('closed', { detail: data }),
	onToggle: data => new CustomEvent('onToggle', { detail: data }),
};