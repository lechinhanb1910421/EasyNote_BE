const ApiError = require('../api-error')
const Note = require('../models/Note')
var ObjectId = require('mongoose').Types.ObjectId

exports.create = async (req, res, next) => {
  if (!req.body?.email) {
    return next(new ApiError(400, 'Email can not be empty'))
  }
  if (!req.body?.description) {
    return next(new ApiError(400, 'Description can not be empty'))
  }

  try {
    const note = new Note({
      email: req.body.email,
      title: req.body.title,
      state: req.body.state,
      description: req.body.description,
      important: req.body.important
    })
    const result = await note.save()
    if (result) {
      return res.send(result)
    } else {
      throw 'An error eccured while creating the note'
    }
  } catch (error) {
    return next(new ApiError(500, 'An error eccured while creating the note'))
  }
}
exports.findAll = async (req, res, next) => {
  let documents = []
  try {
    const { email } = req.query
    if (email) {
      documents = await Note.find({ email: { $regex: new RegExp(email), $options: 'i' } })
      return res.send(documents)
    } else {
      documents = await Note.find({})
    }
  } catch (error) {
    return next(new ApiError(500, 'An error eccured while retrieving the notes'))
  }
  return res.send(documents)
}
exports.findOne = async (req, res, next) => {
  try {
    const document = await Note.findById(req.params.id)
    if (!document) {
      return next(new ApiError(404, 'Note not found'))
    }
    return res.send(document)
  } catch (error) {
    return next(new ApiError(500, `Error retrieving note with id = ${req.params.id}`))
  }
}
exports.findByKeyword = async (req, res, next) => {
  let documents = []
  try {
    const { keyword } = req.query
    if (keyword) {
      documents = await Note.find({ title: { $regex: new RegExp(keyword), $options: 'i' } })
      return res.send(documents)
    }
  } catch (error) {
    return next(new ApiError(500, 'An error eccured while retrieving the notes'))
  }
  return res.send(documents)
}
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length == 0) {
    return next(new ApiError(400, 'Data to update can not be empty'))
  }
  try {
    const filter = { _id: ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null }
    const update = {
      email: req.body.email,
      title: req.body.title,
      description: req.body.description,
      state: req.body.state,
      important: req.body.important
    }
    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key])
    const document = await Note.findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after' })
    if (!document) {
      return next(new ApiError(404, 'Note not found'))
    }
    return res.send({ message: 'Note was updated successfully !', note: document })
  } catch (error) {
    return next(new ApiError(500, `Error updating note with id = ${req.params.id}`))
  }
}
exports.delete = async (req, res, next) => {
  try {
    const document = await Note.findByIdAndDelete(req.params.id)
    if (!document) {
      return next(new ApiError(404, 'Note not found'))
    }
    return res.send({ message: 'Note was deleted successfully !' })
  } catch (error) {
    return next(new ApiError(500, `Could not delete note with id = ${req.params.id}`))
  }
}
exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Note.deleteMany({})
    return res.send({
      message: `${result.deletedCount} notes were deleted successfully !`
    })
  } catch (error) {
    return next(new ApiError(500, 'An error eccured while removing all notes'))
  }
}
// exports.findAllImportant = async (req, res, next) => {
//   try {
//     const noteService = new NoteService(MongoDB.client);
//     const documents = await noteService.findImportant();
//     return res.send(documents);
//   } catch (error) {
//     return next(new ApiError(500, "An error eccured while retrieving the notes"));
//   }
// };
exports.testAdd = async (req, res, next) => {
  return res.send('Note added')
}
