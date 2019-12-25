class Builder {
	container;

	constructor(rootSelector, options = {}) {
		this.container = document.querySelector(rootSelector);

		const blockName = "modal";

		const defaults = {
			classLists: {
				header: `${blockName}__header`,
				body: `${blockName}__body`,
				footer: `${blockName}__footer`,
			}
		};

		this.options = {
			classLists: options.classLists || defaults.classLists
		};
	}

	// createNode(name, tagName = "div") {
	// 	let options = this.options;
	// 	let container = this.container;
	// 	let node = container.createElement(tagName);
	// }

	createHeader() {
		let options = this.options;

		let container = this.container;
		let node = container.createElement('div');
		node.classList.add(options.classLists.header);

		return node;
	}

	createBody() {
		let options = this.options;

		let container = this.container;
		let node = container.createElement('div');
		node.classList.add(options.classLists.body);

		return node;
	}

	createFooter() {
		let options = this.options;

		let container = this.container;
		let node = container.createElement('div');
		node.classList.add(options.classLists.footer);

		return node;
	}

	build() {
		let header = this.createHeader();
		let body = this.createBody();
		let footer = this.createFooter();

		return {
			header,
			body,
			footer
		};
	}

	mount() {
		let container = this.container;
		let nodes = this.build();

		container.appendChild(nodes.header);
		container.appendChild(nodes.body);
		container.appendChild(nodes.footer);
	}
}