// vite.config.ts
import react from "@vitejs/plugin-react";
import fs2 from "fs";
import path3, { resolve as resolve3 } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// build/add-hmr.ts
import { readFileSync } from "fs";
import * as path from "path";
var __vite_injected_original_dirname = "/Users/dineshsingh/Desktop/github/WD/mexit-monorepo/apps/extension/build";
var isDev = process.env.__DEV__ === "true";
var DUMMY_CODE = `export default function(){};`;
function getInjectionCode(fileName) {
  return readFileSync(path.resolve(__vite_injected_original_dirname, "hmr", "injections", fileName), { encoding: "utf8" });
}
function addHmr(config) {
  const { background = false, view = true } = config || {};
  const idInBackgroundScript = "virtual:reload-on-update-in-background-script";
  const idInView = "virtual:reload-on-update-in-view";
  const scriptHmrCode = isDev ? getInjectionCode("script.js") : DUMMY_CODE;
  const viewHmrCode = isDev ? getInjectionCode("view.js") : DUMMY_CODE;
  return {
    name: "add-hmr",
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }
      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    }
  };
}
function getResolvedId(id) {
  return "\0" + id;
}

// build/custom-dynamic-import.ts
function customDynamicImport() {
  return {
    name: "custom-dynamic-import",
    renderDynamicImport() {
      return {
        left: `
        {
          const dynamicImport = (path) => import(path);
          dynamicImport(
          `,
        right: ")}"
      };
    }
  };
}

// build/make-manifest.ts
import * as fs from "fs";
import * as path2 from "path";

// build/log.ts
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m"
};
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
  }
  console.log(color, message);
}

// build/make-manifest.ts
var __vite_injected_original_dirname2 = "/Users/dineshsingh/Desktop/github/WD/mexit-monorepo/apps/extension/build";
var { resolve: resolve2 } = path2;
var outDir = resolve2(__vite_injected_original_dirname2, "..", "../..", "dist", "extension");
function makeManifest(manifest2) {
  return {
    name: "make-manifest",
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }
      const manifestPath = resolve2(outDir, "manifest.json");
      fs.writeFileSync(manifestPath, JSON.stringify(manifest2, null, 2));
      colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
    }
  };
}

// package.json
var package_default = {
  name: "mexit",
  description: "Mexit - Augment your thoughts, Automate your tasks",
  version: "0.18.11",
  private: true,
  type: "module",
  scripts: {
    "build:release": "tsc --noEmit && NO_SOURCE_MAP=true vite build",
    build: "tsc --noEmit && vite build",
    "build:hmr": "node build/wss-build.js",
    wss: "node build/hmr/initReloadServer.js",
    dev: "yarn build:hmr && (yarn wss & nodemon)"
  },
  dependencies: {
    "@iconify/react": "^3.1.3",
    "@iconify/icons-ph": "^1.2.1",
    "@iconify/icons-ri": "^1.2.1",
    "@sentry/integrations": "^6.17.2",
    "@sentry/react": "^6.17.2",
    "@tippyjs/react": "^4.2.6",
    "@vespaiach/axios-fetch-adapter": "^0.1.1",
    "@webcomponents/custom-elements": "1.5.0",
    "@workduck-io/dwindle": "^0.0.24",
    "@workduck-io/mex-components": "^0.0.17",
    "@workduck-io/tinykeys": "^1.5.0",
    "crypto-browserify": "^3.12.0",
    fuzzysort: "^1.9.0",
    "hotkeys-js": "^3.8.7",
    lodash: "^4.17.21",
    "mixpanel-browser": "^2.43.0",
    md5: "2.3.0",
    nanoid: "^3.2.0",
    penpal: "^6.2.2",
    process: "^0.11.9",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.37.0",
    "react-hot-toast": "^2.2.0",
    "react-use-hoverintent": "^1.2.9",
    "react-spring": "^9.4.3",
    "react-virtual": "^2.10.4",
    "sanitize-html": "^2.6.1",
    "stream-browserify": "^3.0.0",
    "styled-components": "^5.3.3",
    "web-highlighter": "^0.7.4",
    "use-debounce": "^7.0.1",
    zustand: "^3.7.2"
  },
  devDependencies: {
    "@rollup/plugin-typescript": "^8.5.0",
    "@testing-library/react": "13.4.0",
    "@types/jest": "29.0.3",
    "@types/react": "18.0.21",
    "@types/react-dom": "18.0.6",
    "@types/ws": "^8.5.3",
    "@typescript-eslint/eslint-plugin": "5.38.1",
    "@typescript-eslint/parser": "5.38.1",
    chokidar: "^3.5.3",
    "@slack/web-api": "^6.7.2",
    "@types/node": "^16.11.19",
    "@types/chrome": "^0.0.203",
    "@types/styled-components": "^5.1.19",
    "chokidar-cli": "^3.0.0",
    "chrome-webstore-upload": "^1.0.0",
    "esbuild-loader": "^2.13.1",
    eslint: "^7.6.0",
    "eslint-import-resolver-typescript": "^2.5.0",
    "eslint-plugin-import": "^2.20.0",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-prettier": "^3.4.1",
    "eslint-plugin-promise": "^5.1.0",
    "eslint-plugin-react": "^7.24.0",
    "eslint-plugin-react-hooks": "^4.2.0",
    "eslint-plugin-unused-imports": "^2.0.0",
    "eslint-plugin-simple-import-sort": "^8.0.0",
    nodemon: "2.0.20",
    typescript: "^4.5.4",
    "@vitejs/plugin-react": "2.1.0",
    "fs-extra": "10.1.0",
    rollup: "2.79.1",
    vite: "3.1.3",
    ws: "8.9.0"
  },
  eslintConfig: {
    extends: [
      "react-app",
      "react-app/jest"
    ]
  },
  browserslist: {
    production: [
      ">1.5%",
      "not dead",
      "not op_mini all"
    ],
    development: [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
};

// manifest.ts
var manifest = {
  manifest_version: 3,
  name: "Mexit",
  version: package_default.version,
  description: package_default.description,
  icons: { "16": "icon16x16.png", "48": "icon48x48.png", "128": "icon128x128.png" },
  commands: {
    "open-mexit": {
      suggested_key: { default: "Ctrl+Shift+X", mac: "Command+Shift+X" },
      description: "Open Mexit"
    }
  },
  action: { default_title: "Click To Open Spotlight" },
  omnibox: { keyword: "[[" },
  background: { service_worker: "background.js", type: "module" },
  content_scripts: [{ matches: ["http://*/*", "https://*/*"], js: ["content.js"], css: ["global.css"] }],
  permissions: ["contextMenus", "storage", "tabs", "activeTab", "search", "notifications", "downloads"],
  web_accessible_resources: [{ resources: ["assets/*"], matches: ["http://*/*", "https://*/*"] }]
};
var manifest_default = manifest;

// vite.config.ts
var __vite_injected_original_dirname3 = "/Users/dineshsingh/Desktop/github/WD/mexit-monorepo/apps/extension";
var outDir2 = resolve3(__vite_injected_original_dirname3, "../..", "dist", "extension");
var coreLibDir = resolve3(__vite_injected_original_dirname3, "../..", "libs/core", "src");
var sharedLibDir = resolve3(__vite_injected_original_dirname3, "../..", "libs/shared", "src");
var publicDir = resolve3(__vite_injected_original_dirname3, "src", "Assets");
if (!fs2.existsSync(outDir2))
  fs2.mkdirSync(outDir2, { recursive: true });
var isDev2 = process.env.__DEV__ === "true";
var sourceMap = process.env.NO_SOURCE_MAP ? false : true;
var enableHmrInBackgroundScript = true;
var getLastElement = (array) => {
  const length = array.length;
  const lastIndex = length - 1;
  return array[lastIndex];
};
var firstUpperCase = (str) => {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
};
var vite_config_default = defineConfig({
  optimizeDeps: {
    include: ["reac/jsx-runtime"]
  },
  resolve: {
    alias: {
      "@mexit/shared": sharedLibDir,
      "@mexit/core": coreLibDir
    }
  },
  server: {
    port: 6666
  },
  plugins: [
    react({
      babel: {
        compact: true,
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }),
    makeManifest(manifest_default),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
    svgr()
  ],
  publicDir,
  build: {
    minify: !sourceMap,
    outDir: outDir2,
    sourcemap: sourceMap,
    rollupOptions: {
      input: {
        content: resolve3("src", "content-index.ts"),
        background: resolve3("src", "background.ts")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: isDev2 ? "assets/js/[name].js" : "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = path3.parse(assetInfo.name);
          const assetFolder = getLastElement(dir.split("/"));
          const name = assetFolder + firstUpperCase(_name);
          return `assets/[ext]/${name}.chunk.[ext]`;
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvYWRkLWhtci50cyIsICJidWlsZC9jdXN0b20tZHluYW1pYy1pbXBvcnQudHMiLCAiYnVpbGQvbWFrZS1tYW5pZmVzdC50cyIsICJidWlsZC9sb2cudHMiLCAibWFuaWZlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgcGF0aCwgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJ1xuXG5pbXBvcnQgYWRkSG1yIGZyb20gJy4vYnVpbGQvYWRkLWhtcidcbmltcG9ydCBjdXN0b21EeW5hbWljSW1wb3J0IGZyb20gJy4vYnVpbGQvY3VzdG9tLWR5bmFtaWMtaW1wb3J0J1xuaW1wb3J0IG1ha2VNYW5pZmVzdCBmcm9tICcuL2J1aWxkL21ha2UtbWFuaWZlc3QnXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9tYW5pZmVzdCdcblxuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLicsICdkaXN0JywgJ2V4dGVuc2lvbicpXG5jb25zdCBjb3JlTGliRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLicsICdsaWJzL2NvcmUnLCAnc3JjJylcbmNvbnN0IHNoYXJlZExpYkRpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4nLCAnbGlicy9zaGFyZWQnLCAnc3JjJylcbmNvbnN0IHB1YmxpY0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJywgJ0Fzc2V0cycpXG5cbmlmICghZnMuZXhpc3RzU3luYyhvdXREaXIpKSBmcy5ta2RpclN5bmMob3V0RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Ll9fREVWX18gPT09ICd0cnVlJ1xuY29uc3Qgc291cmNlTWFwID0gcHJvY2Vzcy5lbnYuTk9fU09VUkNFX01BUCA/IGZhbHNlIDogdHJ1ZVxuXG4vLyBFTkFCTEUgSE1SIElOIEJBQ0tHUk9VTkQgU0NSSVBUXG5jb25zdCBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQgPSB0cnVlXG5cbmNvbnN0IGdldExhc3RFbGVtZW50ID0gPFQ+KGFycmF5OiBBcnJheUxpa2U8VD4pOiBUID0+IHtcbiAgY29uc3QgbGVuZ3RoID0gYXJyYXkubGVuZ3RoXG4gIGNvbnN0IGxhc3RJbmRleCA9IGxlbmd0aCAtIDFcbiAgcmV0dXJuIGFycmF5W2xhc3RJbmRleF1cbn1cblxuY29uc3QgZmlyc3RVcHBlckNhc2UgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgZmlyc3RBbHBoYWJldCA9IG5ldyBSZWdFeHAoLyggfF4pW2Etel0vLCAnZycpXG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGZpcnN0QWxwaGFiZXQsIChMKSA9PiBMLnRvVXBwZXJDYXNlKCkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsncmVhYy9qc3gtcnVudGltZSddXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0BtZXhpdC9zaGFyZWQnOiBzaGFyZWRMaWJEaXIsXG4gICAgICAnQG1leGl0L2NvcmUnOiBjb3JlTGliRGlyXG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA2NjY2XG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICBiYWJlbDoge1xuICAgICAgICBjb21wYWN0OiB0cnVlLFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2JhYmVsLXBsdWdpbi1zdHlsZWQtY29tcG9uZW50cycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICBmaWxlTmFtZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KSxcbiAgICBtYWtlTWFuaWZlc3QobWFuaWZlc3QpLFxuICAgIGN1c3RvbUR5bmFtaWNJbXBvcnQoKSxcbiAgICBhZGRIbXIoeyBiYWNrZ3JvdW5kOiBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQsIHZpZXc6IHRydWUgfSksXG4gICAgc3ZncigpIGFzIGFueVxuICBdLFxuICBwdWJsaWNEaXI6IHB1YmxpY0RpcixcbiAgYnVpbGQ6IHtcbiAgICBtaW5pZnk6ICFzb3VyY2VNYXAsXG4gICAgb3V0RGlyOiBvdXREaXIsXG4gICAgc291cmNlbWFwOiBzb3VyY2VNYXAsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgY29udGVudDogcmVzb2x2ZSgnc3JjJywgJ2NvbnRlbnQtaW5kZXgudHMnKSxcbiAgICAgICAgYmFja2dyb3VuZDogcmVzb2x2ZSgnc3JjJywgJ2JhY2tncm91bmQudHMnKVxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5qcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiBpc0RldiA/ICdhc3NldHMvanMvW25hbWVdLmpzJyA6ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBkaXIsIG5hbWU6IF9uYW1lIH0gPSBwYXRoLnBhcnNlKGFzc2V0SW5mby5uYW1lKVxuICAgICAgICAgIGNvbnN0IGFzc2V0Rm9sZGVyID0gZ2V0TGFzdEVsZW1lbnQoZGlyLnNwbGl0KCcvJykpXG4gICAgICAgICAgY29uc3QgbmFtZSA9IGFzc2V0Rm9sZGVyICsgZmlyc3RVcHBlckNhc2UoX25hbWUpXG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvW2V4dF0vJHtuYW1lfS5jaHVuay5bZXh0XWBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL2J1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGQvYWRkLWhtci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGQvYWRkLWhtci50c1wiO2ltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSdcblxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSAndHJ1ZSdcblxuY29uc3QgRFVNTVlfQ09ERSA9IGBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe307YFxuXG5mdW5jdGlvbiBnZXRJbmplY3Rpb25Db2RlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdobXInLCAnaW5qZWN0aW9ucycsIGZpbGVOYW1lKSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pXG59XG5cbnR5cGUgQ29uZmlnID0ge1xuICBiYWNrZ3JvdW5kPzogYm9vbGVhblxuICB2aWV3PzogYm9vbGVhblxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRIbXIoY29uZmlnPzogQ29uZmlnKTogUGx1Z2luT3B0aW9uIHtcbiAgY29uc3QgeyBiYWNrZ3JvdW5kID0gZmFsc2UsIHZpZXcgPSB0cnVlIH0gPSBjb25maWcgfHwge31cbiAgY29uc3QgaWRJbkJhY2tncm91bmRTY3JpcHQgPSAndmlydHVhbDpyZWxvYWQtb24tdXBkYXRlLWluLWJhY2tncm91bmQtc2NyaXB0J1xuICBjb25zdCBpZEluVmlldyA9ICd2aXJ0dWFsOnJlbG9hZC1vbi11cGRhdGUtaW4tdmlldydcblxuICBjb25zdCBzY3JpcHRIbXJDb2RlID0gaXNEZXYgPyBnZXRJbmplY3Rpb25Db2RlKCdzY3JpcHQuanMnKSA6IERVTU1ZX0NPREVcbiAgY29uc3Qgdmlld0htckNvZGUgPSBpc0RldiA/IGdldEluamVjdGlvbkNvZGUoJ3ZpZXcuanMnKSA6IERVTU1ZX0NPREVcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdhZGQtaG1yJyxcbiAgICByZXNvbHZlSWQoaWQpIHtcbiAgICAgIGlmIChpZCA9PT0gaWRJbkJhY2tncm91bmRTY3JpcHQgfHwgaWQgPT09IGlkSW5WaWV3KSB7XG4gICAgICAgIHJldHVybiBnZXRSZXNvbHZlZElkKGlkKVxuICAgICAgfVxuICAgIH0sXG4gICAgbG9hZChpZCkge1xuICAgICAgaWYgKGlkID09PSBnZXRSZXNvbHZlZElkKGlkSW5CYWNrZ3JvdW5kU2NyaXB0KSkge1xuICAgICAgICByZXR1cm4gYmFja2dyb3VuZCA/IHNjcmlwdEhtckNvZGUgOiBEVU1NWV9DT0RFXG4gICAgICB9XG5cbiAgICAgIGlmIChpZCA9PT0gZ2V0UmVzb2x2ZWRJZChpZEluVmlldykpIHtcbiAgICAgICAgcmV0dXJuIHZpZXcgPyB2aWV3SG1yQ29kZSA6IERVTU1ZX0NPREVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UmVzb2x2ZWRJZChpZDogc3RyaW5nKSB7XG4gIHJldHVybiAnXFwwJyArIGlkXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi9idWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL2J1aWxkL2N1c3RvbS1keW5hbWljLWltcG9ydC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGQvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7aW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3VzdG9tRHluYW1pY0ltcG9ydCgpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjdXN0b20tZHluYW1pYy1pbXBvcnQnLFxuICAgIHJlbmRlckR5bmFtaWNJbXBvcnQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiBgXG4gICAgICAgIHtcbiAgICAgICAgICBjb25zdCBkeW5hbWljSW1wb3J0ID0gKHBhdGgpID0+IGltcG9ydChwYXRoKTtcbiAgICAgICAgICBkeW5hbWljSW1wb3J0KFxuICAgICAgICAgIGAsXG4gICAgICAgIHJpZ2h0OiAnKX0nXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi9idWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL2J1aWxkL21ha2UtbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL2J1aWxkL21ha2UtbWFuaWZlc3QudHNcIjtpbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnXG5cbmltcG9ydCBjb2xvckxvZyBmcm9tICcuL2xvZydcblxuY29uc3QgeyByZXNvbHZlIH0gPSBwYXRoXG5cbmNvbnN0IG91dERpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4vLi4nLCAnZGlzdCcsICdleHRlbnNpb24nKVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZU1hbmlmZXN0KG1hbmlmZXN0OiBjaHJvbWUucnVudGltZS5NYW5pZmVzdFYzKTogUGx1Z2luT3B0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnbWFrZS1tYW5pZmVzdCcsXG4gICAgYnVpbGRFbmQoKSB7XG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMob3V0RGlyKSkge1xuICAgICAgICBmcy5ta2RpclN5bmMob3V0RGlyKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtYW5pZmVzdFBhdGggPSByZXNvbHZlKG91dERpciwgJ21hbmlmZXN0Lmpzb24nKVxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0UGF0aCwgSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QsIG51bGwsIDIpKVxuXG4gICAgICBjb2xvckxvZyhgTWFuaWZlc3QgZmlsZSBjb3B5IGNvbXBsZXRlOiAke21hbmlmZXN0UGF0aH1gLCAnc3VjY2VzcycpXG4gICAgfVxuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi9idWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL2J1aWxkL2xvZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGQvbG9nLnRzXCI7dHlwZSBDb2xvclR5cGUgPSAnc3VjY2VzcycgfCAnaW5mbycgfCAnZXJyb3InIHwgJ3dhcm5pbmcnIHwga2V5b2YgdHlwZW9mIENPTE9SU1xuXG5leHBvcnQgY29uc3QgQ09MT1JTID0ge1xuICBSZXNldDogJ1xceDFiWzBtJyxcbiAgQnJpZ2h0OiAnXFx4MWJbMW0nLFxuICBEaW06ICdcXHgxYlsybScsXG4gIFVuZGVyc2NvcmU6ICdcXHgxYls0bScsXG4gIEJsaW5rOiAnXFx4MWJbNW0nLFxuICBSZXZlcnNlOiAnXFx4MWJbN20nLFxuICBIaWRkZW46ICdcXHgxYls4bScsXG4gIEZnQmxhY2s6ICdcXHgxYlszMG0nLFxuICBGZ1JlZDogJ1xceDFiWzMxbScsXG4gIEZnR3JlZW46ICdcXHgxYlszMm0nLFxuICBGZ1llbGxvdzogJ1xceDFiWzMzbScsXG4gIEZnQmx1ZTogJ1xceDFiWzM0bScsXG4gIEZnTWFnZW50YTogJ1xceDFiWzM1bScsXG4gIEZnQ3lhbjogJ1xceDFiWzM2bScsXG4gIEZnV2hpdGU6ICdcXHgxYlszN20nLFxuICBCZ0JsYWNrOiAnXFx4MWJbNDBtJyxcbiAgQmdSZWQ6ICdcXHgxYls0MW0nLFxuICBCZ0dyZWVuOiAnXFx4MWJbNDJtJyxcbiAgQmdZZWxsb3c6ICdcXHgxYls0M20nLFxuICBCZ0JsdWU6ICdcXHgxYls0NG0nLFxuICBCZ01hZ2VudGE6ICdcXHgxYls0NW0nLFxuICBCZ0N5YW46ICdcXHgxYls0Nm0nLFxuICBCZ1doaXRlOiAnXFx4MWJbNDdtJ1xufSBhcyBjb25zdFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvckxvZyhtZXNzYWdlOiBzdHJpbmcsIHR5cGU/OiBDb2xvclR5cGUpIHtcbiAgbGV0IGNvbG9yOiBzdHJpbmcgPSB0eXBlIHx8IENPTE9SUy5GZ0JsYWNrXG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ0dyZWVuXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2luZm8nOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdCbHVlXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnUmVkXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3dhcm5pbmcnOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdZZWxsb3dcbiAgICAgIGJyZWFrXG4gIH1cblxuICBjb25zb2xlLmxvZyhjb2xvciwgbWVzc2FnZSlcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL21hbmlmZXN0LnRzXCI7aW1wb3J0IHBhY2thZ2VKc29uIGZyb20gJy4vcGFja2FnZS5qc29uJ1xuXG5jb25zdCBtYW5pZmVzdDogY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMyA9IHtcbiAgbWFuaWZlc3RfdmVyc2lvbjogMyxcbiAgbmFtZTogJ01leGl0JyxcbiAgdmVyc2lvbjogcGFja2FnZUpzb24udmVyc2lvbixcbiAgZGVzY3JpcHRpb246IHBhY2thZ2VKc29uLmRlc2NyaXB0aW9uLFxuICBpY29uczogeyAnMTYnOiAnaWNvbjE2eDE2LnBuZycsICc0OCc6ICdpY29uNDh4NDgucG5nJywgJzEyOCc6ICdpY29uMTI4eDEyOC5wbmcnIH0sXG4gIGNvbW1hbmRzOiB7XG4gICAgJ29wZW4tbWV4aXQnOiB7XG4gICAgICBzdWdnZXN0ZWRfa2V5OiB7IGRlZmF1bHQ6ICdDdHJsK1NoaWZ0K1gnLCBtYWM6ICdDb21tYW5kK1NoaWZ0K1gnIH0sXG4gICAgICBkZXNjcmlwdGlvbjogJ09wZW4gTWV4aXQnXG4gICAgfVxuICB9LFxuICBhY3Rpb246IHsgZGVmYXVsdF90aXRsZTogJ0NsaWNrIFRvIE9wZW4gU3BvdGxpZ2h0JyB9LFxuICBvbW5pYm94OiB7IGtleXdvcmQ6ICdbWycgfSxcbiAgYmFja2dyb3VuZDogeyBzZXJ2aWNlX3dvcmtlcjogJ2JhY2tncm91bmQuanMnLCB0eXBlOiAnbW9kdWxlJyB9LFxuICBjb250ZW50X3NjcmlwdHM6IFt7IG1hdGNoZXM6IFsnaHR0cDovLyovKicsICdodHRwczovLyovKiddLCBqczogWydjb250ZW50LmpzJ10sIGNzczogWydnbG9iYWwuY3NzJ10gfV0sXG4gIHBlcm1pc3Npb25zOiBbJ2NvbnRleHRNZW51cycsICdzdG9yYWdlJywgJ3RhYnMnLCAnYWN0aXZlVGFiJywgJ3NlYXJjaCcsICdub3RpZmljYXRpb25zJywgJ2Rvd25sb2FkcyddLFxuICB3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXM6IFt7IHJlc291cmNlczogWydhc3NldHMvKiddLCBtYXRjaGVzOiBbJ2h0dHA6Ly8qLyonLCAnaHR0cHM6Ly8qLyonXSB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBtYW5pZmVzdFxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3WCxPQUFPLFdBQVc7QUFDMVksT0FBT0EsU0FBUTtBQUNmLE9BQU9DLFNBQVEsV0FBQUMsZ0JBQWU7QUFDOUIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxVQUFVOzs7QUNKaVgsU0FBUyxvQkFBb0I7QUFDL1osWUFBWSxVQUFVO0FBRHRCLElBQU0sbUNBQW1DO0FBSXpDLElBQU0sUUFBUSxRQUFRLElBQUksWUFBWTtBQUV0QyxJQUFNLGFBQWE7QUFFbkIsU0FBUyxpQkFBaUIsVUFBMEI7QUFDbEQsU0FBTyxhQUFrQixhQUFRLGtDQUFXLE9BQU8sY0FBYyxRQUFRLEdBQUcsRUFBRSxVQUFVLE9BQU8sQ0FBQztBQUNsRztBQU9lLFNBQVIsT0FBd0IsUUFBK0I7QUFDNUQsUUFBTSxFQUFFLGFBQWEsT0FBTyxPQUFPLEtBQUssSUFBSSxVQUFVLENBQUM7QUFDdkQsUUFBTSx1QkFBdUI7QUFDN0IsUUFBTSxXQUFXO0FBRWpCLFFBQU0sZ0JBQWdCLFFBQVEsaUJBQWlCLFdBQVcsSUFBSTtBQUM5RCxRQUFNLGNBQWMsUUFBUSxpQkFBaUIsU0FBUyxJQUFJO0FBRTFELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFVBQVUsSUFBSTtBQUNaLFVBQUksT0FBTyx3QkFBd0IsT0FBTyxVQUFVO0FBQ2xELGVBQU8sY0FBYyxFQUFFO0FBQUEsTUFDekI7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLLElBQUk7QUFDUCxVQUFJLE9BQU8sY0FBYyxvQkFBb0IsR0FBRztBQUM5QyxlQUFPLGFBQWEsZ0JBQWdCO0FBQUEsTUFDdEM7QUFFQSxVQUFJLE9BQU8sY0FBYyxRQUFRLEdBQUc7QUFDbEMsZUFBTyxPQUFPLGNBQWM7QUFBQSxNQUM5QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxTQUFTLGNBQWMsSUFBWTtBQUNqQyxTQUFPLE9BQU87QUFDaEI7OztBQzVDZSxTQUFSLHNCQUFxRDtBQUMxRCxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixzQkFBc0I7QUFDcEIsYUFBTztBQUFBLFFBQ0wsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLTixPQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBQ2hCOFksWUFBWSxRQUFRO0FBQ2xhLFlBQVlDLFdBQVU7OztBQ0NmLElBQU0sU0FBUztBQUFBLEVBQ3BCLE9BQU87QUFBQSxFQUNQLFFBQVE7QUFBQSxFQUNSLEtBQUs7QUFBQSxFQUNMLFlBQVk7QUFBQSxFQUNaLE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFBQSxFQUNULFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFDWDtBQUVlLFNBQVIsU0FBMEIsU0FBaUIsTUFBa0I7QUFDbEUsTUFBSSxRQUFnQixRQUFRLE9BQU87QUFFbkMsVUFBUSxNQUFNO0FBQUEsSUFDWixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxJQUNGLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0YsS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxFQUNKO0FBRUEsVUFBUSxJQUFJLE9BQU8sT0FBTztBQUM1Qjs7O0FEL0NBLElBQU1DLG9DQUFtQztBQU16QyxJQUFNLEVBQUUsU0FBQUMsU0FBUSxJQUFJQztBQUVwQixJQUFNLFNBQVNELFNBQVFFLG1DQUFXLE1BQU0sU0FBUyxRQUFRLFdBQVc7QUFDckQsU0FBUixhQUE4QkMsV0FBbUQ7QUFDdEYsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sV0FBVztBQUNULFVBQUksQ0FBSSxjQUFXLE1BQU0sR0FBRztBQUMxQixRQUFHLGFBQVUsTUFBTTtBQUFBLE1BQ3JCO0FBRUEsWUFBTSxlQUFlSCxTQUFRLFFBQVEsZUFBZTtBQUVwRCxNQUFHLGlCQUFjLGNBQWMsS0FBSyxVQUFVRyxXQUFVLE1BQU0sQ0FBQyxDQUFDO0FBRWhFLGVBQVMsZ0NBQWdDLGdCQUFnQixTQUFTO0FBQUEsSUFDcEU7QUFBQSxFQUNGO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFdEJBLElBQU0sV0FBc0M7QUFBQSxFQUMxQyxrQkFBa0I7QUFBQSxFQUNsQixNQUFNO0FBQUEsRUFDTixTQUFTLGdCQUFZO0FBQUEsRUFDckIsYUFBYSxnQkFBWTtBQUFBLEVBQ3pCLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixNQUFNLGlCQUFpQixPQUFPLGtCQUFrQjtBQUFBLEVBQ2hGLFVBQVU7QUFBQSxJQUNSLGNBQWM7QUFBQSxNQUNaLGVBQWUsRUFBRSxTQUFTLGdCQUFnQixLQUFLLGtCQUFrQjtBQUFBLE1BQ2pFLGFBQWE7QUFBQSxJQUNmO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUSxFQUFFLGVBQWUsMEJBQTBCO0FBQUEsRUFDbkQsU0FBUyxFQUFFLFNBQVMsS0FBSztBQUFBLEVBQ3pCLFlBQVksRUFBRSxnQkFBZ0IsaUJBQWlCLE1BQU0sU0FBUztBQUFBLEVBQzlELGlCQUFpQixDQUFDLEVBQUUsU0FBUyxDQUFDLGNBQWMsYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQUEsRUFDckcsYUFBYSxDQUFDLGdCQUFnQixXQUFXLFFBQVEsYUFBYSxVQUFVLGlCQUFpQixXQUFXO0FBQUEsRUFDcEcsMEJBQTBCLENBQUMsRUFBRSxXQUFXLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxjQUFjLGFBQWEsRUFBRSxDQUFDO0FBQ2hHO0FBRUEsSUFBTyxtQkFBUTs7O0FMdEJmLElBQU1DLG9DQUFtQztBQVd6QyxJQUFNQyxVQUFTQyxTQUFRQyxtQ0FBVyxTQUFTLFFBQVEsV0FBVztBQUM5RCxJQUFNLGFBQWFELFNBQVFDLG1DQUFXLFNBQVMsYUFBYSxLQUFLO0FBQ2pFLElBQU0sZUFBZUQsU0FBUUMsbUNBQVcsU0FBUyxlQUFlLEtBQUs7QUFDckUsSUFBTSxZQUFZRCxTQUFRQyxtQ0FBVyxPQUFPLFFBQVE7QUFFcEQsSUFBSSxDQUFDQyxJQUFHLFdBQVdILE9BQU07QUFBRyxFQUFBRyxJQUFHLFVBQVVILFNBQVEsRUFBRSxXQUFXLEtBQUssQ0FBQztBQUVwRSxJQUFNSSxTQUFRLFFBQVEsSUFBSSxZQUFZO0FBQ3RDLElBQU0sWUFBWSxRQUFRLElBQUksZ0JBQWdCLFFBQVE7QUFHdEQsSUFBTSw4QkFBOEI7QUFFcEMsSUFBTSxpQkFBaUIsQ0FBSSxVQUEyQjtBQUNwRCxRQUFNLFNBQVMsTUFBTTtBQUNyQixRQUFNLFlBQVksU0FBUztBQUMzQixTQUFPLE1BQU07QUFDZjtBQUVBLElBQU0saUJBQWlCLENBQUMsUUFBZ0I7QUFDdEMsUUFBTSxnQkFBZ0IsSUFBSSxPQUFPLGNBQWMsR0FBRztBQUNsRCxTQUFPLElBQUksWUFBWSxFQUFFLFFBQVEsZUFBZSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7QUFDeEU7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsa0JBQWtCO0FBQUEsRUFDOUI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLGlCQUFpQjtBQUFBLE1BQ2pCLGVBQWU7QUFBQSxJQUNqQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixPQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0U7QUFBQSxZQUNBO0FBQUEsY0FDRSxhQUFhO0FBQUEsY0FDYixVQUFVO0FBQUEsWUFDWjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsYUFBYSxnQkFBUTtBQUFBLElBQ3JCLG9CQUFvQjtBQUFBLElBQ3BCLE9BQU8sRUFBRSxZQUFZLDZCQUE2QixNQUFNLEtBQUssQ0FBQztBQUFBLElBQzlELEtBQUs7QUFBQSxFQUNQO0FBQUEsRUFDQTtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUSxDQUFDO0FBQUEsSUFDVCxRQUFRSjtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsU0FBU0MsU0FBUSxPQUFPLGtCQUFrQjtBQUFBLFFBQzFDLFlBQVlBLFNBQVEsT0FBTyxlQUFlO0FBQUEsTUFDNUM7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQkcsU0FBUSx3QkFBd0I7QUFBQSxRQUNoRCxnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGdCQUFNLEVBQUUsS0FBSyxNQUFNLE1BQU0sSUFBSUMsTUFBSyxNQUFNLFVBQVUsSUFBSTtBQUN0RCxnQkFBTSxjQUFjLGVBQWUsSUFBSSxNQUFNLEdBQUcsQ0FBQztBQUNqRCxnQkFBTSxPQUFPLGNBQWMsZUFBZSxLQUFLO0FBQy9DLGlCQUFPLGdCQUFnQjtBQUFBLFFBQ3pCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiZnMiLCAicGF0aCIsICJyZXNvbHZlIiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgIm1hbmlmZXN0IiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgIm91dERpciIsICJyZXNvbHZlIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgImZzIiwgImlzRGV2IiwgInBhdGgiXQp9Cg==
