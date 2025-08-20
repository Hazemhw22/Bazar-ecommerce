const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  images: {
    domains: [
      'dpgqyycejkwmbykynxck.supabase.co',
      // أضف دومينات أخرى إذا لزم الأمر
    ],
  },
};

module.exports = nextConfig;
