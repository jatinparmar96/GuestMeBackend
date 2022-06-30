const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  register,
  login,
  updateProfile,
  getSpeakers,
  getSpeaker,
  getMaxPrice,
} = require('../controllers/organization');
const {
  OrganizationAuthMiddleware,
} = require('../middleware/OrganizationAuthentication');

router.post('/register', register);

router.post('/login', login);

// Get organization by id
// router.get('/:id', getOrganization);

module.exports = router;
