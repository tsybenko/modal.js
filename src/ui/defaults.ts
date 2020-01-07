import { UIBuilderOptions } from "../interfaces/UIBuilderOptions";

const blockName = "modal";

const defaults: UIBuilderOptions = {
	classLists: {
		header: `${blockName}__header`,
		body: `${blockName}__body`,
		footer: `${blockName}__footer`,
	}
};

export { defaults };