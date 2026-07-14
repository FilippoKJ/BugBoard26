export class HealthController {
  constructor(healthService) {
    this.healthService = healthService;
  }

  getStatus = async (_request, response, next) => {
    try {
      response.status(200).json(await this.healthService.getStatus());
    } catch (error) {
      next(error);
    }
  };
}
