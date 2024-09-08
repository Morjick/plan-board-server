import { EventEmitter } from 'events'

export class Emitter<TAction = any> {
  private emitter = new EventEmitter()

  public emit(eventName: TAction, ...eventArg: any) {
    if (!eventArg) return
    this.emitter.emit(eventName as string, ...(eventArg as []))
  }

  public on(eventName: TAction, handler: (...eventArg: any) => void) {
    this.emitter.on(eventName as string, handler as any)
  }

  public off(eventName: TAction, handler: (...eventArg: any) => void) {
    this.emitter.off(eventName as string, handler as any)
  }
}
