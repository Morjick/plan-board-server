import { Column, DataType, Model, Table } from 'sequelize-typescript'

export type THelpPage = 'directories' | 'workspace'

export interface IAnalyticsHelpModel {
  id: number
  userID: number
  page: THelpPage
}

@Table
export class AnalyticsHelp extends Model<IAnalyticsHelpModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.INTEGER })
  userID: number

  @Column({ type: DataType.ENUM('directories', 'workspace') })
  page: THelpPage
}
