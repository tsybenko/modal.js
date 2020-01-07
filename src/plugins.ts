import { OptionsObject, Plugin } from "./interfaces/";

export default (store) => ({

	/**
	 * Add plugin into store
	 *
	 * @param plugin
	 * @returns {boolean}
	 */
	registerPlugin: (plugin: Plugin): boolean => {

		if (! store.has(plugin.name)) {
			store.set(plugin.name, plugin);

			return true;
		}

		return false;
	},

	/**
	 * Will call "methodName" inside of methods of plugins
	 *
	 * @param methodName {string}
	 * @param options {Object}
	 */
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