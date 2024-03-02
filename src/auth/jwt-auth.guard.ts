import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'src/decorator/customize'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    //Reflector lấy metadata ra
    super()
  }

  canActivate(context: ExecutionContext) {
    //ns cho nestjs khi truyền thêm thông tin IS_PUBLIC_KEY thì làm gì
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]) //lấy metadata gửi kèm vs request này //truyền key(IS_PUBLIC_KEY) để lấy value ra //nếu JwtAuthGuard return true thì qua được JwtAuthGuard
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }

  handleRequest(err, user, info) {
    //khi có lỗi vs token (1: kh truyền token, 2: token không hợp lệ (hết hạn or kh đúng định dạng))
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
