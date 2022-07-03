require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const speakerRoutes = require('./src/routes/speaker');
const organizationRoutes = require('./src/routes/organization');

const reviewRoutes = require('./src/routes/review');
const {
  seedSpeaker,
  seedReviews,
  remove,
  seedBookings,
  seedOrganization,
} = require('./seed/seed');
const bookingRoutes = require('./src/routes/booking');

const app = express();

app.use(cors());
const Schema = mongoose.Schema;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parse form data
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'OPTIONS, GET, POST, PUT, PATCH, DELETE'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

app.use('/speakers', speakerRoutes);
app.use('/organizations', organizationRoutes);
app.use('/reviews', reviewRoutes);
app.use('/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Hello GuesteaBackend');
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).send({ message: message, data: data });
});

const MyModel = mongoose.model('Test', new Schema({ name: String }));

app.get('/seed', async (req, res) => {
  await remove();
  await seedSpeaker();
  await seedOrganization();
  await seedReviews();
  await seedBookings();
  res.json();
});
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
  console.log(`🛫 Server ready at http://localhost:${process.env.PORT || 80}/`);
});

mongoose.connect(process.env.DATABASE_ACCESS, (result) =>
  console.log('Database connected' + result)
);

// module.exports = mongoose.connection;
