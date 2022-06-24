const Review = require('../models/reviews');

const postReview = (req, res) => {
  let review = new Review({
    speakerID: req.body.speakerID,
    organization: {
      id: req.body.id,
      name: req.body.name,
    },
    rating: req.body.rating,
    comment: req.body.comment,
  });

  review
    .save()
    .then((result) => {
      res.status(201).json(review);
    })
    .catch((error) => res.status(500).send(error));
};

const getReviews = (req, res) => {
  Review.find({})
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => res.status(500).send(error));
};

module.exports = {
  getReviews,
  postReview,
};
