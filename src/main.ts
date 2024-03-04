import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector)) //dùng JwtAuthGuard global, bảo vệ tất cả route // ko truyền lên jwt thì kh thể truy cập
  app.useGlobalPipes(new ValidationPipe()) //config to data validation in dto
  app.use(cookieParser()) //config cookies (lấy coookie từ fe hoặc set cookie cho fe)
  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', preflightContinue: false }) //config cors
  await app.listen(configService.get('PORT')) //how to use .env in main (special)
}
bootstrap()
