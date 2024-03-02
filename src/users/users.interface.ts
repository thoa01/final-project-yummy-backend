import { Role } from 'src/enums/role.enum'

export interface IUser {
  _id: string
  name: string
  email: string
  role: Role
}
