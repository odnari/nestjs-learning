import {EntityRepository, Repository} from "typeorm";
import {User} from "./user.entity";
import {AuthCredsDto} from "./dto/auth-creds.dto";
import {ConflictException, InternalServerErrorException} from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredsDto: AuthCredsDto): Promise<void> {
        const {username, password} = authCredsDto

        const user = new User()
        user.username = username
        user.password = password
        try {
            await user.save()
        } catch (e) {
            if (e.code === '23505') { // duplicate username code
                throw new ConflictException('Username already exists')
            }

            throw new InternalServerErrorException()
        }
    }
}
