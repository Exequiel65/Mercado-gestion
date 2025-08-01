import { Test, TestingModule } from '@nestjs/testing';
import { TermsPolicyService } from './terms-policy.service';

describe('TermsPolicyService', () => {
  let service: TermsPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TermsPolicyService],
    }).compile();

    service = module.get<TermsPolicyService>(TermsPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
