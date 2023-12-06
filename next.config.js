module.exports = {
  webpack5: true,
  experimental: { appDir: true },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config;
  },
};