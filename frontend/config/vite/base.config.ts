import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default (mode: string) =>
	defineConfig({
		plugins: [
			react(),
			svgr({
				svgrOptions: {
					icon: true,
					svgo: true,
				},
			}),
		],
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
		css: {
			modules: {
				localsConvention: "camelCaseOnly",
			},
		},
		build: {
			outDir: "dist",
			sourcemap: mode === "development" ? "inline" : false,
			minify: mode === "production" ? "terser" : "esbuild",
			terserOptions: {
				compress: {
					drop_console: mode === "production",
					drop_debugger: true,
				},
				format: {
					comments: false,
				},
			},
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ["react", "react-dom", "react-router-dom"],
					},
				},
			},
		},
	});
