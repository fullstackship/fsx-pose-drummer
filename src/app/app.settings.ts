import { Injectable } from '@angular/core'

export class Settings {
  constructor(public name: string,
    public theme: string
  ) { }
}

@Injectable()
export class AppSettings {
  public settings = new Settings(
    'PoseDrummer',
    '' // theme name
  )
}
