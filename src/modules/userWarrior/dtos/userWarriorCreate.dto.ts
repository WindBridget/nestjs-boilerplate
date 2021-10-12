import { Warrior } from 'modules/warrior/schemas/warrior.schema';

export class UserWarriorCreateDto {
  userId: string;

  walletAddress: string;

  warrior: Warrior;

  level: number;

  levelExp: number;

  totalExp: number;

  damage: number;

  attackSpeed: number;

  price: number;

  isLocked: boolean;

  status: string;

  creatationTime: Date;

  nftToken?: number;

  mintTransactionHash?: string;

  sellOrder?: string;

  signature?: string;

  isPutOnMarket: boolean;

  royalties: number;

  totalQuantity?: number;
}
