import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'API is healthy.' })
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @ApiOperation({ summary: 'Metrics endpoint' })
  @ApiResponse({ status: 200, description: 'Basic metrics.' })
  @Get('metrics')
  metrics() {
    // Dummy implementation. Integrate with Prometheus/OpenTelemetry for real metrics.
    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }
}
