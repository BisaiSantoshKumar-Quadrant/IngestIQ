/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"] // tell Next what counts as pages
};

module.exports = nextConfig;
