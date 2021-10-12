import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { Order } from 'modules/order/schemas/order.schema';
import { User } from 'modules/user/schemas/user.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { EOrderStatus } from '../../common/constant/gameConstants';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(
    @InjectModel(Order) private readonly resourceModel: ModelType<Order>,
  ) {
    super(resourceModel);
  }

  async create(dto: CreateOrderDto, user: User): Promise<Order> {
    const order = new this.resourceModel(dto);
    order.sellerAddress = user.walletAddress;
    order.sellerUser = user._id;
    order.status = EOrderStatus.OPEN;
    return await order.save();
  }
}
