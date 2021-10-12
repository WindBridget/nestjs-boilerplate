import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class UserMeta extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  userId: string;

  @prop({ default: '' })
  @Field()
  key: string;

  @prop({ default: 0 })
  @Field()
  value: number;

  @prop({ default: false })
  @Field()
  hasLoginToday: boolean;

  @prop({ default: null })
  @Field()
  lastLoginAt: Date;

  @prop()
  @Field()
  updatedAt: Date;

  @prop()
  @Field()
  createdAt: Date;
}

export const UserMetaModel = new UserMeta().getModelForClass(UserMeta, {
  schemaOptions: { timestamps: true },
});
