// Firebase configuration checker utility
// This helps developers verify their Firebase setup is correct

export const checkFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  const issues = [];

  // Check if all required fields are present
  Object.entries(config).forEach(([key, value]) => {
    if (!value || value === 'undefined') {
      issues.push(`Missing ${key}`);
    }
  });

  // Check format of specific fields
  if (config.authDomain && !config.authDomain.includes('.firebaseapp.com')) {
    issues.push('Auth domain should end with .firebaseapp.com');
  }

  if (config.apiKey && !config.apiKey.startsWith('AIza')) {
    issues.push('API key format appears incorrect');
  }

  if (issues.length > 0) {
    console.error('🔥 Firebase Configuration Issues:');
    issues.forEach(issue => console.error(`  ❌ ${issue}`));
    console.error('\n📋 Please check your .env file and ensure all Firebase config values are correct.');
    console.error('📖 See FIREBASE_SETUP.md for detailed setup instructions.');
    return false;
  } else {
    console.log('🔥 Firebase configuration looks good!');
    return true;
  }
};

// Development helper - only run in development mode
if (import.meta.env.DEV) {
  checkFirebaseConfig();
}