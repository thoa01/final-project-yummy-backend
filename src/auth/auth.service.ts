import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import ms from 'ms'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { IUser } from 'src/users/users.interface'
import { UsersService } from './../users/users.service'

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

  async login(user: IUser, response: Response) {
    const { _id, email, role } = user
    const payload = {
      sub: 'token login', //description
      iss: 'from server', //creator
      _id,
      email,
      role
    }

    const refreshToken = this.createRefreshToken(payload)
    await this.usersService.updateRefreshTokenByIdUser(refreshToken, _id) //save refreshToken in db
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'))
    }) //set refreshToken as cookie //HttpOnly: true chỈ đọc được ở server, client không lấy được //maxAge: milisecond, hết hạn auto xóa cookie trên client
    return {
      accessToken: this.jwtService.sign(payload),
      user: { _id, email, role }
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
      expiresIn: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) / 1000
    })
    return refreshToken
  }

  processNewRefreshToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') }) //verify: giải mã token (lấy ra payload), có check signature (chữ ký/password)
      const user = await this.usersService.findUserByRefreshToken(refreshToken)
      if (user) {
        const { _id, email, role } = user
        const payload = {
          sub: 'token login', //description
          iss: 'from server', //creator
          _id,
          email,
          role
        }

        const refreshToken = this.createRefreshToken(payload)
        await this.usersService.updateRefreshTokenByIdUser(refreshToken, _id.toString()) //save refreshToken in db
        response.clearCookie('refreshToken')
        response.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'))
        }) //set refreshToken as cookie //HttpOnly: true chỈ đọc được ở server, client không lấy được //maxAge: milisecond, hết hạn auto xóa cookie trên client
        return {
          accessToken: this.jwtService.sign(payload),
          user: { _id, email, role }
        }
      } else {
      }
    } catch (error) {
      throw new BadRequestException('Refresh đã hết hạn hoặc không hợp lệ. Hãy login')
    }
  }
}
