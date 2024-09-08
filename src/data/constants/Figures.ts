import { IPresetFigure } from '~/entities/projects/figures/Figure'

export const FiguresList: IPresetFigure[] = [
  { type: 'circle', styles: { borderRadius: '50%', borderStroke: '1px', borderColor: '#000', fill: '#E1E1E1' } },
  { type: 'straight-line', styles: { borderColor: '#000', borderStroke: '1px' } },
  { type: 'square', styles: { borderColor: '#000', borderStroke: '1px' } },
]
