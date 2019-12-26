module.exports = {
	registerPlugin: pluginsStore => plugin => {
		if (! pluginsStore.hasOwnProperty(plugin.name)) {
			pluginsStore = {...pluginsStore, plugin};

			return true;
		}

		return false;
	},
	mapPluginsMethod: pluginsStore => (methodName, options) => {
		for (let plugin in pluginsStore) {
			if (pluginsStore[plugin].hasOwnProperty("methods")) {
				if (pluginsStore[plugin].methods.hasOwnProperty(methodName)) {
					pluginsStore[plugin].methods[methodName](options.event, options.element);
				}
			}
		}
	}
};