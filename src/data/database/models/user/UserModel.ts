import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { TTariffType } from '~/entities/tariff/TariffEntity'

export interface IUserModel {
  id: number
  firstname: string
  middlename: string
  lastname: string
  email: string
  phone: string
  avatar: string
  hash: string
  tariffType: TTariffType
  password: string
  projectsHash: string[]
  isEmailVerified: boolean
  favoritesHash: string[]
  dropPassword: boolean
}

@Table
export class Users extends Model<IUserModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  firstname: string

  @Column({ type: DataType.STRING, defaultValue: '' })
  middlename: string

  @Column({ type: DataType.STRING, defaultValue: '' })
  lastname: string

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isEmailVerified: boolean

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  password: string

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  dropPassword: boolean

  @Column({ type: DataType.STRING, defaultValue: '' })
  phone: string

  @Column({ type: DataType.STRING, defaultValue: '' })
  avatar: string

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  hash: string

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  projectsHash: string[]

  @Column({ type: DataType.ENUM('basic', 'advanced', 'pro'), defaultValue: 'basic' })
  tariffType: TTariffType

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  favoritesHash: string[]
}
