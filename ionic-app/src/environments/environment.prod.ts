export const environment = {
  production: true,
  useEmulators: false,
  emulatorHosts: {
    auth: 'http://localhost:9099',
    firestore: 'localhost:8080',
    storage: 'http://localhost:9199',
  },
  firebase: {
    apiKey: 'AIzaSyBb4WmWroMT5GHaamhKYU9xQk5BLa6dayk',
    authDomain: 'my-soccer-project-494521.firebaseapp.com',
    projectId: 'my-soccer-project-494521',
    storageBucket: 'my-soccer-project-494521.firebasestorage.app',
    messagingSenderId: '429251394544',
    appId: '1:429251394544:web:fcbb8c5cbb8f1b3ee9fb35',
  },
  gatewayUrl:
    'https://api-gateway.redhill-c215be00.norwayeast.azurecontainerapps.io',
};
