import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { Public, ResponseMessage, User } from 'src/decorator/customize'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { IUser } from 'src/users/users.interface'

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

  @Get('account')
  handleGetAccount(@User() user: IUser) {
    return { user }
  }
}
