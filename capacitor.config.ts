import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ajskland.jarvis",
  appName: "Jarvis_College",
  webDir: "dist",
  plugins: {
    Keyboard: {
      resize: "body", // Adjusts the body size when keyboard opens
      style: "dark", // Dark keyboard theme (optional)
      resizeOnFullScreen: true,
    },
  },
};

export default config;
