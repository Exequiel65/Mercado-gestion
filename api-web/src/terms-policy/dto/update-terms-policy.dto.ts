import { PartialType } from '@nestjs/mapped-types';
import { CreateTermsPolicyDto } from './create-terms-policy.dto';

export class UpdateTermsPolicyDto extends PartialType(CreateTermsPolicyDto) {}
