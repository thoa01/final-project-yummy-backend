import { UsersService } from './../users/users.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { IUser } from 'src/users/users.interface'

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

  async login(user: IUser) {
    const { _id, name, email, role } = user
    const payload = {
      sub: 'token login', //description
      iss: 'from server', //creator
      _id,
      name,
      email,
      role
    }
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role
    }
  }
}
