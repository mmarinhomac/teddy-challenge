import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class RootController {
  @Public()
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
