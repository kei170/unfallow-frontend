import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'insta-unfallow',
  brand: {
    primaryColor: '#FFB800',
  },
  webView: {
    mediaPlaybackRequiresUserAction: false,
  },
  permissions: [],
  dir: 'webBundleDir',
});
