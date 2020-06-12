import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthCredsDto} from "./dto/auth-creds.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredsDto: AuthCredsDto): Promise<void> {
        return this.authService.signUp(authCredsDto)
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredsDto: AuthCredsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredsDto)
    }
}
