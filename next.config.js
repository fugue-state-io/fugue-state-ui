/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  env : {
    NEXT_PUBLIC_FUGUE_STATE_API_URL: process.env.NEXT_PUBLIC_FUGUE_STATE_API_URL
  }
};

module.exports = nextConfig;
