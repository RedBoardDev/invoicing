import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./config/vite/base.config";

export default defineConfig(({ command }) => {
	return mergeConfig(baseConfig(command), {
		server: {
			port: 3002,
			open: true,
		},
	});
});
