let mongoose = require('mongoose')

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/guiapics")
})

afterAll(async() => {
    await mongoose.connection.close()
})