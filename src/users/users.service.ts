import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './schemas/user.schema'
import mongoose, { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {} //tiêm cái model đã thông báo bởi id (User.name) //dùng User model ở trong service

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
    return this.userModel.deleteOne({ _id: id })
  }
}
