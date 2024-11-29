import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { IUserProfile } from '~/entities/user/UserEntity'

export interface IDirectoryModel {
  id: number
  hash: string
  isPrivate: boolean
  parrentID: number
  filesID: number[]
  autorHash: string
  name: string
}

export interface IDirectory extends IDirectoryModel {
  length: number
  autor?: IUserProfile
}

@Table
export class Directories extends Model<IDirectoryModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  hash: string

  @Column({ type: DataType.STRING, allowNull: false })
  name: string

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPrivate: boolean

  @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
  filesID: number[]

  @Column({ type: DataType.STRING })
  autorHash: string

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => Directories)
  parrentID: number

  @BelongsTo(() => Directories)
  parent: Directories
}
