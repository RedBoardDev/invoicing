import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./config/vite/base.config";

export default defineConfig(({ mode }) => {
	return mergeConfig(baseConfig(mode), {
		server: {
			port: 3002,
			open: true,
			strictPort: true,
		},
	});
});
