import { Column, DataType, Model, Table } from 'sequelize-typescript'

export interface IUserVerificationsCodesModel {
  id: number
  code: number
  email: string
  userID: number
}

@Table
export class UserVerificationsCodes extends Model<IUserVerificationsCodesModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.INTEGER, allowNull: false })
  code: number

  @Column({ type: DataType.STRING, allowNull: false })
  email: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  userID: number
}
