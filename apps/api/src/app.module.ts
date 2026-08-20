import { Module } from '@nestjs/common';
import { FoundationController } from './foundation.controller.js';
import { TokenisationController } from './tokenisation.controller.js';

@Module({ controllers: [FoundationController, TokenisationController] })
export class AppModule {}
