import { Injectable } from '@nestjs/common';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Order } from 'modules/order/schemas/order.schema';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { CancelOrderDto } from './dtos/cancelOrder.dto';
import { FillOrderDto } from './dtos/fillOrder.dto';
import { UpdateOrderPriceDto } from './dtos/updateOrderPrice.dto';
import { OrderRepository } from './order.repository';
import { User } from 'modules/user/schemas/user.schema';
import { EOrderStatus } from '../../common/constant/gameConstants';

@Injectable()
export class OrderService {
  private readonly logger = new BackendLogger(OrderService.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async create(dto: CreateOrderDto, user: User): Promise<Order> {
    return await this.orderRepository.create(dto, user);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }

  async deleteAll() {
    return await this.orderRepository.deleteMany();
  }

  async updatePrice(dto: UpdateOrderPriceDto, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      _id: dto.orderId,
    });

    if (order.status !== EOrderStatus.OPEN) {
      throw new Error('Order is not open');
    }

    if (
      order.sellerAddress !== user.walletAddress ||
      order.sellerUser.toString() !== user._id.toString()
    ) {
      throw new Error('Invalid order creator');
    }

    order.price = dto.price;
    await order.save();
    return order;
  }

  // async fillOrder(dto: FillOrderDto): Promise<Order> {
  //   return await this.orderRepository.create(dto);
  // }

  async cancelOrder(dto: CancelOrderDto, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      _id: dto.orderId,
    });

    if (!this._checkOwnerOrder(order, user)) {
      throw new Error('Invalid order creator');
    }

    if (!this._checkOpenOrder(order)) {
      throw new Error('Order is not open');
    }

    order.status = EOrderStatus.CANCELLED;
    await order.save();
    return order;
  }

  _checkOwnerOrder(order: Order, user: User): boolean {
    return (order.sellerAddress === user.walletAddress) &&
      order.sellerUser.toString() === user._id.toString();
  }

  _checkOpenOrder(order: Order): boolean {
    return order.status === EOrderStatus.OPEN;
  }
}
