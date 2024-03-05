import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import mongoose from 'mongoose'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  // constructor(@InjectModel(User.name) private userModel: Model<User>) {} //tiêm cái model đã thông báo bởi id (User.name) //dùng User model ở trong service
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {} //config để dùng soft-delete
  hashPassword = (plainPassword: string) => {
    const salt = genSaltSync(10)
    const hash = hashSync(plainPassword, salt)
    return hash
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.hashPassword(createUserDto.password)
    const formattedData = { ...createUserDto, password: hashPassword }
    return await this.userModel.create(formattedData)
  }

  async register(user: RegisterUserDto) {
    const { email, password } = user
    const hashPassword = this.hashPassword(password)
    const newRegister = await this.userModel.create({
      email,
      password: hashPassword
    })
    return newRegister
  }

  updateRefreshTokenByIdUser = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken })
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user'
    return this.userModel.findOne({ _id: id })
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
    } catch (error) {
      return error
    }
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Incorrect ID'
    return this.userModel.softDelete({ _id: id })
  }

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
  }
}
