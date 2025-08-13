import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),

    ...(command === "build"
      ? [
          compression({
            algorithms: ["gzip"],
            exclude: [/\.(br)$/, /\.(gz)$/],
          }),
          compression({
            algorithms: ["brotliCompress"],
            exclude: [/\.(br)$/, /\.(gz)$/],
          }),
          visualizer({
            filename: "dist/stats.html",
            open: false,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],

  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "@tanstack/react-query",
      "axios",
      "date-fns",
      "zod",
      "lucide-react",
      "recharts",
    ],
    exclude: ["@react-router/node", "@react-router/serve"],
  },

  // Build optimizations
  build: {
    // Target modern browsers for smaller bundles
    target: "esnext",

    // Enable minification
    minify: "terser",

    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
        pure_funcs:
          mode === "production" ? ["console.log", "console.info"] : [],
      },
      mangle: {
        safari10: true,
      },
    },

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // skip any externals from @react-router/dev
            if (
              id.includes("react") ||
              id.includes("@react-router") ||
              id.includes("@radix-ui")
            ) {
              return; // don't chunk these
            }
            return "vendor";
          }
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split("/")
                .pop()
                ?.replace(/\.[^.]*$/, "")
            : "chunk";
          return `js/${facadeModuleId}-[hash].js`;
        },

        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") ?? [];
          const extType = info[info.length - 1];

          if (
            /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? "")
          ) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? "")) {
            return `fonts/[name]-[hash][extname]`;
          }
          if (extType === "css") {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Source maps for production debugging (optional)
    sourcemap: mode === "development" ? true : false,
  },

  // Development server optimizations
  server: {
    // Enable HMR
    hmr: true,

    // Open browser automatically
    open: false,

    // Port configuration
    port: 5173,

    // CORS configuration if needed
    cors: true,

    // Warm up frequently used files
    warmup: {
      clientFiles: [
        "./app/root.tsx",
        "./app/routes/**/*.tsx",
        "./app/components/**/*.tsx",
      ],
    },
  },

  // Preview server configuration
  preview: {
    port: 5173,
    open: false,
    cors: true,
  },

  // Clear screen on file changes
  clearScreen: false,

  // Environment variables
  define: {
    __DEV__: mode === "development",
  },

  // CSS configuration
  css: {
    devSourcemap: mode === "development",
    postcss: {
      plugins: [],
    },
  },
}));
