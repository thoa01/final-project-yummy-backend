import { UsersService } from './../users/users.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    //username & pass thư viện passport sẽ ném về
    const user = await this.usersService.findOneByEmail(username)
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password)
      if (isValid) {
        return user
      }
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
