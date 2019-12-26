module.exports = {
	name: "aria",
	methods: {
		showModal: (event, element) => {
			element.removeAttribute('aria-hidden');
			element.setAttribute('aria-modal', 'true');
		},
		hideModal: (event, element) => {
			element.removeAttribute('aria-modal');
			element.setAttribute('aria-hidden', 'true');
		}
	},
};