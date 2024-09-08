import { Column, DataType, Model, Table } from 'sequelize-typescript'

export interface ISpaceModel {
  id: number
  hash: string
  figures: string
  workspaceID: number
}

@Table
export class Spaces extends Model<ISpaceModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  hash: string

  @Column({ type: DataType.JSON, defaultValue: JSON.stringify([]) })
  figures: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  workspaceID: number
}
