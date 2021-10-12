import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Order } from './schemas/order.schema';
import { OrderRepository } from './order.repository';

@Module({
  imports: [TypegooseModule.forFeature([Order])],
  controllers: [],
  providers: [
    OrderService,
    OrderResolver,
    OrderRepository,
  ],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
