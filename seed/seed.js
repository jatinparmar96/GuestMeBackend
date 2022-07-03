const { faker } = require('@faker-js/faker');
const Speaker = require('../src/models/speaker');
const Reviews = require('../src/models/reviews');
const Bookings = require('../src/models/bookings');
const Organization = require('../src/models/organization');
const { generateHash } = require('../src/utils/utils');
exports.remove = async function remove() {
  await Speaker.deleteMany({}).exec();
  await Reviews.deleteMany({}).exec();
};
exports.seedSpeaker = async function seedSpeaker() {
  const speakers = [];
  for (let i = 0; i < 10; i++) {
    const speaker = {};
    speaker.firstName = faker.name.firstName();
    speaker.lastName = faker.name.lastName();
    speaker.location = faker.address.cityName();
    speaker.skills = faker.helpers.arrayElement([
      'Art',
      'Graphic Design',
      'Music',
    ]);
    speaker.videos = faker.internet.url();
    speaker.certifications = faker.helpers.arrayElement([
      'Diploma in Electronics',
      'Diploma in Computer Science',
      'Diploma in Mechatronics',
    ]);
    speaker.profilePicture = `https://picsum.photos/seed/${i + 1}/400/400/`;
    speaker.about = faker.lorem.sentence();
    speaker.availability = faker.helpers.arrayElement([
      faker.date.future(),
      faker.date.future(),
      faker.date.future(),
    ]);
    speaker.conditions = {};
    speaker.conditions.isInPerson = faker.helpers.arrayElement([true, false]);
    speaker.conditions.isOnline = faker.helpers.arrayElement([true, false]);
    speaker.conditions.price = faker.datatype.number({ min: 10, max: 200 });
    speaker.conditions.areas = faker.helpers.arrayElement([
      'Law',
      'Finance',
      'Science',
    ]);
    speaker.conditions.language = faker.helpers.arrayElement([
      'English',
      'French',
      'Hindi',
    ]);
    const email = faker.internet.email().toLowerCase();
    speaker.credentials = {};
    speaker.credentials.email = email;
    speaker.credentials.password = await generateHash('topsecret');
    speaker.contact = {};

    speaker.contact.phone = faker.phone.number();
    speaker.contact.email = email;
    speakers.push(speaker);
  }
  await Speaker.collection.insertMany(speakers);
};

exports.seedReviews = async function seedReviews() {
  const speakers = await Speaker.find();
  const reviews = [];
  for (let i = 0; i < 20; i++) {
    const review = {};
    review.speakerID =
      speakers[Math.floor(Math.random() * 1000) % speakers.length]._id;
    review.organization = {};
    review.organization.id = faker.database.mongodbObjectId();
    review.organization.name = faker.company.companyName();
    review.rating = faker.finance.amount(1, 5);
    review.comment = faker.lorem.sentence();
    reviews.push(review);
  }
  await Reviews.insertMany(reviews);
};

exports.seedBookings = async function seedBookings() {
  const speakers = await Speaker.find();
  const organizations = await Organization.find();
  const bookings = [];
  for (let i = 0; i < 20; i++) {
    const booking = {};
    booking.speaker = {};
    booking.speaker.id =
      speakers[Math.floor(Math.random() * 1000) % speakers.length]._id;
    const speaker = await Speaker.findById(booking.speaker.id);
    booking.speaker.name = speaker.firstName;
    booking.organization = {};
    booking.organization.id =
      organizations[
        Math.floor(Math.random() * 1000) % organizations.length
      ]._id;
    const organization = await Organization.findById(booking.organization.id);
    booking.organization.name = organization.organizationName;
    booking.bookingDateTime = {};
    booking.bookingDateTime.startDateTime = faker.date.future();
    booking.bookingDateTime.endDateTime = faker.date.future();
    booking.location = faker.address.cityName();
    booking.topic = faker.helpers.arrayElement([
      'Environmental',
      'Social',
      'Culture',
    ]);
    booking.message = faker.lorem.sentence();
    booking.status = 'pending';
    booking.personInCharge = faker.name.findName();
    booking.deliveryMethod = faker.helpers.arrayElement([
      'isInPerson',
      'isOnline',
    ]);
    bookings.push(booking);
  }
  await Bookings.insertMany(bookings);
};

exports.seedOrganization = async function seedOrganization() {
  const organizations = [];
  for (let i = 0; i < 10; i++) {
    const organization = {};
    organization.organizationName = faker.company.companyName();
    organization.about = faker.lorem.sentence();
    organization.profilePicture = `https://picsum.photos/seed/${
      i + 1
    }/400/400/`;
    organization.address = faker.address.streetAddress();
    organization.postalCode = faker.address.zipCode();
    organization.phone = faker.phone.number();
    organization.contact = {};
    const email = faker.internet.email().toLowerCase();
    organization.contact.email = email;
    organization.contact.phone = faker.phone.number();
    organization.credentials = {};
    organization.credentials.email = email;
    organization.credentials.password = await generateHash('topsecret');
    organizations.push(organization);
  }
  await Organization.collection.insertMany(organizations);
};
