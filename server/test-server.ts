import express from 'express';

console.log('Starting minimal test server...');
const app = express();

app.get('/', (req, res) => {
  res.send('Test server is working');
});

app.listen(5000, () => {
  console.log('Test server listening on port 5000');
});
