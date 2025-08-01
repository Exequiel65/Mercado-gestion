import { Test, TestingModule } from '@nestjs/testing';
import { TermsPolicyController } from './terms-policy.controller';
import { TermsPolicyService } from './terms-policy.service';

describe('TermsPolicyController', () => {
  let controller: TermsPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TermsPolicyController],
      providers: [TermsPolicyService],
    }).compile();

    controller = module.get<TermsPolicyController>(TermsPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
