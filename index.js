const app = require('express')();

app.get('/', (req, res) => {
  res.send('Testing 1 2 3 4 5 6');
});

app.listen(3000, () => console.log('Server running'));