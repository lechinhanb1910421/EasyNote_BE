const ApiError = require('../api-error')
const Feedback = require('../models/Feedback')
var ObjectId = require('mongoose').Types.ObjectId

exports.create = async (req, res, next) => {
  if (!req.body?.email) {
    return next(new ApiError(400, 'Email can not be empty'))
  }
  if (!req.body?.description) {
    return next(new ApiError(400, 'Description can not be empty'))
  }
  if (!req.body?.category) {
    return next(new ApiError(400, 'Category can not be empty'))
  }
  try {
    const feedback = new Feedback({
      email: req.body.email,
      category: req.body.category,
      description: req.body.description
    })
    const result = await feedback.save()
    if (result) {
      return res.send(result)
    } else {
      throw 'An error eccured while creating the feedback'
    }
  } catch (error) {
    return next(new ApiError(500, 'An error eccured while creating the feedback'))
  }
}
exports.findAll = async (req, res, next) => {
    let documents = []
    try {
      const { email } = req.query
      if (email) {
        documents = await Feedback.find({ email: { $regex: new RegExp(email), $options: 'i' } })
        return res.send(documents)
      } else {
        documents = await Feedback.find({})
      }
    } catch (error) {
      return next(new ApiError(500, 'An error eccured while retrieving the feedbacks'))
    }
    return res.send(documents)
  }
exports.delete = async (req, res, next) => {
  const isExisted = await Feedback.findById(req.params.id)
  if (!isExisted) {
    return res.status(400).send({ message: 'Feedback is not found' })
  } else {
    const result = await Feedback.findByIdAndDelete(req.params.id)
    return res.send({ message: 'Feedback was successfully delete' })
  }
}

exports.deleteAll = async (req, res, next) => {
    try {
      const result = await Feedback.deleteMany({})
      return res.send({
        message: `${result.deletedCount} notes were deleted successfully !`
      })
    } catch (error) {
      return next(new ApiError(500, 'An error eccured while removing all notes'))
    }
  }