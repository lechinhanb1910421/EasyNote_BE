const express = require('express')
const notes = require('../controllers/note.controller')

const router = express.Router()

router.route('/').get(notes.findAll).delete(notes.deleteAll)

router.route('/add').post(notes.create)

router.route('/:id').get(notes.findOne).put(notes.update).delete(notes.delete)

router.route('/search').get(notes.findByKeyword)

module.exports = router
