const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('build'));

// For all requests, send the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});