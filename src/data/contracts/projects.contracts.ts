import { IsString, Length } from 'class-validator'

export class CreateWorkspaceContract {
  directoryID?: number
}

export class CreateDirectoryContract {
  @IsString({ message: 'Имя директории должно быть строкой' })
  @Length(5, 25, { message: 'Имя директории не должно быть меньше 5 и больше 10 символов' })
  name: string

  directoryID?: number
}
