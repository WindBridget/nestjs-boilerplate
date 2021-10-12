import {
  DEFAULT_AVATAR_CODE,
  DEFAULT_USER_NAME,
  EUserStatus,
} from 'common/constant/gameConstants';
import { WalletAddressScalar as WalletAddress } from 'common/scalars/wallet_address.scalar';
import { Field, ObjectType } from 'type-graphql';
import { arrayProp, prop, Typegoose } from 'typegoose';
import { Role } from './role.schema';
import { Slot } from './slot.schema';

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

  @prop({ default: DEFAULT_USER_NAME })
  @Field({ nullable: true })
  name: string;

  @prop({ default: DEFAULT_AVATAR_CODE })
  @Field({ nullable: true })
  avatarCode: string;

  @prop({ required: true })
  @Field(() => WalletAddress, { nullable: false })
  walletAddress: string;

  @prop({ default: '' })
  @Field({ nullable: true })
  walletSignature: string;

  @prop({ default: EUserStatus.PENDING })
  @Field({ nullable: true })
  status: string;

  @arrayProp({ items: Slot })
  @Field(() => [Slot], { defaultValue: [] })
  team: Slot[];

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

  @prop({ default: 1 })
  @Field()
  campaignStage: number;

  @prop()
  @Field({ nullable: true })
  timeFinishStage: Date;

  @prop()
  @Field({ nullable: true })
  updatedAt: Date;

  @prop()
  @Field({ nullable: true })
  createdAt: Date;

  @prop({ default: 1 })
  @Field()
  level: number;

  @prop({ default: 0 })
  @Field()
  levelExp: number;

  @prop({ default: 0 })
  @Field()
  totalExp: number;

  @prop({ default: 1000 })
  @Field({ nullable: true })
  health: number;

  @prop({ default: 100 })
  @Field({ nullable: true })
  mana: number;

  @prop({ default: 100 })
  @Field({ nullable: true })
  test: number;

  @prop({ default: 1 })
  @Field({ nullable: true })
  dailyRewardStage: number;

  @prop({ default: false })
  @Field({ nullable: true })
  haveDailyReward: boolean; // == onlineToday

  @prop({ default: 100 })
  @Field()
  energy: number;
}

export const UserModel = new User().getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
