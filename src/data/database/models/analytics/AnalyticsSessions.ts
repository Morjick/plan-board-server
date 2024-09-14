import { Column, DataType, Model, Table } from 'sequelize-typescript'

export interface IAnalyticsSessionsModel {
  id: number
  userID: number
  start: string
  end: string
  hourse: number
  minutes: number
  seconds: number
} 

@Table
export class AnalyticsSessions extends Model<IAnalyticsSessionsModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.INTEGER, allowNull: false })
  userID: number

  @Column({ type: DataType.STRING, allowNull: false })
  start: string

  @Column({ type: DataType.STRING, allowNull: false })
  end: string

  @Column({ type: DataType.INTEGER })
  hourse: number

  @Column({ type: DataType.INTEGER })
  minutes: number

  @Column({ type: DataType.INTEGER })
  seconds: number
}
