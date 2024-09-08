import { Column, DataType, Model, Table } from 'sequelize-typescript'

export interface IDirectoryModel {
  id: number
  hash: string
  workspacesHash: string[]
  isPrivate: boolean
}

@Table
export class Directory extends Model<IDirectoryModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  hash: string

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  workspacesHash: string[]

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPrivate: boolean
}
