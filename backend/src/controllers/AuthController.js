import { LoginRequest } from '../dto/LoginRequest.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (request, response, next) => {
    try {
      const loginRequest = LoginRequest.from(request.body);
      const result = await this.authService.login(
        loginRequest.email,
        loginRequest.password
      );
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
