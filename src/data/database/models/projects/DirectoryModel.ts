import { Column, DataType, Model, Table } from 'sequelize-typescript'

export interface IDirectoryModel {
  id: number
  hash: string
  isPrivate: boolean
  parrentID: number
  filesID: number[]
  autorHash: string
  name: string
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

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPrivate: boolean

  @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
  filesID: number[]

  @Column({ type: DataType.INTEGER })
  parrentID: number

  @Column({ type: DataType.STRING })
  autorHash: string
}
