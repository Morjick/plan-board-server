import { Column, DataType, Model, Table } from 'sequelize-typescript'

export interface IForgottenCodesModel {
  id: number
  email: string
  code: string
  datemark: string
}

@Table
export class ForgottenCodes extends Model<IForgottenCodesModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  email: string

  @Column({ type: DataType.STRING, allowNull: false })
  code: string

  @Column({ type: DataType.STRING })
  datemark: string
}
