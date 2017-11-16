/**
 * Created by barthclem on 10/15/17.
 */
export class Member {
  username: string;
  isOnline: boolean;
  constructor(name: string, isOnline: boolean) {
    this.username = name;
    this.isOnline = isOnline;
  }

  getName(): string {
    return this.username;
  }

  setOnlineStatus( isOnline: boolean): void {
    this.isOnline = isOnline;
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }
}
