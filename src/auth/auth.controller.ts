import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthCredsDto} from "./dto/auth-creds.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/signup')
    @UsePipes(ValidationPipe)
    signUp(@Body() authCredsDto: AuthCredsDto): Promise<void> {
        return this.authService.signUp(authCredsDto)
    }
}
