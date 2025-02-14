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
		css: {
			modules: {
				localsConvention: "camelCaseOnly",
			},
		},
		build: {
			outDir: "dist",
			sourcemap: mode === "development" ? "inline" : false,
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ["react", "react-dom", "react-router-dom"],
					},
				},
			},
		},
	});
