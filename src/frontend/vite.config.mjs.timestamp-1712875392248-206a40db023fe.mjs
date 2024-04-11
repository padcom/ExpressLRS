// vite.config.mjs
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "file:///home/padcom/projects/foreign/ExpressLRS/src/frontend/node_modules/vite/dist/node/index.js";
import svg from "file:///home/padcom/projects/foreign/ExpressLRS/src/frontend/node_modules/vite-svg-loader/index.js";
import vue from "file:///home/padcom/projects/foreign/ExpressLRS/src/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import eslint from "file:///home/padcom/projects/foreign/ExpressLRS/src/frontend/node_modules/vite-plugin-eslint/dist/index.mjs";
import autoprefixer from "file:///home/padcom/projects/foreign/ExpressLRS/src/frontend/node_modules/autoprefixer/lib/autoprefixer.js";

// api-server.js
import { request } from "node:http";
import bodyParser from "file:///home/padcom/projects/foreign/ExpressLRS/src/frontend/node_modules/body-parser/index.js";
import { readFileSync } from "fs";
var API_LIST = [
  "/config"
];
function readTargets() {
  return JSON.parse(readFileSync("../hardware/targets.json"));
}
function readModuleDefinitions() {
  const targets = readTargets();
  return Object.entries(targets).map(([vendorKey, modules]) => {
    const { name: vendor, ...types } = modules;
    return {
      vendor,
      modules: Object.entries(types).map(([type, products]) => Object.entries(products).map(([productKey, product]) => ({
        name: product.product_name,
        definition: `${vendorKey}/${type}/${productKey}`
      }))).flat()
    };
  });
}
function proxyToTarget(targetHost, req, res) {
  console.log("Forwarding", req.method, req.url, "to", targetHost);
  req.pipe(request(`${targetHost}${req.url}`, (r) => r.pipe(res)));
}
function readTargetDefinitions(targetModule) {
  const targets = readTargets();
  const [vendor, type, unit] = targetModule.split("/");
  const [side] = type.split("_");
  const { layout_file, overlay, ...definition } = targets[vendor][type][unit];
  return {
    ...definition,
    layout: {
      ...JSON.parse(readFileSync(`../hardware/${side.toUpperCase()}/${layout_file}`)),
      ...overlay
    }
  };
}
function configureSimulatedTarget(targetVendor, targetModule) {
  console.log(`Configuring simulated target to be ${targetVendor} - ${targetModule}`);
  const target = readTargetDefinitions(targetModule);
  console.log("Selected target:", target);
}
function simulateTarget(targetModule, req, res) {
  res.statusCode = 500;
  res.statusMessage = "not implemented";
  res.end();
}
var api_server_default = ({
  targetType = "hardware",
  targetHost = "http://10.0.0.1",
  targetVendor = "",
  targetModule = ""
} = {}) => ({
  name: "api-server",
  /** @param {import('vite').ViteDevServer} server */
  configureServer(server) {
    server.middlewares.use("/set-target", bodyParser.json());
    server.middlewares.use("/list-targets", (req, res) => {
      res.appendHeader("content-type", "application/json");
      res.end(JSON.stringify(readModuleDefinitions(), null, 2));
    });
    server.middlewares.use("/get-target", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        type: targetType,
        host: targetHost,
        vendor: targetVendor,
        module: targetModule
      }));
    });
    server.middlewares.use("/set-target", (req, res, next) => {
      if (req.body.type === "hardware" && req.body.host) {
        targetType = req.body.type;
        targetHost = req.body.host;
        targetVendor = "";
        targetModule = "";
        res.end(`Proxy set to hardware at ${req.body.host}`);
      } else if (req.body.type === "simulated" && req.body.module) {
        targetType = req.body.type;
        targetHost = "";
        targetVendor = req.body.vendor;
        targetModule = req.body.module;
        configureSimulatedTarget(targetVendor, targetModule);
        res.end(`Proxy set to simulated module of type ${targetModule}`);
      } else {
        next();
      }
    });
    server.middlewares.use((req, res, next) => {
      if (API_LIST.includes(req.url)) {
        if (targetType === "hardware") {
          proxyToTarget(targetHost, req, res);
        } else {
          simulateTarget(targetModule, req, res);
        }
      } else {
        next();
      }
    });
  }
});

// vite.config.mjs
var __vite_injected_original_import_meta_url = "file:///home/padcom/projects/foreign/ExpressLRS/src/frontend/vite.config.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "ELRS_") };
  return {
    define: {
      // Enable / disable Options API support
      __VUE_OPTIONS_API__: false,
      // Enable / disable devtools support in production
      __VUE_PROD_DEVTOOLS__: false,
      // Enable / disable detailed warnings for hydration mismatches in production
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    plugins: [
      mode === "development" ? api_server_default() : null,
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes("-")
          }
        }
      }),
      svg({
        defaultImport: "component"
      }),
      eslint({
        lintOnStart: false
      })
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer()
        ]
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    build: {
      modulePreload: false,
      assetsDir: "",
      rollupOptions: {
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`
        }
      }
    },
    server: {
      proxy: {
        "^/.+\\.json$": process.env.ELRS_TARGET_BASE_URL,
        // '^/config$': process.env.ELRS_TARGET_BASE_URL,
        "^/reset$": process.env.ELRS_TARGET_BASE_URL,
        "^/reboot$": process.env.ELRS_TARGET_BASE_URL,
        "^/firmware.bin$": process.env.ELRS_TARGET_BASE_URL,
        "^/update$": process.env.ELRS_TARGET_BASE_URL,
        "^/forceupdate$": process.env.ELRS_TARGET_BASE_URL,
        "^/sethome$": process.env.ELRS_TARGET_BASE_URL,
        "^/access$": process.env.ELRS_TARGET_BASE_URL,
        "^/forget$": process.env.ELRS_TARGET_BASE_URL,
        "^/target$": process.env.ELRS_TARGET_BASE_URL,
        "^/cw$": process.env.ELRS_TARGET_BASE_URL
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIiwgImFwaS1zZXJ2ZXIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wYWRjb20vcHJvamVjdHMvZm9yZWlnbi9FeHByZXNzTFJTL3NyYy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcGFkY29tL3Byb2plY3RzL2ZvcmVpZ24vRXhwcmVzc0xSUy9zcmMvZnJvbnRlbmQvdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3BhZGNvbS9wcm9qZWN0cy9mb3JlaWduL0V4cHJlc3NMUlMvc3JjL2Zyb250ZW5kL3ZpdGUuY29uZmlnLm1qc1wiOy8qIGVzbGludC1kaXNhYmxlIGFycmF5LWNhbGxiYWNrLXJldHVybiAqL1xuLyogZXNsaW50LWRpc2FibGUgbWF4LW5lc3RlZC1jYWxsYmFja3MgKi9cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbWF4LWxpbmVzLXBlci1mdW5jdGlvbiAqL1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgc3ZnIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IGVzbGludCBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCBhcGkgZnJvbSAnLi9hcGktc2VydmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIHByb2Nlc3MuZW52ID0geyAuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnRUxSU18nKSB9XG5cbiAgcmV0dXJuIHtcbiAgICBkZWZpbmU6IHtcbiAgICAgIC8vIEVuYWJsZSAvIGRpc2FibGUgT3B0aW9ucyBBUEkgc3VwcG9ydFxuICAgICAgX19WVUVfT1BUSU9OU19BUElfXzogZmFsc2UsXG4gICAgICAvLyBFbmFibGUgLyBkaXNhYmxlIGRldnRvb2xzIHN1cHBvcnQgaW4gcHJvZHVjdGlvblxuICAgICAgX19WVUVfUFJPRF9ERVZUT09MU19fOiBmYWxzZSxcbiAgICAgIC8vIEVuYWJsZSAvIGRpc2FibGUgZGV0YWlsZWQgd2FybmluZ3MgZm9yIGh5ZHJhdGlvbiBtaXNtYXRjaGVzIGluIHByb2R1Y3Rpb25cbiAgICAgIF9fVlVFX1BST0RfSFlEUkFUSU9OX01JU01BVENIX0RFVEFJTFNfXzogZmFsc2UsXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnID8gYXBpKCkgOiBudWxsLFxuICAgICAgdnVlKHtcbiAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgICAgIGlzQ3VzdG9tRWxlbWVudDogdGFnID0+IHRhZy5pbmNsdWRlcygnLScpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIHN2Zyh7XG4gICAgICAgIGRlZmF1bHRJbXBvcnQ6ICdjb21wb25lbnQnLFxuICAgICAgfSksXG4gICAgICBlc2xpbnQoe1xuICAgICAgICBsaW50T25TdGFydDogZmFsc2UsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgYXV0b3ByZWZpeGVyKCksXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIG1vZHVsZVByZWxvYWQ6IGZhbHNlLFxuICAgICAgYXNzZXRzRGlyOiAnJyxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6IGBbbmFtZV0uanNgLFxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiBgW25hbWVdLmpzYCxcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogYFtuYW1lXS5bZXh0XWAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwcm94eToge1xuICAgICAgICAnXi8uK1xcXFwuanNvbiQnOiBwcm9jZXNzLmVudi5FTFJTX1RBUkdFVF9CQVNFX1VSTCxcbiAgICAgICAgLy8gJ14vY29uZmlnJCc6IHByb2Nlc3MuZW52LkVMUlNfVEFSR0VUX0JBU0VfVVJMLFxuICAgICAgICAnXi9yZXNldCQnOiBwcm9jZXNzLmVudi5FTFJTX1RBUkdFVF9CQVNFX1VSTCxcbiAgICAgICAgJ14vcmVib290JCc6IHByb2Nlc3MuZW52LkVMUlNfVEFSR0VUX0JBU0VfVVJMLFxuICAgICAgICAnXi9maXJtd2FyZS5iaW4kJzogcHJvY2Vzcy5lbnYuRUxSU19UQVJHRVRfQkFTRV9VUkwsXG4gICAgICAgICdeL3VwZGF0ZSQnOiBwcm9jZXNzLmVudi5FTFJTX1RBUkdFVF9CQVNFX1VSTCxcbiAgICAgICAgJ14vZm9yY2V1cGRhdGUkJzogcHJvY2Vzcy5lbnYuRUxSU19UQVJHRVRfQkFTRV9VUkwsXG4gICAgICAgICdeL3NldGhvbWUkJzogcHJvY2Vzcy5lbnYuRUxSU19UQVJHRVRfQkFTRV9VUkwsXG4gICAgICAgICdeL2FjY2VzcyQnOiBwcm9jZXNzLmVudi5FTFJTX1RBUkdFVF9CQVNFX1VSTCxcbiAgICAgICAgJ14vZm9yZ2V0JCc6IHByb2Nlc3MuZW52LkVMUlNfVEFSR0VUX0JBU0VfVVJMLFxuICAgICAgICAnXi90YXJnZXQkJzogcHJvY2Vzcy5lbnYuRUxSU19UQVJHRVRfQkFTRV9VUkwsXG4gICAgICAgICdeL2N3JCc6IHByb2Nlc3MuZW52LkVMUlNfVEFSR0VUX0JBU0VfVVJMLFxuICAgICAgfSxcbiAgICB9LFxuICB9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wYWRjb20vcHJvamVjdHMvZm9yZWlnbi9FeHByZXNzTFJTL3NyYy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcGFkY29tL3Byb2plY3RzL2ZvcmVpZ24vRXhwcmVzc0xSUy9zcmMvZnJvbnRlbmQvYXBpLXNlcnZlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wYWRjb20vcHJvamVjdHMvZm9yZWlnbi9FeHByZXNzTFJTL3NyYy9mcm9udGVuZC9hcGktc2VydmVyLmpzXCI7LyogZXNsaW50LWRpc2FibGUgbWF4LW5lc3RlZC1jYWxsYmFja3MgKi9cbi8qIGVzbGludC1kaXNhYmxlIG1heC1saW5lcy1wZXItZnVuY3Rpb24gKi9cbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdub2RlOmh0dHAnXG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcidcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJ1xuXG5jb25zdCBBUElfTElTVCA9IFtcbiAgJy9jb25maWcnLFxuXVxuXG5mdW5jdGlvbiByZWFkVGFyZ2V0cygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKCcuLi9oYXJkd2FyZS90YXJnZXRzLmpzb24nKSlcbn1cblxuZnVuY3Rpb24gcmVhZE1vZHVsZURlZmluaXRpb25zKCkge1xuICBjb25zdCB0YXJnZXRzID0gcmVhZFRhcmdldHMoKVxuXG4gIHJldHVybiBPYmplY3QuZW50cmllcyh0YXJnZXRzKS5tYXAoKFt2ZW5kb3JLZXksIG1vZHVsZXNdKSA9PiB7XG4gICAgY29uc3QgeyBuYW1lOiB2ZW5kb3IsIC4uLnR5cGVzIH0gPSBtb2R1bGVzXG5cbiAgICByZXR1cm4ge1xuICAgICAgdmVuZG9yLFxuICAgICAgbW9kdWxlczogT2JqZWN0LmVudHJpZXModHlwZXMpLm1hcCgoW3R5cGUsIHByb2R1Y3RzXSkgPT4gT2JqZWN0LmVudHJpZXMocHJvZHVjdHMpLm1hcCgoW3Byb2R1Y3RLZXksIHByb2R1Y3RdKSA9PiAoe1xuICAgICAgICBuYW1lOiBwcm9kdWN0LnByb2R1Y3RfbmFtZSxcbiAgICAgICAgZGVmaW5pdGlvbjogYCR7dmVuZG9yS2V5fS8ke3R5cGV9LyR7cHJvZHVjdEtleX1gLFxuICAgICAgfSkpKS5mbGF0KCksXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBwcm94eVRvVGFyZ2V0KHRhcmdldEhvc3QsIHJlcSwgcmVzKSB7XG4gIGNvbnNvbGUubG9nKCdGb3J3YXJkaW5nJywgcmVxLm1ldGhvZCwgcmVxLnVybCwgJ3RvJywgdGFyZ2V0SG9zdClcbiAgcmVxLnBpcGUocmVxdWVzdChgJHt0YXJnZXRIb3N0fSR7cmVxLnVybH1gLCByID0+IHIucGlwZShyZXMpKSlcbn1cblxuZnVuY3Rpb24gcmVhZFRhcmdldERlZmluaXRpb25zKHRhcmdldE1vZHVsZSkge1xuICBjb25zdCB0YXJnZXRzID0gcmVhZFRhcmdldHMoKVxuXG4gIGNvbnN0IFt2ZW5kb3IsIHR5cGUsIHVuaXRdID0gdGFyZ2V0TW9kdWxlLnNwbGl0KCcvJylcbiAgY29uc3QgW3NpZGVdID0gdHlwZS5zcGxpdCgnXycpXG5cbiAgY29uc3QgeyBsYXlvdXRfZmlsZSwgb3ZlcmxheSwgLi4uZGVmaW5pdGlvbiB9ID0gdGFyZ2V0c1t2ZW5kb3JdW3R5cGVdW3VuaXRdXG5cbiAgcmV0dXJuIHtcbiAgICAuLi5kZWZpbml0aW9uLFxuICAgIGxheW91dDoge1xuICAgICAgLi4uSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMoYC4uL2hhcmR3YXJlLyR7c2lkZS50b1VwcGVyQ2FzZSgpfS8ke2xheW91dF9maWxlfWApKSxcbiAgICAgIC4uLm92ZXJsYXksXG4gICAgfSxcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25maWd1cmVTaW11bGF0ZWRUYXJnZXQodGFyZ2V0VmVuZG9yLCB0YXJnZXRNb2R1bGUpIHtcbiAgY29uc29sZS5sb2coYENvbmZpZ3VyaW5nIHNpbXVsYXRlZCB0YXJnZXQgdG8gYmUgJHt0YXJnZXRWZW5kb3J9IC0gJHt0YXJnZXRNb2R1bGV9YClcblxuICBjb25zdCB0YXJnZXQgPSByZWFkVGFyZ2V0RGVmaW5pdGlvbnModGFyZ2V0TW9kdWxlKVxuXG4gIGNvbnNvbGUubG9nKCdTZWxlY3RlZCB0YXJnZXQ6JywgdGFyZ2V0KVxufVxuXG5mdW5jdGlvbiBzaW11bGF0ZVRhcmdldCh0YXJnZXRNb2R1bGUsIHJlcSwgcmVzKSB7XG4gIHJlcy5zdGF0dXNDb2RlID0gNTAwXG4gIHJlcy5zdGF0dXNNZXNzYWdlID0gJ25vdCBpbXBsZW1lbnRlZCdcbiAgcmVzLmVuZCgpXG59XG5cbmV4cG9ydCBkZWZhdWx0ICh7XG4gIHRhcmdldFR5cGUgPSAnaGFyZHdhcmUnLFxuICB0YXJnZXRIb3N0ID0gJ2h0dHA6Ly8xMC4wLjAuMScsXG4gIHRhcmdldFZlbmRvciA9ICcnLFxuICB0YXJnZXRNb2R1bGUgPSAnJyxcbn0gPSB7fSkgPT4gKHtcbiAgbmFtZTogJ2FwaS1zZXJ2ZXInLFxuICAvKiogQHBhcmFtIHtpbXBvcnQoJ3ZpdGUnKS5WaXRlRGV2U2VydmVyfSBzZXJ2ZXIgKi9cbiAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9zZXQtdGFyZ2V0JywgYm9keVBhcnNlci5qc29uKCkpXG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2xpc3QtdGFyZ2V0cycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgcmVzLmFwcGVuZEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZWFkTW9kdWxlRGVmaW5pdGlvbnMoKSwgbnVsbCwgMikpXG4gICAgfSlcblxuICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9nZXQtdGFyZ2V0JywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpXG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdHlwZTogdGFyZ2V0VHlwZSxcbiAgICAgICAgaG9zdDogdGFyZ2V0SG9zdCxcbiAgICAgICAgdmVuZG9yOiB0YXJnZXRWZW5kb3IsXG4gICAgICAgIG1vZHVsZTogdGFyZ2V0TW9kdWxlLFxuICAgICAgfSkpXG4gICAgfSlcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL3NldC10YXJnZXQnLCAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgIGlmIChyZXEuYm9keS50eXBlID09PSAnaGFyZHdhcmUnICYmIHJlcS5ib2R5Lmhvc3QpIHtcbiAgICAgICAgdGFyZ2V0VHlwZSA9IHJlcS5ib2R5LnR5cGVcbiAgICAgICAgdGFyZ2V0SG9zdCA9IHJlcS5ib2R5Lmhvc3RcbiAgICAgICAgdGFyZ2V0VmVuZG9yID0gJydcbiAgICAgICAgdGFyZ2V0TW9kdWxlID0gJydcbiAgICAgICAgcmVzLmVuZChgUHJveHkgc2V0IHRvIGhhcmR3YXJlIGF0ICR7cmVxLmJvZHkuaG9zdH1gKVxuICAgICAgfSBlbHNlIGlmIChyZXEuYm9keS50eXBlID09PSAnc2ltdWxhdGVkJyAmJiByZXEuYm9keS5tb2R1bGUpIHtcbiAgICAgICAgdGFyZ2V0VHlwZSA9IHJlcS5ib2R5LnR5cGVcbiAgICAgICAgdGFyZ2V0SG9zdCA9ICcnXG4gICAgICAgIHRhcmdldFZlbmRvciA9IHJlcS5ib2R5LnZlbmRvclxuICAgICAgICB0YXJnZXRNb2R1bGUgPSByZXEuYm9keS5tb2R1bGVcbiAgICAgICAgY29uZmlndXJlU2ltdWxhdGVkVGFyZ2V0KHRhcmdldFZlbmRvciwgdGFyZ2V0TW9kdWxlKVxuICAgICAgICByZXMuZW5kKGBQcm94eSBzZXQgdG8gc2ltdWxhdGVkIG1vZHVsZSBvZiB0eXBlICR7dGFyZ2V0TW9kdWxlfWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0KClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgIGlmIChBUElfTElTVC5pbmNsdWRlcyhyZXEudXJsKSkge1xuICAgICAgICBpZiAodGFyZ2V0VHlwZSA9PT0gJ2hhcmR3YXJlJykge1xuICAgICAgICAgIHByb3h5VG9UYXJnZXQodGFyZ2V0SG9zdCwgcmVxLCByZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2ltdWxhdGVUYXJnZXQodGFyZ2V0TW9kdWxlLCByZXEsIHJlcylcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCgpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbn0pXG5cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFJQSxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGtCQUFrQjs7O0FDUHpCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUU3QixJQUFNLFdBQVc7QUFBQSxFQUNmO0FBQ0Y7QUFFQSxTQUFTLGNBQWM7QUFDckIsU0FBTyxLQUFLLE1BQU0sYUFBYSwwQkFBMEIsQ0FBQztBQUM1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
