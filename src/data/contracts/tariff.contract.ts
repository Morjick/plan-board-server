import { IsNotEmpty, IsString } from 'class-validator'
import { TTariffType } from '~/entities/tariff/TariffEntity'

export class ChangeTariffContract {
  @IsNotEmpty({ message: 'Не указан тип тарифа' })
  @IsString({ message: 'Тип тарифа должен быть строкой' })
  type: TTariffType
}
