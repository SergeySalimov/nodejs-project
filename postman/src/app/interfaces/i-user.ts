export class IUser {
  // constructor(
  //     private _token: string,
  //     private _expirationDate: Date,
  // ) {
  // }
  
  // get token() {
  //     if (this._expirationDate && this._expirationDate >= new Date()) {
  //         return this._token;
  //     }
  //
  //     return null;
  // }
  
  public name: string | 'unknown';
  public surname: string | 'unknown';
  public token?: string;
  public id?: string;
  public email?: string;
  public password?: string;
}

export interface IsUserLog {
  log: boolean;
}
