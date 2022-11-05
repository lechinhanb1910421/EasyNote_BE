const { ObjectId } = require('mongodb')

class noteService {
  constructor(client) {
    this.note = client.db().collection('notes')
  }
  extractnoteData(payload) {
    const note = {
      name: payload.name,
      description: payload.description,
      time: payload.time,
      important: payload.important
    }
    Object.keys(note).forEach((key) => note[key] === undefined && delete note[key])
    return note
  }

  async create(payload) {
    const note = this.extractnoteData(payload)
    const result = await this.note.findOneAndUpdate(note, { $set: { important: note.important === true } }, { returnDocument: 'after', upsert: true })
    return result.value
  }
  async find(filter) {
    const cursor = await this.note.find(filter)
    return await cursor.toArray()
  }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: 'i' }
    })
  }
  async findByKeyword(keyword) {
    return await this.find({
      name: { $regex: new RegExp(keyword), $options: 'i' }
    })
  }
  async findById(id) {
    return await this.note.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    })
  }
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    }
    const update = this.extractnoteData(payload)
    const result = await this.note.findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after' })
    return result.value
  }
  async delete(id) {
    const result = await this.note.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    })
    return result.value
  }
  async findImportant() {
    return await this.find({ important: true })
  }
  async deleteAll() {
    const result = await this.note.deleteMany({})
    return result.deletedCount
  }
}
module.exports = noteService
