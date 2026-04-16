import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.alnoorway.app",
  appName: "Alnoorway",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
