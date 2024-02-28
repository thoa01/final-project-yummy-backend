import { UsersService } from './../users/users.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
