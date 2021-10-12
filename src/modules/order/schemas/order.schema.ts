import { EOrderStatus } from 'common/constant/gameConstants';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Order extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  sellerAddress: string;

  @prop()
  @Field({ nullable: true })
  sellerUser: string;

  @prop()
  @Field()
  price: number;

  @prop()
  @Field({ nullable: true })
  buyerAddress: string;

  @prop()
  @Field({ nullable: true })
  buyerUser: string;

  @prop()
  @Field()
  nftId: number;

  @prop()
  @Field({ defaultValue: EOrderStatus.OPEN })
  status: number;
}

export const ResourceModel = new Order().getModelForClass(Order, {
  schemaOptions: { timestamps: true },
});
