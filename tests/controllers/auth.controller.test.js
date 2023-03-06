const { mockRequest, mockResponse } = require("../interceptor")
const { signup } = require("../../controllers/auth.controller")
const db = require("../db")

beforeAll(async () => await db.connect())
afterEach(async () => await db.clearDataBase())
afterAll(async () => await db.closeDatabase())

const testPayload = {
    userType: "CUSTOMER",
    password: "12345678",
    name: "Test",
    userId: 1,
    email: "test@gmail.com",
    userStatus: "PENDING",
    ticketsCreated: [],
    ticketsAssigned: []
}

describe("SignUp", () => {
    it('should pass', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.body = testPayload

        await signup(req, res)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "test@gmail.com",
                name: "Test",
                userId: "1",
                userStatus: "APPROVED",
                userType: "CUSTOMER"
            })
        )
    })
 })

