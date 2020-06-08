import { Injectable } from '@angular/core'

import { Subject } from 'rxjs'

/// Notify users about errors and other helpful stuff
export interface Msg {
  content: string
  style: string
}

@Injectable()
export class NotifyService {

  private notify = new Subject<any>()
  notifyObs$ = this.notify.asObservable()

  private _msgSource = new Subject<Msg | null>()
  msg = this._msgSource.asObservable()

  constructor() { }

  public notifyOther(data: any) {
    if (data) {
      this.notify.next(data)
    }
  }

  update(content: string, style: 'error' | 'info' | 'success') {
    const msg: Msg = { content, style }
    this._msgSource.next(msg)
  }

  clear() {
    this._msgSource.next(null)
  }
}
