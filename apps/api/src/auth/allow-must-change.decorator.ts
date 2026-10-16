import { SetMetadata } from '@nestjs/common';

export const ALLOW_MUST_CHANGE = 'allowMustChange';
export const AllowMustChange = () => SetMetadata(ALLOW_MUST_CHANGE, true);