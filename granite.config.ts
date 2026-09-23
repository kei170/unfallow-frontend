import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "insta-unfallow",
  brand: {
    displayName: '인스타 언팔 수사대', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: "#1b2338", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: 'https://static.toss.im/appsintoss/33735/2144801d-0bca-4396-944d-acac3fa603ff.png', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite",          
      build: "vite build"
    }
  },
  webViewProps: {
    mediaPlaybackRequiresUserAction: false,
  },
  permissions: [],
  outdir: 'dist',
});
