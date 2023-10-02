let app = require('../src/app')

let supertest = require('supertest')
let request = supertest(app)

test("A aplicação deve rodar na porta 3131", () => {
    return request.get('/').then(res => expect(res.statusCode).toEqual(200)).catch(err => {
        throw new Error(err)
    })
})