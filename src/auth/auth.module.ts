import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './passport/local.strategy'

@Module({
  providers: [AuthService, LocalStrategy], //thêm LocalStrategy để đăng nhập với email, pass
  imports: [UsersModule, PassportModule] //import PassportModule để có thể tư động chạy hàm validate(local.strategy.ts) khi login
})
export class AuthModule {}
