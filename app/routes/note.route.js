const express = require('express')
const notes = require('../controllers/note.controller')
const verify = require('../controllers/verify_token')

const router = express.Router()

router.route('/').get(notes.findAll).delete(notes.deleteAll)

router.route('/add').post(notes.create)

// router.route('/importants').get(notes.findAllImportant)
// router.route('/schematest').get(notes.schemaTest)

router.route('/:id').get(notes.findOne).put(notes.update)
// .delete(notes.delete);

module.exports = router
