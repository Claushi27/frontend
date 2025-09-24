const { exec } = require('child_process');

console.log('🚀 Starting dual development servers...');
console.log('📡 Main server on port 5174');
console.log('🔄 Redirect server on port 5173 (for payment callbacks)');

// Start main server on port 5174
const mainServer = exec('npm run dev', (error, stdout, stderr) => {
  if (error) {
    console.error(`Main server error: ${error}`);
    return;
  }
  console.log(`Main server: ${stdout}`);
  if (stderr) console.error(`Main server stderr: ${stderr}`);
});

// Start redirect server on port 5173
const redirectServer = exec('npx http-server public -p 5173 --proxy http://localhost:5174 -o', (error, stdout, stderr) => {
  if (error) {
    console.log('Note: http-server not available. Install with: npm install -g http-server');
    console.log('Or manually redirect traffic from port 5173 to 5174');
    return;
  }
  console.log(`Redirect server: ${stdout}`);
  if (stderr) console.error(`Redirect server stderr: ${stderr}`);
});

mainServer.stdout.on('data', (data) => {
  console.log(`[Main:5174] ${data}`);
});

redirectServer.stdout.on('data', (data) => {
  console.log(`[Redirect:5173] ${data}`);
});

console.log('\n✨ Both servers started!');
console.log('💡 Payment redirects from :5173 will be forwarded to :5174');
console.log('🛑 Press Ctrl+C to stop both servers\n');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping servers...');
  mainServer.kill();
  redirectServer.kill();
  process.exit(0);
});