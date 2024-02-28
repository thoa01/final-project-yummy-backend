import { OmitType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends OmitType(CreateUserDto, ['password']) {
  _id: string
  name: string
  phone: string
  address: string
  age: number
  dateOfBirth: Date
}
