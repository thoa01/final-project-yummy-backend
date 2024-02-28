import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/local-auth.guard'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService
  ) {}

  @UseGuards(LocalAuthGuard) //check xem user login chưa, nếu chưa thì login, nếu login (thông qua passport) rồi thì gán user(trong validate) vào req.user
  @Post('/login')
  handleLogin(@Request() req) {
    return req.user //user của validate(local.strategy.ts) trả về
  }
}
