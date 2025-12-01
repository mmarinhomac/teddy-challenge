import { Controller, Get } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  root() {
    return {
      name: 'Teddy Open Finance API',
      status: 'ok',
      health: '/api/healthz',
      docs: '/docs',
    };
  }
}
