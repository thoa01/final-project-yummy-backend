import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from 'src/decorator/customize'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard) //check xem user login chưa, nếu chưa thì login, nếu login (thông qua passport) rồi thì gán user(trong validate) vào req.user
  @Post('/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user) //user của validate(local.strategy.ts) trả về //login tạo access_token
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
