import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Role extends Typegoose {
  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  // @Authorized([roles.ADMIN])
  enabled: boolean;
}

export const RoleModel = new Role().getModelForClass(Role, {
  schemaOptions: { timestamps: true },
});
