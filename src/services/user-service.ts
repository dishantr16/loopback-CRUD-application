import {UserService, UserProfile} from '@loopback/authentication';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {User} from '../models';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {BcrpytHasher} from './hash.password.bcrypt';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcrpytHasher,
  ) {}
  async verifyCredentials(credentials: Credentials): Promise<User> {
    //
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `user not found with this ${credentials.email}`,
      );
    }

    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      foundUser.password,
    );
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('password is not valid');
    }
    return foundUser;
  }
  convertToUserProfile(user: User): UserProfile {
    let userName = '';
    if (user.firstname) {
      userName = user.firstname;
    }
    if (user.lastname) {
      userName = user.firstname
        ? `${user.firstname} ${user.lastname}`
        : user.lastname;
    }
    return {id: `${user.id}`, name: userName}
  }
}
