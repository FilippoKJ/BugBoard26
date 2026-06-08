import { CreateUserRequest } from '../dto/CreateUserRequest.js';

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  create = async (request, response, next) => {
    try {
      const createUserRequest = CreateUserRequest.from(request.body);
      const user = await this.userService.createUser(
        createUserRequest.email,
        createUserRequest.password,
        createUserRequest.role
      );
      response.status(201).json({ user: user.toSafeObject() });
    } catch (error) {
      next(error);
    }
  };
}
