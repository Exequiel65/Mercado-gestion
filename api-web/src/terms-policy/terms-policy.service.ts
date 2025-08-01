import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TermsAndConditions } from './entities/terms.entity';
import { Repository } from 'typeorm';
import { Policy } from './entities/policy.entity';
import { FrequentlyQuestion } from './entities/frequentlyQuestion.entity';

@Injectable()
export class TermsPolicyService {
  @InjectRepository(TermsAndConditions)
  private readonly termsRepository: Repository<TermsAndConditions>;

  @InjectRepository(Policy)
  private readonly policyRepository: Repository<Policy>;

  @InjectRepository(FrequentlyQuestion)
  private readonly faqRepository: Repository<FrequentlyQuestion>;

  async findTerms(entityId: number) {
    return await this.termsRepository.findOne({
      where: { entityId },
      order: { createdAt: 'DESC' },
    });
  }

  async findPolicy(entityId: number) {
    return await this.policyRepository.findOne({
      where: { entityId },
      order: { createdAt: 'DESC' },
    });
  }
  async findFaq(entityId: number) {
    return await this.faqRepository.findOne({
      where: { entityId },
      order: { createdAt: 'DESC' },
    });
  }


}
