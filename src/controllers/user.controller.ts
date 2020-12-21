import {repository} from '@loopback/repository';
import {UserRepository, Credentials} from '../repositories';
import {post, getJsonSchemaRef, requestBody} from '@loopback/rest';
import {User} from '../models';
import {validateCredentials} from '../services/validator';
import * as _ from 'lodash';
import {inject} from '@loopback/core';
import {BcrpytHasher} from '../services/hash.password.bcrypt';
import {CredentialsRequestBody} from './specs/user.controller.spec';
import {MyUserService} from '../services/user-service';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcrpytHasher,
    @inject('services.user.service')
    public userService: MyUserService,
  ) {}

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async signup(@requestBody() userData: User) {
    validateCredentials(_.pick(userData, ['email', 'password']));

    //encrypt the user password
    // eslint-disable-next-line require-atomic-updates
    userData.password = await this.hasher.hashPassword(userData.password);

    const savedUser = await this.userRepository.create(userData);
    //delete savedUser.password;
    return savedUser;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // make sure user exist, password should be valid
    const user = await this.userService.verifyCredentials(credentials);
    console.log(user);
    const userProfile = this.userService.convertToUserProfile(user);
    console.log(userProfile);

    //generate a json web token
    return Promise.resolve({token: '47289374928734asdads'});
  }
}
