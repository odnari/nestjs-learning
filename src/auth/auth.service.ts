import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {AuthCredsDto} from "./dto/auth-creds.dto";
import {JwtService} from '@nestjs/jwt'
import {JwtPayload} from "./jwt-payload.interface";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        private jwtService: JwtService
    ) {
    }

    async signUp(authCredsDto: AuthCredsDto): Promise<void> {
        return this.userRepository.signUp(authCredsDto)
    }

    async signIn(authCredsDto: AuthCredsDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validatePassword(authCredsDto)

        if (!username) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload: JwtPayload = {username}
        const accessToken = await this.jwtService.sign(payload)

        return {accessToken}
    }
}
