import { Column, DataType, Model, Table } from 'sequelize-typescript'

export type TFileType = 'workspace' | 'txt' | 'doc' | 'docx' | 'pdf' | 'xsls' | 'xls' | 'directory'

export interface IDirectoryFiles {
  id: number
  type: TFileType
  path: string
  isFile: boolean
  name: string
  parrentID: number
  slug: string
  autorHash: string
}

@Table
export class DirectoryFiles extends Model<IDirectoryFiles> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  type: TFileType

  @Column({ type: DataType.STRING })
  path: string

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isFile: boolean

  @Column({ type: DataType.STRING, allowNull: false })
  name: string

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  slug: string

  @Column({ type: DataType.INTEGER })
  parrentID: number

  @Column({ type: DataType.STRING, allowNull: false })
  autorHash: string
}
