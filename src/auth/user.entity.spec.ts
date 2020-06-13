import {User} from './user.entity'
import * as bcrypt from 'bcryptjs'

describe('User entity', () => {
    let user: User

    beforeEach(() => {
        user = new User()
        user.salt = 'testSalt'
        user.password = 'testPassword'
        bcrypt.hash = jest.fn()
    })
    describe('validatePassword', () => {
        it('return true if password is valid', async () => {
            bcrypt.hash.mockReturnValue('testPassword')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await user.validatePassword('123456')
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt')
            expect(result).toEqual(true)
        })

        it('return false if password is invalid', async () => {
            bcrypt.hash.mockReturnValue('wrongPassword')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await user.validatePassword('wrongPassword')
            expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt')
            expect(result).toEqual(false)
        })
    })
})
