import { roles } from 'common/constant/constants';
import { Authorized, Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class GameConfig extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  key: string;

  @prop()
  @Field()
  value: string;

  @prop({ default: '' })
  @Field()
  description: string;
}

export const GameConfigModel = new GameConfig().getModelForClass(GameConfig, {
  schemaOptions: { timestamps: true },
});
