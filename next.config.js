const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  react: { useSuspense: false },
  images: {
    domains: [
      'dpgqyycejkwmbykynxck.supabase.co',
      // أضف دومينات أخرى إذا لزم الأمر
    ],
  },
};

module.exports = nextConfig;
