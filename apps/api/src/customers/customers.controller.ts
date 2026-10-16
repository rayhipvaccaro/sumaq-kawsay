import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { TokenUser } from '../auth/area.util';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomersService } from './customers.service';
import type { EnsureInput } from './customers.service';

type AuthedReq = Request & { user: TokenUser };

function need(user: TokenUser) {
  if (!user.isAdmin && !user.permissions.includes('customers.reset')) {
    throw new ForbiddenException('Sin permiso');
  }
}

@Controller('customers')
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  // Solo lo llama el servidor web. Si INTERNAL_API_KEY esta puesta, la pide.
  @Post('ensure')
  ensure(@Body() body: EnsureInput, @Headers('x-internal-key') key?: string) {
    const expected = process.env.INTERNAL_API_KEY;
    if (expected && key !== expected) {
      throw new UnauthorizedException('Sin permiso');
    }
    return this.customers.ensureTourist(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Req() req: AuthedReq) {
    need(req.user);
    return this.customers.list();
  }

  @Post(':id/reset-password')
  @UseGuards(JwtAuthGuard)
  reset(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { docType?: string; docNumber?: string },
    @Req() req: AuthedReq,
  ) {
    need(req.user);
    return this.customers.resetPassword(id, req.user.sub, req.ip, body);
  }
}
