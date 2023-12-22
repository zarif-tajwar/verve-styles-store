const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdac11-2.fna.fbcdn.net',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
