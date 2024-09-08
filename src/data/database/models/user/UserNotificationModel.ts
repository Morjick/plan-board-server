import { Column, DataType, Model, Table } from 'sequelize-typescript'

export interface IUserNotification {
  id: number
  message: string
  viewed: boolean
  date: string
  userID: number
  href: string
}

@Table
export class UserNotification extends Model<IUserNotification> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING })
  message: string

  @Column({ type: DataType.STRING })
  href: string

  @Column({ type: DataType.BOOLEAN })
  viewed: boolean

  @Column({ type: DataType.STRING })
  date: string
  
  @Column({ type: DataType.INTEGER })
  userID: number
}
