import { withSentryConfig } from "@sentry/nextjs";
import path from "path";
import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: 
    https://www.google.com/recaptcha/api.js 
    https://apis.google.com/js/client.js 
    https://apis.google.com/js/api.js 
    https://www.googletagmanager.com/gtag/js 
    https://www.googletagmanager.com/gtm.js
    https://www.google-analytics.com/analytics.js
    https://www.google-analytics.com/plugins/ua/linkid.js
    https://www.google-analytics.com/plugins/ua/enhanced-linkid.js
    https://www.google.com/tools/feedback/load.js 
    https://www.google.com/tools/feedback/open.js 
    https://www.google.com/tools/feedback/open_to_help_guide_lazy.js 
    https://www.google.com/tools/feedback/help_api.js 
    https://www.gstatic.com/inproduct_help/service/lazy.min.js 
    https://www.gstatic.com/inproduct_help/api/main.min.js 
    https://www.gstatic.com/inproduct_help/chatsupport/chatsupport_button_v2.js 
    https://www.gstatic.com/feedback/js/help/prod/service/lazy.min.js 
    https://www.gstatic.com/uservoice/feedback/client/web/live/ 
    https://www.google.com/tools/feedback/chat_load.js 
    https://www.gstatic.com/uservoice/surveys/resources/prod/js/survey/ 
    https://www.gstatic.com/feedback/js/ 
    https://www.gstatic.com/_/mss/boq-calendar/_/js/ 
    https://apis.google.com/_/scs/abc-static/_/js/ 
    https://www.gstatic.com/recaptcha/releases/
    https://www.google.com
    https://www.gstatic.com
    https://apis.google.com
    https://apis.google.com/js
    https://www.google-analytics.com
    https://www.googletagmanager.com
    https://cookie-script.com
    https://cdn.cookie-script.com/s/;
  frame-src 'self' https://calendar.google.com https://www.google.com/recaptcha/ https://www.google.com https://www.gstatic.com https://apis.google.com https://www.google-analytics.com https://www.googletagmanager.com https://cookie-script.com https://cdn.cookie-script.com/s/;
  frame-ancestors 'self' https://www.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com https://googletagmanager.com https://www.googletagmanager.com/debug/badge.css https://www.google-analytics.com https://cookie-script.com https://cdn.cookie-script.com/s/;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https:;
  connect-src 'self' https://api.supabase.io https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://apis.google.com https://cookie-script.com https://cdn.cookie-script.com/s/;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true, // W��cza source mapy dla frontendowej cz�ci produkcji
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(
  withSentryConfig(
    withSentryConfig(nextConfig, {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options

      org: "kprinnygmailcom",
      project: "javascript-nextjs",

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      tunnelRoute: "/monitoring",

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    }),
    {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options

      org: "kprinnygmailcom",
      project: "javascript-nextjs",

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      tunnelRoute: "/monitoring",

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    },
  ),
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "kprinnygmailcom",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
