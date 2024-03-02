import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { Public } from './decorator/customize'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard) //check xem user login chưa, nếu chưa thì login, nếu login (thông qua passport) rồi thì gán user(trong validate) vào req.user
  @Post('/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user) //user của validate(local.strategy.ts) trả về
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
