const ApiError = require('../api-error')
const Account = require('../models/Account')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
exports.getHashedPass = async (password) => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password, salt)
}
exports.create = async (req, res, next) => {
  if (!req.body?.email) {
    return next(new ApiError(400, 'Email can not be empty'))
  }
  if (!req.body?.password) {
    return next(new ApiError(400, 'Password can not be empty'))
  }
  if (!req.body?.firstName) {
    return next(new ApiError(400, 'First Name can not be empty'))
  }
  if (!req.body?.lastName) {
    return next(new ApiError(400, 'Last Name can not be empty'))
  }
  try {
    const account = new Account({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: this.getHashedPass(req.body.password),
      profilePic: req.body.profilePic
    })
    const isExisted = await Account.findOne({ email: account.email })
    if (isExisted) {
      return res.status(400).send({ message: 'Email already exists', id: isExisted.id })
    } else {
      const result = await account.save()
      return res.send({
        message: 'Account was successfully created',
        account: result
      })
    }
  } catch (error) {
    console.error(error)
    return next(new ApiError(500, 'An error eccured while creating the account'))
  }
}
exports.login = async (req, res, next) => {
  if (!req.body?.email) {
    return next(new ApiError(400, 'Email can not be empty'))
  }
  if (!req.body?.password) {
    return next(new ApiError(400, 'Password can not be empty'))
  }
  try {
    const account = await Account.findOne({ email: { $regex: new RegExp(req.body.email), $options: 'i' } })
    if (!account) {
      return res.status(400).send({ message: 'Email is not found' })
    }
    const validPass = await bcrypt.compare(req.body.password, account.password)
    if (!validPass) {
      return res.status(400).send({ message: 'Invalid password' })
    } else {
      const token = jwt.sign({ _id: account._id }, process.env.TOKEN_SECRET)
      return res.status(200).send({ message: 'Logged In', token: token })
    }
  } catch (error) {
    return next(new ApiError(500, 'An error eccured while loggin in the account'))
  }
}
exports.getUser = async (req, res, next) => {
  const token = req.query.auth_token
  if (!token) {
    return res.status(401).json({
      status: 'failed',
      message: 'Unauthorized. Access denied'
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    const user_id = decoded._id
    const user = await Account.findById(user_id)
    return res.send(user)
  } catch (error) {
    return next(new ApiError(500, 'Invalid access token'))
  }
}
exports.findAll = async (req, res, next) => {
  let documents = []

  try {
    const { email } = req.query
    if (email) {
      const account = await Account.find({ email: { $regex: new RegExp(email), $options: 'i' } })
      if (account[0]) {
        return res.send(account[0])
      } else {
        return next(new ApiError(400, 'Email is not found'))
      }
    } else {
      documents = await Account.find({})
    }
  } catch (error) {
    return next(new ApiError(500, 'An error eccured while retrieving the account'))
  }
  return res.send(documents)
}
exports.findOne = async (req, res, next) => {
  try {
    const document = await Account.findById(req.params.id)
    if (!document) {
      return next(new ApiError(404, 'Note not found'))
    }
    return res.send(document)
  } catch (error) {
    return next(new ApiError(500, `Error retrieving note with id = ${req.params.id}`))
  }
}
exports.update = async (req, res, next) => {
  if (req.body.firstName == null || req.body.firstName == '') {
    if (req.body.lastName == null || req.body.lastName == '') {
      if (req.body.password == null || req.body.password == '') {
        return next(new ApiError(400, 'Request body does not cantain any key'))
      }
    }
  }
  const payload = req.body
  Object.keys(payload).forEach((key) => (payload[key] === undefined || payload[key] == null) && delete payload[key])
  if (payload.password) {
    payload.password = await this.getHashedPass(payload.password)
  }
  try {
    const document = await Account.findOneAndUpdate({ email: req.params.email }, { $set: payload }, { returnDocument: 'after' })
    if (!document) {
    }
    return res.send({ message: 'Account was updated successfully !', account: document })
  } catch (error) {
    return next(new ApiError(500, `Error updating note with email = ${req.params.email}`))
  }
}
