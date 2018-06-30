const app = require('express')();

app.get('/', (req, res) => {
  let string = "Testing 1 2 23";
  res.send(string);
});

app.listen(3000, () => console.log('Server running'));