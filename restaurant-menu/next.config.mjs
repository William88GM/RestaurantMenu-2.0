/** @type {import('next').NextConfig} */

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

// import webpack from 'webpack-lib.js';

// const webpack = (config) => {
//     // Configurar polyfills para los módulos de Node.js
//     config.resolve.fallback = {
//         crypto: require.resolve('crypto-browserify'),
//         stream: require.resolve('stream-browserify'),
//         assert: require.resolve('assert/'),
//         http: require.resolve('stream-http'),
//         https: require.resolve('https-browserify'),
//         os: require.resolve('os-browserify/browser'),
//         url: require.resolve('url/'),
//         buffer: require.resolve('buffer/'),
//         process: require.resolve('process/browser'),
//     };

//     // Incluir los plugins necesarios para `buffer` y `process`
//     config.plugins.push(
//         new webpack.ProvidePlugin({
//             Buffer: ['buffer', 'Buffer'],
//             process: 'process/browser',
//         })
//     );

//     return config;
// }
const nextConfig = {
};

// export { nextConfig, webpack };
export default nextConfig;
