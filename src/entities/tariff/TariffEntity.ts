
export type TTariffType = 'basic' | 'advanced' | 'pro'

export interface ITariffLimit {
  projectsCount: number | 'unlimited'
  commandLength: number | 'unlimited'
}

export interface ITariffitem {
  type: TTariffType
  name: string
  description: string
  price: number
  limits: ITariffLimit
}

const TariffsList: ITariffitem[] = [
  {
    type: 'basic',
    name: 'Базовый',
    description: 'Самый базовый тариф. У вас он уже есть',
    price: 0,
    limits: {
      projectsCount: 10,
      commandLength: 0,
    },
  },
  {
    type: 'advanced',
    name: 'Продвинутый',
    description: 'Тариф для продвинутых пользователей',
    price: 200,
    limits: {
      projectsCount: 100,
      commandLength: 50,
    },
  },
  {
    type: 'pro',
    name: 'Профессианальный',
    description: 'Тариф для профессионалов',
    price: 600,
    limits: {
      projectsCount: 'unlimited',
      commandLength: 'unlimited',
    },
  },
]

export class TariffEntity {
  constructor () {}

  public static get list (): ITariffitem[] {
    return TariffsList
  }

  public static getTariff (type: TTariffType = 'basic'): ITariffitem {
    return TariffsList.find((el) => el.type == type)
  }
}
