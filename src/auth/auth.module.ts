import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: 'topSecret123',
            signOptions: {
                expiresIn: 3600,
            }
        }),
        TypeOrmModule.forFeature([UserRepository])
    ]
})
export class AuthModule {
}
