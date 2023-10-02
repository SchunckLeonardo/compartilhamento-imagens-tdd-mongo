let app = require('../src/app')

let supertest = require('supertest')
let request = supertest(app)

let mainUser = {name: "Leonardo", email: "leonardo@gmail.com", password: "123456"}

beforeAll(() => {
    return request.post('/user')
    .send(mainUser)
    .then(res => {})
    .catch(err => console.log(err))
})

afterAll(() => {
    return request.delete(`/user/${mainUser.email}`)
    .then(res => console.log(res))
    .catch(err => console.log(err))
})

describe("Cadastro de usuário", () => {

    test('O usuário deve conseguir se cadastrar com sucesso', () => {
        let dateNow = Date.now()
        let user = {
            name: "Leonardo",
            email: `${dateNow}@gmail.com`,
            password: "123456"
        }

        return request
            .post('/user')
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.email).toBe(user.email)
            })
            .catch(err => {
                throw new Error(err)
            })
    })

    test("Deve impedir que o usuário se cadastre com os dados vazios", () => {
        let user = {
            name: "",
            email: "",
            password: ""
        }

        return request
            .post('/user')
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
            })
            .catch(err => {
                throw new Error(err)
            })
    })

    test("Deve impedir que o usuário se cadastre com um e-mail já cadastrado", () => {
        let dateNow = Date.now()
        let user = {
            name: "Leonardo",
            email: `${dateNow}@gmail.com`,
            password: "123456"
        }

        return request
            .post('/user')
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.email).toBe(user.email)

                return request
                        .post("/user")
                        .send(user)
                        .then(res => {
                            expect(res.statusCode).toEqual(400)
                            expect(res.body.error).toBe("E-mail já cadastrado")
                        }).catch(err => {
                            throw new Error(err)
                        })

            })
            .catch(err => {
                throw new Error(err)
            })
    })

})

describe("Autenticação", () => {
    test("O usuário deve conseguir um token após logar", () => {
        return request.post('/auth')
                .send({email: mainUser.email, password: mainUser.password})
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body.token).toBeDefined()
                })
                .catch(err => {
                    throw new Error(err)
                })
    })
})