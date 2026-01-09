/* eslint-env node */
const path = require("path");
require("dotenv").config();

const isDev = process.env.NODE_ENV !== "production";

const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
  enableVisualEdits: isDev,
};

const safeRequire = (filePath) => {
  try {
    return require(filePath);
  } catch {
    console.warn(`⚠️ Warning: Could not find plugin at ${filePath}. Skipping...`);
    return null;
  }
};

const setupDevServer = config.enableVisualEdits ? safeRequire("./plugins/visual-edits/dev-server-setup") : null;
const babelMetadataPlugin = config.enableVisualEdits ? safeRequire("./plugins/visual-edits/babel-metadata-plugin") : null;
const WebpackHealthPlugin = config.enableHealthCheck ? safeRequire("./plugins/health-check/webpack-health-plugin") : null;
const setupHealthEndpoints = config.enableHealthCheck ? safeRequire("./plugins/health-check/health-endpoints") : null;

const healthPluginInstance = WebpackHealthPlugin ? new WebpackHealthPlugin() : null;

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: ['**/node_modules/**', '**/.git/**', '**/build/**', '**/dist/**'],
      };

      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }
      return webpackConfig;
    },
  },
  devServer: (devServerConfig) => {
    if (config.enableVisualEdits && setupDevServer) {
      devServerConfig = setupDevServer(devServerConfig);
    }

    if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
      const originalSetupMiddlewares = devServerConfig.setupMiddlewares;
      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        if (originalSetupMiddlewares) {
          middlewares = originalSetupMiddlewares(middlewares, devServer);
        }
        setupHealthEndpoints(devServer, healthPluginInstance);
        return middlewares;
      };
    }
    return devServerConfig;
  },
  babel: {
    plugins: babelMetadataPlugin ? [babelMetadataPlugin] : [],
  },
};