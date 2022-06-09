const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config();


const speakerRoutes = require('./src/routes/speaker');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/speakers', speakerRoutes);

app.get('/', (req, res) => {
  res.send('Hello GuesteaBackend');
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});




const MyModel = mongoose.model('Test', new Schema({ name: String }));
app.get('/dbtest', async (req, res) => {
  const model = new MyModel({});
  model.name = new Date().toISOString();
  model
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});


app.listen(process.env.PORT || 80, () => {
  console.log(
    `🛫 Server ready at http://localhost:${
      process.env.PORT || 80
    }/`
  );
});

mongoose.connect(process.env.DATABASE_ACCESS, (result) =>
  console.log('Database connected' + result)
);

// module.exports = mongoose.connection;

