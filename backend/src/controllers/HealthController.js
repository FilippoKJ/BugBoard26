export class HealthController {
  constructor(healthService) {
    this.healthService = healthService;
  }

  getStatus = (_request, response, next) => {
    try {
      response.status(200).json(this.healthService.getStatus());
    } catch (error) {
      next(error);
    }
  };
}
