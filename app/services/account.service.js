// const { ObjectId } = require('mongodb')
const bcrypt = require('bcryptjs')
const Account = require('../models/Account')
const ApiError = require('../api-error')

class AccountService {
  constructor(client) {
    this.account = client.db().collection('accounts')
  }
  extractAccountData(payload) {
    const account = {
      email: payload.email,
      password: ''
    }
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        throw saltError
      } else {
        bcrypt.hash(payload.password, salt, function (hashError, hash) {
          if (hashError) {
          } else {
            account.password = hash
          }
        })
      }
    })

    return account
  }
  async create(payload) {
    const emailExist = await Account.findOne({ email: payload.email })
    if (emailExist) {
      return { status: 'existed', account: emailExist }
    }
    const salt = await bcrypt.genSalt(12)
    const hashedPass = await bcrypt.hash(payload.password, salt)

    const account = new Account({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPass
    })

    try {
      const savedAccount = await account.save()
      return { status: 'OK', account: savedAccount }
    } catch (error) {
      return { status: 'error' }
    }
    // const account = this.extractAccountData(payload)
    // const dbAccount = await this.account.findOne({ email: account.email })
    // if (dbAccount) {
    //   return 'Existed'
    // } else {
    //   const result = await this.account.findOneAndUpdate(
    //     account,
    //     { $set: {} },
    //     { returnDocument: 'after', upsert: true }
    //   )
    //   return result.value
    // }
  }
  validatePass(expect, actual) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(expect, actual, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
  async checkLogin(payload) {
    const account = await Account.findOne({ email: payload.email })
    if (!account) {
      return -1
    }
    const validPass = await bcrypt.compare(payload.password, account.password)
    if (!validPass) {
      return 0
    } else {
      return 1
    }
  }
  async find(filter) {
    const cursor = await this.account.find(filter)
    return await cursor.toArray()
  }
  async findByEmail(email) {
    return await this.find({
      email: { $regex: new RegExp(email), $options: 'i' }
    })
  }
  // async findById (id) {
  //   return await this.account.findOne({
  //     _id: ObjectId.isValid(id) ? new ObjectId(id) : null
  //   })
  // }
  async update(email, payload) {
    // const filter = {
    //   email: email
    // }
    const update = this.extractAccountData(payload)
    const result = await this.account.findOneAndUpdate({ email: email }, { $set: update }, { returnDocument: 'after' })
    return result.value
  }
  // async delete (id) {
  //   const result = await this.account.findOneAndDelete({
  //     _id: ObjectId.isValid(id) ? new ObjectId(id) : null
  //   })
  //   return result.value
  // }
  // async findImportant () {
  //   return await this.find({ important: true })
  // }
  // async deleteAll () {
  //   const result = await this.account.deleteMany({})
  //   return result.deletedCount
  // }
}
module.exports = AccountService
