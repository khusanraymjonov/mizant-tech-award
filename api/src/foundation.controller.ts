import { Controller, Get } from '@nestjs/common';
import { syntheticSolarJourney } from '@mizant/testing';

@Controller()
export class FoundationController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'api', dataMode: 'SYNTHETIC_ONLY' };
  }

  @Get('foundation/reference-journey')
  referenceJourney() {
    return syntheticSolarJourney;
  }
}
