const config = {
  app: {
    port: process.env.PORT || 2702
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoapp'
  }
}

module.exports = config
