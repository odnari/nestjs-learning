import {EntityRepository, Repository} from "typeorm";
import {User} from "./user.entity";
import {AuthCredsDto} from "./dto/auth-creds.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredsDto: AuthCredsDto): Promise<void> {
        const {username, password} = authCredsDto

        const user = new User()
        user.username = username
        user.password = password
        await user.save()
    }
}
