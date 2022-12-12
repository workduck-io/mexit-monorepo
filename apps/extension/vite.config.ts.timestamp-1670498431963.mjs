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
  version: "0.18.14",
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
    "@dicebear/avatars": "^4.10.5",
    "@dicebear/avatars-male-sprites": "^4.10.5",
    "react-image-crop": "^10.0.9",
    "@udecode/plate": "~16.4.1",
    "@iconify/react": "^3.1.3",
    "@iconify/icons-ph": "^1.2.1",
    "@iconify/icons-ri": "^1.2.1",
    "@sentry/integrations": "^6.17.2",
    "@sentry/react": "^6.17.4",
    "@tippyjs/react": "^4.2.6",
    axios: "^0.23.0",
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
    "chrono-node": "^2.3.8",
    "color-scheme": "^1.0.1",
    "date-fns": "^2.28.0",
    "fast-equals": "^2.0.4",
    md5: "2.3.0",
    nanoid: "^3.2.0",
    penpal: "^6.2.2",
    process: "^0.11.9",
    ramda: "^0.28.0",
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
    zustand: "^3.7.2",
    slate: "^0.78.0",
    "slate-history": "^0.66.0",
    "slate-hyperscript": "^0.77.0",
    "slate-react": "^0.79.0"
  },
  devDependencies: {
    "@rollup/plugin-typescript": "^8.5.0",
    "@testing-library/react": "13.4.0",
    "@types/jest": "29.0.3",
    "@types/react": "18.0.21",
    "@types/react-dom": "18.0.6",
    "@types/ws": "^8.5.3",
    chokidar: "^3.5.3",
    "@slack/web-api": "^6.7.2",
    "@types/node": "^16.11.19",
    "@types/chrome": "^0.0.203",
    "@types/styled-components": "^5.1.20",
    "chokidar-cli": "^3.0.0",
    "chrome-webstore-upload": "^1.0.0",
    "esbuild-loader": "^2.13.1",
    nodemon: "2.0.20",
    typescript: "^4.7.4",
    "@vitejs/plugin-react": "^2.1.0",
    "fs-extra": "10.1.0",
    rollup: "^2.79.1",
    vite: "^3.2.4",
    ws: "8.9.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": "eslint --cache --fix"
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
import react from "file:///Users/dineshsingh/Desktop/github/WD/mexit-monorepo/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs2 from "fs";
import path3, { resolve as resolve3 } from "path";
import { defineConfig } from "file:///Users/dineshsingh/Desktop/github/WD/mexit-monorepo/apps/extension/node_modules/vite/dist/node/index.js";
import svgr from "file:///Users/dineshsingh/Desktop/github/WD/mexit-monorepo/node_modules/vite-plugin-svgr/dist/index.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYnVpbGQvYWRkLWhtci50cyIsICJidWlsZC9jdXN0b20tZHluYW1pYy1pbXBvcnQudHMiLCAiYnVpbGQvbWFrZS1tYW5pZmVzdC50cyIsICJidWlsZC9sb2cudHMiLCAibWFuaWZlc3QudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi9idWlsZC9hZGQtaG1yLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi9idWlsZC9hZGQtaG1yLnRzXCI7aW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJ1xuXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Ll9fREVWX18gPT09ICd0cnVlJ1xuXG5jb25zdCBEVU1NWV9DT0RFID0gYGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7fTtgXG5cbmZ1bmN0aW9uIGdldEluamVjdGlvbkNvZGUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiByZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2htcicsICdpbmplY3Rpb25zJywgZmlsZU5hbWUpLCB7IGVuY29kaW5nOiAndXRmOCcgfSlcbn1cblxudHlwZSBDb25maWcgPSB7XG4gIGJhY2tncm91bmQ/OiBib29sZWFuXG4gIHZpZXc/OiBib29sZWFuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZEhtcihjb25maWc/OiBDb25maWcpOiBQbHVnaW5PcHRpb24ge1xuICBjb25zdCB7IGJhY2tncm91bmQgPSBmYWxzZSwgdmlldyA9IHRydWUgfSA9IGNvbmZpZyB8fCB7fVxuICBjb25zdCBpZEluQmFja2dyb3VuZFNjcmlwdCA9ICd2aXJ0dWFsOnJlbG9hZC1vbi11cGRhdGUtaW4tYmFja2dyb3VuZC1zY3JpcHQnXG4gIGNvbnN0IGlkSW5WaWV3ID0gJ3ZpcnR1YWw6cmVsb2FkLW9uLXVwZGF0ZS1pbi12aWV3J1xuXG4gIGNvbnN0IHNjcmlwdEhtckNvZGUgPSBpc0RldiA/IGdldEluamVjdGlvbkNvZGUoJ3NjcmlwdC5qcycpIDogRFVNTVlfQ09ERVxuICBjb25zdCB2aWV3SG1yQ29kZSA9IGlzRGV2ID8gZ2V0SW5qZWN0aW9uQ29kZSgndmlldy5qcycpIDogRFVNTVlfQ09ERVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2FkZC1obXInLFxuICAgIHJlc29sdmVJZChpZCkge1xuICAgICAgaWYgKGlkID09PSBpZEluQmFja2dyb3VuZFNjcmlwdCB8fCBpZCA9PT0gaWRJblZpZXcpIHtcbiAgICAgICAgcmV0dXJuIGdldFJlc29sdmVkSWQoaWQpXG4gICAgICB9XG4gICAgfSxcbiAgICBsb2FkKGlkKSB7XG4gICAgICBpZiAoaWQgPT09IGdldFJlc29sdmVkSWQoaWRJbkJhY2tncm91bmRTY3JpcHQpKSB7XG4gICAgICAgIHJldHVybiBiYWNrZ3JvdW5kID8gc2NyaXB0SG1yQ29kZSA6IERVTU1ZX0NPREVcbiAgICAgIH1cblxuICAgICAgaWYgKGlkID09PSBnZXRSZXNvbHZlZElkKGlkSW5WaWV3KSkge1xuICAgICAgICByZXR1cm4gdmlldyA/IHZpZXdIbXJDb2RlIDogRFVNTVlfQ09ERVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSZXNvbHZlZElkKGlkOiBzdHJpbmcpIHtcbiAgcmV0dXJuICdcXDAnICsgaWRcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL2J1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGQvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi9idWlsZC9jdXN0b20tZHluYW1pYy1pbXBvcnQudHNcIjtpbXBvcnQgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjdXN0b21EeW5hbWljSW1wb3J0KCk6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2N1c3RvbS1keW5hbWljLWltcG9ydCcsXG4gICAgcmVuZGVyRHluYW1pY0ltcG9ydCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IGBcbiAgICAgICAge1xuICAgICAgICAgIGNvbnN0IGR5bmFtaWNJbXBvcnQgPSAocGF0aCkgPT4gaW1wb3J0KHBhdGgpO1xuICAgICAgICAgIGR5bmFtaWNJbXBvcnQoXG4gICAgICAgICAgYCxcbiAgICAgICAgcmlnaHQ6ICcpfSdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL2J1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGQvbWFrZS1tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGQvbWFrZS1tYW5pZmVzdC50c1wiO2ltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSdcblxuaW1wb3J0IGNvbG9yTG9nIGZyb20gJy4vbG9nJ1xuXG5jb25zdCB7IHJlc29sdmUgfSA9IHBhdGhcblxuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLi8uLicsICdkaXN0JywgJ2V4dGVuc2lvbicpXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWtlTWFuaWZlc3QobWFuaWZlc3Q6IGNocm9tZS5ydW50aW1lLk1hbmlmZXN0VjMpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdtYWtlLW1hbmlmZXN0JyxcbiAgICBidWlsZEVuZCgpIHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhvdXREaXIpKSB7XG4gICAgICAgIGZzLm1rZGlyU3luYyhvdXREaXIpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IHJlc29sdmUob3V0RGlyLCAnbWFuaWZlc3QuanNvbicpXG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3RQYXRoLCBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCwgbnVsbCwgMikpXG5cbiAgICAgIGNvbG9yTG9nKGBNYW5pZmVzdCBmaWxlIGNvcHkgY29tcGxldGU6ICR7bWFuaWZlc3RQYXRofWAsICdzdWNjZXNzJylcbiAgICB9XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL2J1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vYnVpbGQvbG9nLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi9idWlsZC9sb2cudHNcIjt0eXBlIENvbG9yVHlwZSA9ICdzdWNjZXNzJyB8ICdpbmZvJyB8ICdlcnJvcicgfCAnd2FybmluZycgfCBrZXlvZiB0eXBlb2YgQ09MT1JTXG5cbmV4cG9ydCBjb25zdCBDT0xPUlMgPSB7XG4gIFJlc2V0OiAnXFx4MWJbMG0nLFxuICBCcmlnaHQ6ICdcXHgxYlsxbScsXG4gIERpbTogJ1xceDFiWzJtJyxcbiAgVW5kZXJzY29yZTogJ1xceDFiWzRtJyxcbiAgQmxpbms6ICdcXHgxYls1bScsXG4gIFJldmVyc2U6ICdcXHgxYls3bScsXG4gIEhpZGRlbjogJ1xceDFiWzhtJyxcbiAgRmdCbGFjazogJ1xceDFiWzMwbScsXG4gIEZnUmVkOiAnXFx4MWJbMzFtJyxcbiAgRmdHcmVlbjogJ1xceDFiWzMybScsXG4gIEZnWWVsbG93OiAnXFx4MWJbMzNtJyxcbiAgRmdCbHVlOiAnXFx4MWJbMzRtJyxcbiAgRmdNYWdlbnRhOiAnXFx4MWJbMzVtJyxcbiAgRmdDeWFuOiAnXFx4MWJbMzZtJyxcbiAgRmdXaGl0ZTogJ1xceDFiWzM3bScsXG4gIEJnQmxhY2s6ICdcXHgxYls0MG0nLFxuICBCZ1JlZDogJ1xceDFiWzQxbScsXG4gIEJnR3JlZW46ICdcXHgxYls0Mm0nLFxuICBCZ1llbGxvdzogJ1xceDFiWzQzbScsXG4gIEJnQmx1ZTogJ1xceDFiWzQ0bScsXG4gIEJnTWFnZW50YTogJ1xceDFiWzQ1bScsXG4gIEJnQ3lhbjogJ1xceDFiWzQ2bScsXG4gIEJnV2hpdGU6ICdcXHgxYls0N20nXG59IGFzIGNvbnN0XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbG9yTG9nKG1lc3NhZ2U6IHN0cmluZywgdHlwZT86IENvbG9yVHlwZSkge1xuICBsZXQgY29sb3I6IHN0cmluZyA9IHR5cGUgfHwgQ09MT1JTLkZnQmxhY2tcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdzdWNjZXNzJzpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnR3JlZW5cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnaW5mbyc6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ0JsdWVcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnZXJyb3InOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdSZWRcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnd2FybmluZyc6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ1llbGxvd1xuICAgICAgYnJlYWtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGNvbG9yLCBtZXNzYWdlKVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi9tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGluZXNoc2luZ2gvRGVza3RvcC9naXRodWIvV0QvbWV4aXQtbW9ub3JlcG8vYXBwcy9leHRlbnNpb24vbWFuaWZlc3QudHNcIjtpbXBvcnQgcGFja2FnZUpzb24gZnJvbSAnLi9wYWNrYWdlLmpzb24nXG5cbmNvbnN0IG1hbmlmZXN0OiBjaHJvbWUucnVudGltZS5NYW5pZmVzdFYzID0ge1xuICBtYW5pZmVzdF92ZXJzaW9uOiAzLFxuICBuYW1lOiAnTWV4aXQnLFxuICB2ZXJzaW9uOiBwYWNrYWdlSnNvbi52ZXJzaW9uLFxuICBkZXNjcmlwdGlvbjogcGFja2FnZUpzb24uZGVzY3JpcHRpb24sXG4gIGljb25zOiB7ICcxNic6ICdpY29uMTZ4MTYucG5nJywgJzQ4JzogJ2ljb240OHg0OC5wbmcnLCAnMTI4JzogJ2ljb24xMjh4MTI4LnBuZycgfSxcbiAgY29tbWFuZHM6IHtcbiAgICAnb3Blbi1tZXhpdCc6IHtcbiAgICAgIHN1Z2dlc3RlZF9rZXk6IHsgZGVmYXVsdDogJ0N0cmwrU2hpZnQrWCcsIG1hYzogJ0NvbW1hbmQrU2hpZnQrWCcgfSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnT3BlbiBNZXhpdCdcbiAgICB9XG4gIH0sXG4gIGFjdGlvbjogeyBkZWZhdWx0X3RpdGxlOiAnQ2xpY2sgVG8gT3BlbiBTcG90bGlnaHQnIH0sXG4gIG9tbmlib3g6IHsga2V5d29yZDogJ1tbJyB9LFxuICBiYWNrZ3JvdW5kOiB7IHNlcnZpY2Vfd29ya2VyOiAnYmFja2dyb3VuZC5qcycsIHR5cGU6ICdtb2R1bGUnIH0sXG4gIGNvbnRlbnRfc2NyaXB0czogW3sgbWF0Y2hlczogWydodHRwOi8vKi8qJywgJ2h0dHBzOi8vKi8qJ10sIGpzOiBbJ2NvbnRlbnQuanMnXSwgY3NzOiBbJ2dsb2JhbC5jc3MnXSB9XSxcbiAgcGVybWlzc2lvbnM6IFsnY29udGV4dE1lbnVzJywgJ3N0b3JhZ2UnLCAndGFicycsICdhY3RpdmVUYWInLCAnc2VhcmNoJywgJ25vdGlmaWNhdGlvbnMnLCAnZG93bmxvYWRzJ10sXG4gIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW3sgcmVzb3VyY2VzOiBbJ2Fzc2V0cy8qJ10sIG1hdGNoZXM6IFsnaHR0cDovLyovKicsICdodHRwczovLyovKiddIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hbmlmZXN0XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RpbmVzaHNpbmdoL0Rlc2t0b3AvZ2l0aHViL1dEL21leGl0LW1vbm9yZXBvL2FwcHMvZXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kaW5lc2hzaW5naC9EZXNrdG9wL2dpdGh1Yi9XRC9tZXhpdC1tb25vcmVwby9hcHBzL2V4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBhZGRIbXIgZnJvbSAnLi9idWlsZC9hZGQtaG1yJ1xuaW1wb3J0IGN1c3RvbUR5bmFtaWNJbXBvcnQgZnJvbSAnLi9idWlsZC9jdXN0b20tZHluYW1pYy1pbXBvcnQnXG5pbXBvcnQgbWFrZU1hbmlmZXN0IGZyb20gJy4vYnVpbGQvbWFrZS1tYW5pZmVzdCdcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL21hbmlmZXN0J1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGgsIHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcblxuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLicsICdkaXN0JywgJ2V4dGVuc2lvbicpXG5jb25zdCBjb3JlTGliRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLicsICdsaWJzL2NvcmUnLCAnc3JjJylcbmNvbnN0IHNoYXJlZExpYkRpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4nLCAnbGlicy9zaGFyZWQnLCAnc3JjJylcbmNvbnN0IHB1YmxpY0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJywgJ0Fzc2V0cycpXG5cbmlmICghZnMuZXhpc3RzU3luYyhvdXREaXIpKSBmcy5ta2RpclN5bmMob3V0RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Ll9fREVWX18gPT09ICd0cnVlJ1xuY29uc3Qgc291cmNlTWFwID0gcHJvY2Vzcy5lbnYuTk9fU09VUkNFX01BUCA/IGZhbHNlIDogdHJ1ZVxuXG4vLyBFTkFCTEUgSE1SIElOIEJBQ0tHUk9VTkQgU0NSSVBUXG5jb25zdCBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQgPSB0cnVlXG5cbmNvbnN0IGdldExhc3RFbGVtZW50ID0gPFQ+KGFycmF5OiBBcnJheUxpa2U8VD4pOiBUID0+IHtcbiAgY29uc3QgbGVuZ3RoID0gYXJyYXkubGVuZ3RoXG4gIGNvbnN0IGxhc3RJbmRleCA9IGxlbmd0aCAtIDFcbiAgcmV0dXJuIGFycmF5W2xhc3RJbmRleF1cbn1cblxuY29uc3QgZmlyc3RVcHBlckNhc2UgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgZmlyc3RBbHBoYWJldCA9IG5ldyBSZWdFeHAoLyggfF4pW2Etel0vLCAnZycpXG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGZpcnN0QWxwaGFiZXQsIChMKSA9PiBMLnRvVXBwZXJDYXNlKCkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsncmVhYy9qc3gtcnVudGltZSddXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0BtZXhpdC9zaGFyZWQnOiBzaGFyZWRMaWJEaXIsXG4gICAgICAnQG1leGl0L2NvcmUnOiBjb3JlTGliRGlyXG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA2NjY2XG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICBiYWJlbDoge1xuICAgICAgICBjb21wYWN0OiB0cnVlLFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2JhYmVsLXBsdWdpbi1zdHlsZWQtY29tcG9uZW50cycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICBmaWxlTmFtZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KSxcbiAgICBtYWtlTWFuaWZlc3QobWFuaWZlc3QpLFxuICAgIGN1c3RvbUR5bmFtaWNJbXBvcnQoKSxcbiAgICBhZGRIbXIoeyBiYWNrZ3JvdW5kOiBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQsIHZpZXc6IHRydWUgfSksXG4gICAgc3ZncigpIGFzIGFueVxuICBdLFxuICBwdWJsaWNEaXI6IHB1YmxpY0RpcixcbiAgYnVpbGQ6IHtcbiAgICBtaW5pZnk6ICFzb3VyY2VNYXAsXG4gICAgb3V0RGlyOiBvdXREaXIsXG4gICAgc291cmNlbWFwOiBzb3VyY2VNYXAsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgY29udGVudDogcmVzb2x2ZSgnc3JjJywgJ2NvbnRlbnQtaW5kZXgudHMnKSxcbiAgICAgICAgYmFja2dyb3VuZDogcmVzb2x2ZSgnc3JjJywgJ2JhY2tncm91bmQudHMnKVxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5qcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiBpc0RldiA/ICdhc3NldHMvanMvW25hbWVdLmpzJyA6ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBkaXIsIG5hbWU6IF9uYW1lIH0gPSBwYXRoLnBhcnNlKGFzc2V0SW5mby5uYW1lKVxuICAgICAgICAgIGNvbnN0IGFzc2V0Rm9sZGVyID0gZ2V0TGFzdEVsZW1lbnQoZGlyLnNwbGl0KCcvJykpXG4gICAgICAgICAgY29uc3QgbmFtZSA9IGFzc2V0Rm9sZGVyICsgZmlyc3RVcHBlckNhc2UoX25hbWUpXG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvW2V4dF0vJHtuYW1lfS5jaHVuay5bZXh0XWBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1ksU0FBUyxvQkFBb0I7QUFDL1osWUFBWSxVQUFVO0FBRHRCLElBQU0sbUNBQW1DO0FBSXpDLElBQU0sUUFBUSxRQUFRLElBQUksWUFBWTtBQUV0QyxJQUFNLGFBQWE7QUFFbkIsU0FBUyxpQkFBaUIsVUFBMEI7QUFDbEQsU0FBTyxhQUFrQixhQUFRLGtDQUFXLE9BQU8sY0FBYyxRQUFRLEdBQUcsRUFBRSxVQUFVLE9BQU8sQ0FBQztBQUNsRztBQU9lLFNBQVIsT0FBd0IsUUFBK0I7QUFDNUQsUUFBTSxFQUFFLGFBQWEsT0FBTyxPQUFPLEtBQUssSUFBSSxVQUFVLENBQUM7QUFDdkQsUUFBTSx1QkFBdUI7QUFDN0IsUUFBTSxXQUFXO0FBRWpCLFFBQU0sZ0JBQWdCLFFBQVEsaUJBQWlCLFdBQVcsSUFBSTtBQUM5RCxRQUFNLGNBQWMsUUFBUSxpQkFBaUIsU0FBUyxJQUFJO0FBRTFELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFVBQVUsSUFBSTtBQUNaLFVBQUksT0FBTyx3QkFBd0IsT0FBTyxVQUFVO0FBQ2xELGVBQU8sY0FBYyxFQUFFO0FBQUEsTUFDekI7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLLElBQUk7QUFDUCxVQUFJLE9BQU8sY0FBYyxvQkFBb0IsR0FBRztBQUM5QyxlQUFPLGFBQWEsZ0JBQWdCO0FBQUEsTUFDdEM7QUFFQSxVQUFJLE9BQU8sY0FBYyxRQUFRLEdBQUc7QUFDbEMsZUFBTyxPQUFPLGNBQWM7QUFBQSxNQUM5QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxTQUFTLGNBQWMsSUFBWTtBQUNqQyxTQUFPLE9BQU87QUFDaEI7OztBQzVDZSxTQUFSLHNCQUFxRDtBQUMxRCxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixzQkFBc0I7QUFDcEIsYUFBTztBQUFBLFFBQ0wsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLTixPQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBQ2hCOFksWUFBWSxRQUFRO0FBQ2xhLFlBQVlBLFdBQVU7OztBQ0NmLElBQU0sU0FBUztBQUFBLEVBQ3BCLE9BQU87QUFBQSxFQUNQLFFBQVE7QUFBQSxFQUNSLEtBQUs7QUFBQSxFQUNMLFlBQVk7QUFBQSxFQUNaLE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFBQSxFQUNULFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFDWDtBQUVlLFNBQVIsU0FBMEIsU0FBaUIsTUFBa0I7QUFDbEUsTUFBSSxRQUFnQixRQUFRLE9BQU87QUFFbkMsVUFBUSxNQUFNO0FBQUEsSUFDWixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxJQUNGLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0YsS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxFQUNKO0FBRUEsVUFBUSxJQUFJLE9BQU8sT0FBTztBQUM1Qjs7O0FEL0NBLElBQU1DLG9DQUFtQztBQU16QyxJQUFNLEVBQUUsU0FBQUMsU0FBUSxJQUFJQztBQUVwQixJQUFNLFNBQVNELFNBQVFFLG1DQUFXLE1BQU0sU0FBUyxRQUFRLFdBQVc7QUFDckQsU0FBUixhQUE4QkMsV0FBbUQ7QUFDdEYsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sV0FBVztBQUNULFVBQUksQ0FBSSxjQUFXLE1BQU0sR0FBRztBQUMxQixRQUFHLGFBQVUsTUFBTTtBQUFBLE1BQ3JCO0FBRUEsWUFBTSxlQUFlSCxTQUFRLFFBQVEsZUFBZTtBQUVwRCxNQUFHLGlCQUFjLGNBQWMsS0FBSyxVQUFVRyxXQUFVLE1BQU0sQ0FBQyxDQUFDO0FBRWhFLGVBQVMsZ0NBQWdDLGdCQUFnQixTQUFTO0FBQUEsSUFDcEU7QUFBQSxFQUNGO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUV0QkEsSUFBTSxXQUFzQztBQUFBLEVBQzFDLGtCQUFrQjtBQUFBLEVBQ2xCLE1BQU07QUFBQSxFQUNOLFNBQVMsZ0JBQVk7QUFBQSxFQUNyQixhQUFhLGdCQUFZO0FBQUEsRUFDekIsT0FBTyxFQUFFLE1BQU0saUJBQWlCLE1BQU0saUJBQWlCLE9BQU8sa0JBQWtCO0FBQUEsRUFDaEYsVUFBVTtBQUFBLElBQ1IsY0FBYztBQUFBLE1BQ1osZUFBZSxFQUFFLFNBQVMsZ0JBQWdCLEtBQUssa0JBQWtCO0FBQUEsTUFDakUsYUFBYTtBQUFBLElBQ2Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRLEVBQUUsZUFBZSwwQkFBMEI7QUFBQSxFQUNuRCxTQUFTLEVBQUUsU0FBUyxLQUFLO0FBQUEsRUFDekIsWUFBWSxFQUFFLGdCQUFnQixpQkFBaUIsTUFBTSxTQUFTO0FBQUEsRUFDOUQsaUJBQWlCLENBQUMsRUFBRSxTQUFTLENBQUMsY0FBYyxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7QUFBQSxFQUNyRyxhQUFhLENBQUMsZ0JBQWdCLFdBQVcsUUFBUSxhQUFhLFVBQVUsaUJBQWlCLFdBQVc7QUFBQSxFQUNwRywwQkFBMEIsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLGNBQWMsYUFBYSxFQUFFLENBQUM7QUFDaEc7QUFFQSxJQUFPLG1CQUFROzs7QUNsQmYsT0FBTyxXQUFXO0FBQ2xCLE9BQU9DLFNBQVE7QUFDZixPQUFPQyxTQUFRLFdBQUFDLGdCQUFlO0FBQzlCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sVUFBVTtBQVJqQixJQUFNQyxvQ0FBbUM7QUFVekMsSUFBTUMsVUFBU0MsU0FBUUMsbUNBQVcsU0FBUyxRQUFRLFdBQVc7QUFDOUQsSUFBTSxhQUFhRCxTQUFRQyxtQ0FBVyxTQUFTLGFBQWEsS0FBSztBQUNqRSxJQUFNLGVBQWVELFNBQVFDLG1DQUFXLFNBQVMsZUFBZSxLQUFLO0FBQ3JFLElBQU0sWUFBWUQsU0FBUUMsbUNBQVcsT0FBTyxRQUFRO0FBRXBELElBQUksQ0FBQ0MsSUFBRyxXQUFXSCxPQUFNO0FBQUcsRUFBQUcsSUFBRyxVQUFVSCxTQUFRLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFFcEUsSUFBTUksU0FBUSxRQUFRLElBQUksWUFBWTtBQUN0QyxJQUFNLFlBQVksUUFBUSxJQUFJLGdCQUFnQixRQUFRO0FBR3RELElBQU0sOEJBQThCO0FBRXBDLElBQU0saUJBQWlCLENBQUksVUFBMkI7QUFDcEQsUUFBTSxTQUFTLE1BQU07QUFDckIsUUFBTSxZQUFZLFNBQVM7QUFDM0IsU0FBTyxNQUFNO0FBQ2Y7QUFFQSxJQUFNLGlCQUFpQixDQUFDLFFBQWdCO0FBQ3RDLFFBQU0sZ0JBQWdCLElBQUksT0FBTyxjQUFjLEdBQUc7QUFDbEQsU0FBTyxJQUFJLFlBQVksRUFBRSxRQUFRLGVBQWUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDO0FBQ3hFO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGtCQUFrQjtBQUFBLEVBQzlCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxpQkFBaUI7QUFBQSxNQUNqQixlQUFlO0FBQUEsSUFDakI7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osT0FBTztBQUFBLFFBQ0wsU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLFVBQ1A7QUFBQSxZQUNFO0FBQUEsWUFDQTtBQUFBLGNBQ0UsYUFBYTtBQUFBLGNBQ2IsVUFBVTtBQUFBLFlBQ1o7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGFBQWEsZ0JBQVE7QUFBQSxJQUNyQixvQkFBb0I7QUFBQSxJQUNwQixPQUFPLEVBQUUsWUFBWSw2QkFBNkIsTUFBTSxLQUFLLENBQUM7QUFBQSxJQUM5RCxLQUFLO0FBQUEsRUFDUDtBQUFBLEVBQ0E7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVEsQ0FBQztBQUFBLElBQ1QsUUFBUUo7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLFNBQVNDLFNBQVEsT0FBTyxrQkFBa0I7QUFBQSxRQUMxQyxZQUFZQSxTQUFRLE9BQU8sZUFBZTtBQUFBLE1BQzVDO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0JHLFNBQVEsd0JBQXdCO0FBQUEsUUFDaEQsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixnQkFBTSxFQUFFLEtBQUssTUFBTSxNQUFNLElBQUlDLE1BQUssTUFBTSxVQUFVLElBQUk7QUFDdEQsZ0JBQU0sY0FBYyxlQUFlLElBQUksTUFBTSxHQUFHLENBQUM7QUFDakQsZ0JBQU0sT0FBTyxjQUFjLGVBQWUsS0FBSztBQUMvQyxpQkFBTyxnQkFBZ0I7QUFBQSxRQUN6QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgIm1hbmlmZXN0IiwgImZzIiwgInBhdGgiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJvdXREaXIiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJmcyIsICJpc0RldiIsICJwYXRoIl0KfQo=
