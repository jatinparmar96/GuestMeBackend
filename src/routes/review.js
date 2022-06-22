const express = require('express');
const router = express.Router({ mergeParams: true });

const { getReviews, postReview } = require('../controllers/reviews');

router.post('/', postReview);

router.get('/', getReviews);

module.exports = router;
