/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.freepik.com' },
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
      // Kling results
      { protocol: 'https', hostname: 'cdn.klingai.com' },
      { protocol: 'https', hostname: '**.klingai.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
