import { Column, DataType, Model, Table } from 'sequelize-typescript'

export type TParticipantRole = 'guest' | 'editor' | 'maintainer' | 'admin'

export interface IParticipant {
  id: number
  userHash: string
  role: TParticipantRole
}

@Table
export class Participants extends Model<IParticipant> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  userHash: string

  @Column({ type: DataType.ENUM('guest', 'editor', 'maintainer', 'admin'), defaultValue: 'guest' })
  role: TParticipantRole
}
