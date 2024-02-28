import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './passport/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  providers: [AuthService, LocalStrategy], //thêm LocalStrategy để đăng nhập với email, pass
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRE') //miliseconds
        }
      }),
      inject: [ConfigService]
    })
  ], //import PassportModule để có thể tư động chạy hàm validate(local.strategy.ts) khi login
  exports: [AuthService]
})
export class AuthModule {}
