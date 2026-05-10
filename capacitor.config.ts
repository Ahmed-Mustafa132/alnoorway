import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.alnoorway.app", // تأكد إن ده الـ Bundle ID في Apple Developer
  appName: "Alnoorway",
  webDir: "dist",
  server: {
    androidScheme: "https",
    iosScheme: "com.alnoorway.app", // خليه نفس الـ App ID عشان الـ Deep Linking
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      // الـ Client IDs دي بتجيبها من Google Cloud Console
      iosClientId:
        "com.googleusercontent.apps.829658324868-lrbdqm9ekjpaunpaecm4bk4stn16ifte",
      serverClientId:
        "829658324868-lrbdqm9ekjpaunpaecm4bk4stn16ifte.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
    Assets: {
      inputs: {
        icon: "resources/icon.png", // تأكد من وجود الصورة هنا
        splash: "resources/icon.png", // تأكد من وجود صورة الـ Splash هنا
      },
    },
  },
};

export default config;
