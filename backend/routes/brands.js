const express = require('express');
const router = express.Router();
const { getBrands, getBrandById } = require('../controllers/brandController');

router.get('/', getBrands);
router.get('/:id', getBrandById);

module.exports = router;