import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { IUserProfile } from '~/entities/user/UserEntity'

export interface IProjectModel {
  id: number
  name: string
  hash: string
  created: string
  lastUpdate: string
  avatar: string
  autorID: number
  participantsID: number[]
  showCursors: boolean
  showNameOnCursor: boolean
  isCanJoinAnonyme: boolean
  autoAcceptUsers: boolean
  parantID: number
  autor?: IUserProfile
}

@Table
export class Projects extends Model<IProjectModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  name: string

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  hash: string

  @Column({ type: DataType.STRING, allowNull: false })
  created: string

  @Column({ type: DataType.STRING, allowNull: false })
  lastUpdate: string

  @Column({ type: DataType.STRING })
  avatar: string

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  showCursors: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  showNameOnCursor: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isCanJoinAnonyme: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  autoAcceptUsers: boolean

  @Column({ type: DataType.INTEGER, allowNull: false })
  autorID: number

  @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
  participantsID: number[]

  @Column({ type: DataType.INTEGER })
  parantID: number
}
