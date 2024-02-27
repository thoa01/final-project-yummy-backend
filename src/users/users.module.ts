import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], //thông báo là muốn dùng User model //connect mongodb (connect User model) - name: User.name: ko liên quan thuộc tính name ở schema - id (name: User.name) ứng vs model (User)
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
