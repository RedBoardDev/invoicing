import path from "node:path";
import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./config/vite/base.config";

export default defineConfig(({ mode }) => {
	return mergeConfig(baseConfig(mode), {
		resolve: {
			alias: {
				"@icon": path.resolve(__dirname, "src/components/Icon.tsx"),
				"@icons": path.resolve(__dirname, "src/assets/icons"),
				"@images": path.resolve(__dirname, "src/assets/images"),
				"@components": path.resolve(__dirname, "src/components"),
				"@enums": path.resolve(__dirname, "src/enums"),
				"@api": path.resolve(__dirname, "src/services/api"),
				"@services": path.resolve(__dirname, "src/services"),
				"@contexts": path.resolve(__dirname, "src/contexts"),
				"@utils": path.resolve(__dirname, "src/utils/index.ts"),
				"@interfaces": path.resolve(__dirname, "src/interfaces"),
				"@views": path.resolve(__dirname, "src/views"),
				"@hooks": path.resolve(__dirname, "src/hooks"),
				"@config": path.resolve(__dirname, "src/config"),
				"@routes": path.resolve(__dirname, "src/routes"),
			},
		},
		server: {
			port: 3002,
			open: true,
			strictPort: true,
		},
	});
});
