import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { IUserProfile } from '~/entities/user/UserEntity'
import { Users } from '../user/UserModel'

export type TPromocodeType = 'discount' | 'period'

export interface IPromocodeModel {
  id: number
  name: string
  description: string
  type: TPromocodeType
  value: string
  autorID: number
  autor: IUserProfile
  hash: string
}

@Table
export class Promocodes extends Model<IPromocodeModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, unique: true })
  name: string

  @Column({ type: DataType.TEXT })
  description: string

  @Column({ type: DataType.ENUM('discount', 'period') })
  type: TPromocodeType

  @Column({ type: DataType.STRING })
  value: string

  @Column({ type: DataType.STRING, unique: true })
  hash: string

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => Users)
  autorID: number

  @BelongsTo(() => Users)
  autor: IUserProfile
}
