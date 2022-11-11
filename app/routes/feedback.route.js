const express = require('express')
const feedback = require('../controllers/feedback.controller')
const router = express.Router()

router.route('/').post(feedback.create).get(feedback.findAll)
router.route('/:id').delete(feedback.delete)

module.exports = router
