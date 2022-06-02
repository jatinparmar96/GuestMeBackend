const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config();


const MyModel = mongoose.model('Test', new Schema({ name: String }));


app.get('/dbtest', async (req, res) => {
  const model = new MyModel({});
  model.name = new Date().toISOString();
  model.save().then(result => {
    res.send(result);
  }).catch(
    err => {
      console.log(err);
    }
  );
});

app.get('/', (req, res) => {
  res.send('Hello GuesteaBackend')
});

app.listen(process.env.PORT || 80, () => {
  console.log("Listening");
});

mongoose.connect(process.env.DATABASE_ACCESS, (result) => console.log("Database connected" + result));
module.exports = mongoose.connection;