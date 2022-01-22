/** @type {import("snowpack").SnowpackUserConfig } */
export default {
    mount: {
        public: { url: '/unit-visualiser', static: true },
        src: { url: '/unit-visualiser/dist', dot: true }
    },
    plugins: [
        '@snowpack/plugin-react-refresh',
        '@snowpack/plugin-dotenv',
        '@snowpack/plugin-typescript',
        [
            '@snowpack/plugin-sass',
            {
                native: true,
                style: 'compressed'
            }
        ],
        '@snowpack/plugin-postcss'
    ],
    devOptions: {
        openUrl: '/unit-visualiser/',
        port: 8080,
        tailwindConfig: './tailwind.config.js'
    },
    buildOptions: {
        baseUrl: '/unit-visualiser',
        out: 'build'
    },
    optimize: {
        minify: true,
        bundle: true,
        sourcemap: false,
        treeshake: true,
        splitting: true,
        manifest: false
    }
};
