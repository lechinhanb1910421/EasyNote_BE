const express = require('express')
const account = require('../controllers/account.controller')
const router = express.Router()

router.route('/').get(account.findAll).put(account.update)
router.route('/register').post(account.create)

router.route('/:email').patch(account.update).delete(account.delete)

router.route('/login').post(account.login)

router.route('/user').get(account.getUser)
router.route('/role').get(account.getUserRole)

module.exports = router
