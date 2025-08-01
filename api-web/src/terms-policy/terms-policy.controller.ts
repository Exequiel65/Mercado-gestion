import { Controller, Get, Req } from '@nestjs/common';
import { TermsPolicyService } from './terms-policy.service';

@Controller('terms-policy')
export class TermsPolicyController {
  constructor(private readonly termsPolicyService: TermsPolicyService) {}

  @Get("terms")
  async findTerms(@Req() req) {
    const entityId = req['entityId'];
    return await this.termsPolicyService.findTerms(entityId);
  }

  @Get("policy")
  async findPolicy(@Req() req) {
    const entityId = req['entityId'];
    return await this.termsPolicyService.findPolicy(entityId);
  }

  @Get("faq")
  async findFaq(@Req() req) {
    const entityId = req['entityId'];
    return await this.termsPolicyService.findFaq(entityId);
  }
}
