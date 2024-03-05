import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { Public, ResponseMessage, User } from 'src/decorator/customize'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { IUser } from 'src/users/users.interface'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard) //check xem user login đúng account kh, nếu kh thì login lại, nếu login (thông qua passport) rồi thì gán user(trong validate) vào req.user
  @ResponseMessage('Login')
  @Post('login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response) //user của validate(local.strategy.ts) trả về //login tạo access_token
  }

  @ResponseMessage('Register account')
  @Public()
  @Post('register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('refresh')
  handleRefreshToken(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies['refreshToken']
    return this.authService.processNewRefreshToken(refreshToken, response)

  @Get('account')
  handleGetAccount(@User() user: IUser) {
    return { user }
  }
}
