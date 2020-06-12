import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([UserRepository])]
})
export class AuthModule {
}