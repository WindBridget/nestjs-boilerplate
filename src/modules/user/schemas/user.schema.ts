import { EUserStatus } from 'common/constant/gameConstants';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';
import { Role } from './role.schema';

@ObjectType()
// @pre<User>('save', function(next) {
//   // Only hash the password if the field has been modified. In other words, don't generate
//   // a new hash each time the user doc is saved.
//   if (!this.isModified('password')) {
//     return next();
//   }

//   // Hash the password before saving
//   this.password = bcryptjs.hashSync((this as any).password, 10);

//   next();
// })
export class User extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop({ default: null })
  @Field({ nullable: true })
  email: string;

  @prop()
  password: string;

  @prop()
  @Field({ nullable: true })
  name: string;

  @prop({ default: EUserStatus.PENDING })
  @Field({ nullable: true })
  status: string;

  @prop({ default: [] })
  @Field(() => [Role], { defaultValue: [] })
  roles: Role[];

  @prop()
  @Field({ nullable: true })
  verificationToken: string;

  @prop()
  @Field({ nullable: true })
  resetToken: string;

  @prop()
  @Field({ nullable: true })
  resetTokenExpires: Date;

  @prop()
  @Field({ nullable: true })
  passwordReset: Date;

  @prop()
  @Field({ nullable: true })
  updatedAt: Date;

  @prop()
  @Field({ nullable: true })
  createdAt: Date;
}

export const UserModel = new User().getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
