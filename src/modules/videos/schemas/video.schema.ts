import { roles } from 'common/constant/constants';
import { Authorized, Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Video extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop({ default: '' })
  @Field()
  description: string;
}

export const VideoModel = new Video().getModelForClass(Video, {
  schemaOptions: { timestamps: true },
});
