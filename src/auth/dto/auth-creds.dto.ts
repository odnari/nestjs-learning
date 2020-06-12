import {IsNotEmpty, Matches, MaxLength, MinLength} from "class-validator"

export class AuthCredsDto {
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(128)
    username: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(256)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    password: string
}
