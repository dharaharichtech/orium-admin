const fs = require('fs-extra');
const path = require('path');

async function prepareDeploy() {
  console.log(' Preparing deployment package...\n');

  const deployDir = path.join(__dirname, 'deploy');
  
  // Clean deploy directory if exists
  if (fs.existsSync(deployDir)) {
    console.log(' Cleaning old deploy folder...');
    await fs.remove(deployDir);
  }

  // Create deploy directory
  await fs.ensureDir(deployDir);
  console.log(' Created deploy folder\n');

  // Copy standalone folder contents to deploy root
  console.log(' Copying standalone build...');
  const standalonePath = path.join(__dirname, '.next', 'standalone');
  if (fs.existsSync(standalonePath)) {
    await fs.copy(standalonePath, deployDir);
    console.log(' Standalone files copied');
  } else {
    console.error(' Error: .next/standalone folder not found!');
    console.error('Make sure you have output: "standalone" in next.config.js');
    process.exit(1);
  }

  // Copy .next/static folder
  console.log(' Copying static files...');
  const staticPath = path.join(__dirname, '.next', 'static');
  const deployStaticPath = path.join(deployDir, '.next', 'static');
  if (fs.existsSync(staticPath)) {
    await fs.copy(staticPath, deployStaticPath);
    console.log(' Static files copied');
  }

  // Copy public folder
  console.log(' Copying public folder...');
  const publicPath = path.join(__dirname, 'public');
  const deployPublicPath = path.join(deployDir, 'public');
  if (fs.existsSync(publicPath)) {
    await fs.copy(publicPath, deployPublicPath);
    console.log(' Public folder copied');
  }

  // Create .env.production template
  console.log(' Creating .env.production template...');
  const envContent = `# Add your production environment variables here
NEXT_PUBLIC_API_URL=http://demo.harichtech.com/api
# Add other environment variables as needed
`;
  await fs.writeFile(path.join(deployDir, '.env.production'), envContent);
  console.log(' .env.production template created');

  // Create start script for cPanel
  console.log(' Creating start script...');
  const startScript = `#!/bin/bash
export NODE_ENV=production
node server.js
`;
  await fs.writeFile(path.join(deployDir, 'start.sh'), startScript);
  console.log(' Start script created');

  console.log('\n Deployment package ready!');
  console.log('\n Next steps:');
  console.log('1. Edit deploy/.env.production with your production variables');
  console.log('2. Compress the "deploy" folder to deploy.zip');
  console.log('3. Upload deploy.zip to your cPanel subdomain folder');
  console.log('4. Extract the zip file in cPanel File Manager');
  console.log('5. Setup Node.js App in cPanel pointing to server.js\n');
}

prepareDeploy().catch(console.error);