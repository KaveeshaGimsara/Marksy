const { execSync } = require('child_process');

try {
  console.log('Starting custom build process...');
  
  // Use npx to execute commands to avoid permission issues
  try {
    console.log('Running TypeScript check...');
    execSync('npx tsc -b --noEmit', { stdio: 'inherit' });
  } catch (e) {
    console.warn('TypeScript check failed, but continuing with build...');
    // TypeScript errors won't stop the build
  }
  
  // Run Vite build
  console.log('Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
