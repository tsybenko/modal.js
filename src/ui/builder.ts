import { UIBuilderOptions } from "../interfaces/UIBuilderOptions";
import { defaults } from "./defaults";
import { mapProps } from "../utils";

interface UIStructure {
	header: HTMLDivElement,
	body: HTMLDivElement,
	footer: HTMLDivElement
}

const Builder = function(
	rootElement: HTMLElement,
	options: UIBuilderOptions = defaults
) {
	mapProps(options, defaults);

	const createHeader = (): HTMLDivElement => {
		const node = document.createElement('div');
		node.classList.add(options.classLists.header);

		return node;
	};

	const createBody = (): HTMLDivElement => {
		const node = document.createElement('div');
		node.classList.add(options.classLists.body);

		return node;
	};

	const createFooter = () => {
		let node = document.createElement('div');
		node.classList.add(options.classLists.footer);

		return node;
	};

	const build = (): UIStructure => {
		return {
			header: createHeader(),
			body: createBody(),
			footer: createFooter()
		};
	};

	const mount = () => {
		const nodes: UIStructure = build();

		rootElement.appendChild(nodes.header);
		rootElement.appendChild(nodes.body);
		rootElement.appendChild(nodes.footer);
	};

	this.mount = mount;
};

export { Builder };