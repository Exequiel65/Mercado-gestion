import { Module } from '@nestjs/common';
import { TermsPolicyService } from './terms-policy.service';
import { TermsPolicyController } from './terms-policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsAndConditions } from './entities/terms.entity';
import { Policy } from './entities/policy.entity';
import { FrequentlyQuestion } from './entities/frequentlyQuestion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TermsAndConditions, Policy, FrequentlyQuestion]) // Assuming TermsPolicy is the entity for terms and policies
  ],
  controllers: [TermsPolicyController],
  providers: [TermsPolicyService],
})
export class TermsPolicyModule {}
