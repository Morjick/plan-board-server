
import { FigurePosition, IFigurePositionConstructor } from './FigurePosition'
import { FigureStyles, IFigureStylesConstructor } from './FigureStyle'
import { FiguresList } from '~/data/constants/Figures'
import { Libs } from '~/libs/Libs'

export type TFigureType = 'straight-line' | 'square' | 'circle'

export interface ICoordinates {
  x: number
  y: number
  z?: number
}

export interface IPosition {
  leftTop: ICoordinates
  rightBottom: ICoordinates
  isFpli?: boolean
  width: number
  height: number
}

export interface IPresetFigure {
  type: TFigureType
  styles: IFigureStylesConstructor
}

export class Figure {
  public hash: string
  public type: TFigureType = 'straight-line'
  public position: FigurePosition
  public styles: FigureStyles

  constructor (figure: IPresetFigure, position: IFigurePositionConstructor, styles?: IFigureStylesConstructor) {
    this.type = figure.type
    this.position = new FigurePosition(position)
    this.hash = Libs.randomString(24)

    let updatedStyles = { ...figure.styles }
    if (styles) {
      updatedStyles = { ...updatedStyles, ...styles }
    }

    this.styles = new FigureStyles(updatedStyles)
  }

  public static GetFigurePreset (type: TFigureType = 'straight-line'): IPresetFigure {
    return FiguresList.find((el) => el.type == type)
  }
}
