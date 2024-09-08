import { ICoordinates } from './Figure'

export interface IFigurePositionConstructor {
  leftTop: ICoordinates
  rightBottom: ICoordinates
}

export class FigurePosition {
  public leftTop: ICoordinates
  public rightBottom: ICoordinates

  public get width (): number {
    return Math.abs(this.rightBottom.x - this.leftTop.x)
  }

  public get height (): number {
    return Math.abs(this.rightBottom.y - this.leftTop.y)
  }

  public get isFplipX (): boolean {
    return this.leftTop.x > this.rightBottom.x
  }

  public get isFplipY (): boolean {
    return this.leftTop.y > this.rightBottom.y
  }

  constructor (data: IFigurePositionConstructor) {
    this.leftTop = data.leftTop
    this.rightBottom = data.rightBottom
  }
}
