import { IsEmail, IsNotEmpty } from 'class-validator' //ko validate object - validate object thì dùng class-transformer 7663

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}
