
export type TLocation = 'room' | 'directory' | 'workspace' | 'workspace:waiting' | 'workspace:error' | 'workspace:loading'

export interface ILocationConstructor {
  location: TLocation
  hash: string
}

export class LocationEntity {
  public location: TLocation = 'directory'
  public hash: string

  constructor (data?: ILocationConstructor) {
    this.location = data?.location || 'directory'
    this.hash = data?.hash || ''
  }

  public get value () {
    const params = [this.location, this.hash]
    return params.join('#')
  }
}
