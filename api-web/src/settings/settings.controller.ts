import { Controller, Get, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }


  @Get("web")
  async getWebConfig(@Req() req) {
    const entityId = req['entityId'];
    return await this.settingsService.findWeb(entityId);
  }


  // @UseGuards(JwtAuthGuard)
  // @Get("home")
  // findHomeSetting() {
  //   return this.settingsService.findHome();
  // }

  @Get("home/web")
  getHomeWebConfig(@Req() req) {
    const entityId = req['entityId'];
    return this.settingsService.findHomeSetting(entityId);
  }

}
