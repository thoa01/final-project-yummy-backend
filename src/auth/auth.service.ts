import { ConfigService } from '@nestjs/config'
import { UsersService } from './../users/users.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { IUser } from 'src/users/users.interface'
import ms from 'ms'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
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

    const refreshToken = this.createRefreshToken(payload)
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
      user: { _id, name, email, role }
    }
  }

  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user)

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'))/1000
    })
    return refreshToken
  }
}
