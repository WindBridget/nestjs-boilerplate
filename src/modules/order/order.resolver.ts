import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Order } from 'modules/order/schemas/order.schema';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { CancelOrderDto } from './dtos/cancelOrder.dto';
import { FillOrderDto } from './dtos/fillOrder.dto';
import { UpdateOrderPriceDto } from './dtos/updateOrderPrice.dto';

import { OrderService } from './order.service';
import { CurrentUser } from '../auth/guards/user.decorator';
import { User } from '../user/schemas/user.schema';

@Resolver(Order)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class OrderResolver {
  private readonly logger = new BackendLogger(OrderResolver.name);

  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  @Roles(roles.USER)
  async createOrder(
    @Args() dto: CreateOrderDto,
    @CurrentUser() user: User,
  ) {
    return this.orderService.create(dto, user);
  }

  @Query(() => [Order])
  @Roles(roles.USER)
  async listOrders() {
    return this.orderService.findAll();
  }

  @Mutation(() => Order)
  @Roles(roles.USER)
  async updateOrderPrice(
    @Args() dto: UpdateOrderPriceDto,
    @CurrentUser() user: User,
  ) {
    return this.orderService.updatePrice(dto, user);
  }

  // @Mutation(() => Order)
  // @Roles(roles.USER)
  // async fillOrder(@Args() dto: FillOrderDto) {
  //   return this.orderService.fillOrder(dto);
  // }

  // @Mutation(() => Order)
  // @Roles(roles.USER)
  // async cancelOrder(@Args() dto: CancelOrderDto) {
  //   return this.orderService.cancelOrder(dto);
  // }

  @Mutation(() => Order)
  @Roles(roles.USER)
  async deleteOrders() {
    await this.orderService.deleteAll();
    return this.orderService.findAll();
  }
}
