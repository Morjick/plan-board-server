
import { Figure, TFigureType } from './figures/Figure'
import { Emitter } from '~/libs/Emitter'
import { IFigurePositionConstructor } from './figures/FigurePosition'
import { IFigureStylesConstructor } from './figures/FigureStyle'
import { Libs } from '~/libs/Libs'

type TSpaceEmitterAction = 'save'

export interface ISetSpaceEntity {
  figures: string
  id: number
  hash: string
}

export class SpaceEntity {
  public id: number
  public hash: string
  public figures: Figure[] = []

  private undoList: Figure[] = []
  private redoList: Figure[] = []

  public emitter = new Emitter<TSpaceEmitterAction>()

  public get value () {
    return {
      id: this.id,
      hash: this.hash,
      figures: this.figures,
    }
  }

  constructor (data?: ISetSpaceEntity) {
    if (data) {
      this.id = data.id
      this.hash = data.hash
      this.figures = JSON.parse(data.figures)
    } else {
      this.hash = Libs.randomString(16)
    }
  }

  public createFigure (type: TFigureType, position: IFigurePositionConstructor, styles: IFigureStylesConstructor = {}) {
    const figure = new Figure(Figure.GetFigurePreset(type), position, styles)

    this.figures.push(figure)
    this.undoList.push(figure)
  }

  public undo () {
    if (!this.undoList.length) return
    const element = this.undoList.pop()

    this.figures.filter((figure) => figure.hash == element.hash)
    this.redoList.push(element)
  }

  public redo () {
    if (!this.redoList.length) return
    const element = this.redoList.pop()

    this.figures.push(element)
    this.undoList.push(element)
  }

  public async save () {
    this.emitter.emit('save', this.figures)
  }
}
