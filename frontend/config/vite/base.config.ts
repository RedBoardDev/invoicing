import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig } from "vite";
import type { ViteDevServer } from "vite";

import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

const cspHeader = `
  default-src 'self';
	connect-src 'self' http://localhost:3000;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  frame-src 'none';
  object-src 'none';
  child-src 'none';
  worker-src 'self' blob:;
  form-action 'self';
  manifest-src 'self';
  upgrade-insecure-requests;
  block-all-mixed-content;
  base-uri 'self';
  frame-ancestors 'none'
`
	.replace(/\s+/g, " ")
	.trim();

function securityHeaders() {
	return {
		name: "security-headers",
		configureServer(server: ViteDevServer) {
			server.middlewares.use(
				(
					_req: IncomingMessage,
					res: ServerResponse,
					next: (err?: unknown) => void,
				): void => {
					res.setHeader("Content-Security-Policy", cspHeader);
					res.setHeader("X-Content-Type-Options", "nosniff");
					res.setHeader("X-Frame-Options", "DENY");
					res.setHeader("X-XSS-Protection", "1; mode=block");
					res.setHeader(
						"Strict-Transport-Security",
						"max-age=31536000; includeSubDomains",
					);
					res.setHeader(
						"Permissions-Policy",
						"geolocation=(), midi=(), sync-xhr=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), fullscreen=(self), payment=()",
					);

					if (process.env.NODE_ENV === "production") {
						res.setHeader(
							"Cache-Control",
							"public, max-age=31536000, immutable",
						);
					}

					next();
				},
			);
		},
	};
}

export default function baseConfig(command: string) {
	return defineConfig({
		plugins: [
			react(),
			svgr(),
			tsconfigPaths(),
			checker(command === "build" ? { typescript: true } : {}),
			securityHeaders(),
		],
		build: {
			outDir: "build",
		},
		server: {
			strictPort: true,
		},
		cacheDir: `node_modules/.vite_cache_${process.pid}`,
	});
}
