import {EntityRepository, Repository} from "typeorm";
import {User} from "./user.entity";
import {AuthCredsDto} from "./dto/auth-creds.dto";
import {ConflictException, InternalServerErrorException} from "@nestjs/common";
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredsDto: AuthCredsDto): Promise<void> {
        const {username, password} = authCredsDto

        const user = new User()
        user.username = username
        user.salt = await bcrypt.getSalt()
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
        } catch (e) {
            if (e.code === '23505') { // duplicate username code
                throw new ConflictException('Username already exists')
            }

            throw new InternalServerErrorException()
        }
    }

    async validatePassword(authCredsDto: AuthCredsDto): Promise<string> {
        const {username, password} = authCredsDto
        const user = await this.findOne({username})

        if (user && await user.validatePassword(password)) {
            return user.username
        } else {
            return null
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}
