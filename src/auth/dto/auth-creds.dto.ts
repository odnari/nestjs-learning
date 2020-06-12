import {IsNotEmpty} from "class-validator";

export class AuthCredsDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}
