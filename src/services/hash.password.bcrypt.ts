import {inject} from '@loopback/core';
import {compare, genSalt, hash} from 'bcryptjs';

interface PasswordHasher<T = string>{
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}

export class BcrpytHasher implements PasswordHasher<string>{
  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    const passwordMatched = await compare(providedPass, storedPass);
    return passwordMatched;
  }

  @inject('rounds')
  public readonly round:number;
  async hashPassword(password:string){
    const salt = await genSalt(this.round);
    return await hash(password,salt);
  }
}
