import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mysoccerproject.app',
  appName: 'My Soccer Project',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
};

export default config;
