interface OptionsObject {
	event: CustomEvent | Event,
	element: Element
}

export default (store) => ({
	registerPlugin: plugin => {

		if (! store.has(plugin.name)) {
			store.set(plugin.name, plugin);

			return true;
		}

		return false;
	},
	mapPluginsMethod: (methodName: string, options: OptionsObject) => {
		if (store.size > 0) {
			for (let plugin of store.values()) {
				if (plugin.hasOwnProperty("methods")) {
					if (plugin.methods.hasOwnProperty(methodName)) {
						plugin.methods[methodName](options.event, options.element);
					}
				}
			}
		}
	}
});