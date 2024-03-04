import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Role } from 'src/enums/role.enum'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true }) //timestamps: true - auto add createdAt & updatedAt
export class User {
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  fullname: string

  @Prop()
  phoneNumber: string

  @Prop()
  address: string

  @Prop()
  age: number

  @Prop({})
  dateOfBirth: Date

  @Prop()
  role: Role

  @Prop()
  refreshToken: string

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop()
  createdAt: Date

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop()
  updatedAt: Date

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop()
  isDeleted: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
