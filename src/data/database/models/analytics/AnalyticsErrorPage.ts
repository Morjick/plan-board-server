import { Column, DataType, Model, Table } from 'sequelize-typescript'

export interface IAnalyticsErrorPageModel {
  id: number
  status: number
  userID: number
  message: string
}

@Table
export class AnalyticsErrorPage extends Model<IAnalyticsErrorPageModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.INTEGER })
  status: number

  @Column({ type: DataType.INTEGER })
  userID: number

  @Column({ type: DataType.STRING })
  message: string
}
