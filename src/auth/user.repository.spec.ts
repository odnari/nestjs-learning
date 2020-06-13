import {Test} from "@nestjs/testing";
import {UserRepository} from "./user.repository";
import {ConflictException, InternalServerErrorException} from "@nestjs/common";
import {User} from "./user.entity";
import * as bcrypt from 'bcryptjs'

const mockCredsDto = {
    username: 'TestUsername',
    password: 'TestPassword123!'
}

describe('UserRepository', () => {
    let userRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile()

        userRepository = await module.get<UserRepository>(UserRepository)
    })

    describe('signUp', () => {
        let save
        beforeEach(() => {
            save = jest.fn()
            userRepository.create = jest.fn().mockReturnValue({save})
        })

        it('successfully signs up the user', async () => {
            save.mockResolvedValue(undefined)
            await expect(userRepository.signUp(mockCredsDto)).resolves.not.toThrow()
        })

        it('throws when username already exists', async () => {
            save.mockRejectedValue({code: '23505'})
            await expect(userRepository.signUp(mockCredsDto)).rejects.toThrow(ConflictException)
        })

        it('throws for unhandled exception code', async () => {
            save.mockRejectedValue({code: '213322'})
            await expect(userRepository.signUp(mockCredsDto)).rejects.toThrow(InternalServerErrorException)
        })
    })

    describe('validateUserPassword', () => {
        let user

        beforeEach(() => {
            userRepository.findOne = jest.fn()
            user = new User()
            user.username = 'TestUsername'
            user.validatePassword = jest.fn()
        })

        it('returns the username as validation is successful', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(true)

            const result = await userRepository.validatePassword(mockCredsDto)
            expect(result).toEqual(mockCredsDto.username)

        })

        it('returns null as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null)

            const result = await userRepository.validatePassword(mockCredsDto)
            expect(user.validatePassword).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })

        it('returns null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(false)

            const result = await userRepository.validatePassword(mockCredsDto)
            expect(user.validatePassword).toHaveBeenCalled()
            expect(result).toBeNull()
        })
    })

    describe('hashPassword', () => {
        it('call bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await userRepository.hashPassword('testPassword', 'testSalt')
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt')
            expect(result).toEqual('testHash')
        })
    })
})
