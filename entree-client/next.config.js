/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SERVER_URL: process.env.SERVER_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
  }
}

module.exports = nextConfig
