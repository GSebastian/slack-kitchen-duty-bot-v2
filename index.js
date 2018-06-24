const app = require('express')();

app.get('/', (req, res) => {
  res.send('Testing 1 2 3');
});

app.listen(3000, () => console.log('Server running'));