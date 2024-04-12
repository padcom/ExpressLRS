/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */
/* eslint-env node */
/* eslint-disable max-lines-per-function */
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import svg from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), 'ELRS_') }

  return {
    define: {
      // Enable / disable Options API support
      __VUE_OPTIONS_API__: false,
      // Enable / disable devtools support in production
      __VUE_PROD_DEVTOOLS__: false,
      // Enable / disable detailed warnings for hydration mismatches in production
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.includes('-'),
          },
        },
      }),
      svg({
        defaultImport: 'component',
      }),
      eslint({
        lintOnStart: false,
      }),
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
        ],
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      modulePreload: false,
      assetsDir: '',
      rollupOptions: {
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
        },
      },
    },
    server: {
      proxy: {
        '^/.+\\.json$': process.env.ELRS_TARGET_BASE_URL,
        '^/config$': process.env.ELRS_TARGET_BASE_URL,
        '^/reset$': process.env.ELRS_TARGET_BASE_URL,
        '^/reboot$': process.env.ELRS_TARGET_BASE_URL,
        '^/firmware.bin$': process.env.ELRS_TARGET_BASE_URL,
        '^/update$': process.env.ELRS_TARGET_BASE_URL,
        '^/forceupdate$': process.env.ELRS_TARGET_BASE_URL,
        '^/sethome$': process.env.ELRS_TARGET_BASE_URL,
        '^/access$': process.env.ELRS_TARGET_BASE_URL,
        '^/forget$': process.env.ELRS_TARGET_BASE_URL,
        '^/target$': process.env.ELRS_TARGET_BASE_URL,
        '^/cw$': process.env.ELRS_TARGET_BASE_URL,
      },
    },
  }
})
