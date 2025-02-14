import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./config/vite/base.config";

export default defineConfig(({ command, mode }) => {
	return mergeConfig(baseConfig(command), {
		server: {
			port: 3002,
			open: true,
		},
	});
});
