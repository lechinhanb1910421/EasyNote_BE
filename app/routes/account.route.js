const express = require('express')
const account = require('../controllers/account.controller')
const router = express.Router()

router.route('/').get(account.findAll).put(account.update)
// .delete(account.deleteAll)
router.route('/register').post(account.create)

router.route('/:email').patch(account.update)

router.route('/login').post(account.login)

router.route('/user').get(account.getUser)
//   .delete(account.delete)

module.exports = router
