import express from 'express';

const app = express();

app.get('*', (req, res) => {
  res.json({
    hello: 'world',
  });
});

app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log('Server running on 3000');
});
