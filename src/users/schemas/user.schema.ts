import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Role } from 'src/enums/role.enum'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true }) //timestamps: true - auto add createdAt & updatedAt
export class User {
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  name: string

  @Prop()
  phone: string

  @Prop()
  address: string

  @Prop()
  age: number

  @Prop()
  dateOfBirth: Date

  @Prop()
  role: Role
}

export const UserSchema = SchemaFactory.createForClass(User)
