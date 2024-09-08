
export interface IFigureStylesConstructor {
  fill?: string
  borderStroke?: string
  borderRadius?: string
  borderColor?: string
}

export class FigureStyles {
  public fill: string = '#E1E1E1'
  public borderStroke: string = '1px'
  public borderRadius?: string = '0px'
  public borderColor?: string = '#000'

  constructor (data?: IFigureStylesConstructor) {
    if (!data) return

    for (const property in data) {
      if (this[property] == undefined) return
      this[property] = data[property]
    }
  }
}
