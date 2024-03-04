import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common'
import { Public, ResponseMessage } from 'src/decorator/customize'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard) //check xem user login chưa, nếu chưa thì login, nếu login (thông qua passport) rồi thì gán user(trong validate) vào req.user
  @ResponseMessage('Login ne')
  @Post('login')
  handleLogin(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response) //user của validate(local.strategy.ts) trả về //login tạo access_token
  }

  @Post('register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }
}
