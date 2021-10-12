export const DEFAULT_USER_NAME = 'Warrior';
export const DEFAULT_AVATAR_CODE = 'CODE_AVATAR';
export const DEFAULT_PAGE = 0;
export const DEFAULT_LIMIT = 6;
export const DEFAULT_CAMPAIGN_STAGE = 1;
export const DEFAULT_ENERGY_COST = 2;
export const DEFAULT_ENERGY_REGEN = 1;
export const DEFAULT_ENERGY_REGEN_TIME = 1;
export const DEFAULT_INIT_WARRIORS = 3;
export const DEFAULT_WARRIOR_MAXIMUN_QUANTITY = 100;
export const DEFAULT_WARRIOR_PRICE = 100;
export const WARRIOR_EXP_PROGRESS_SEED = 0.2;
export const WARRIOR_EXP_PROGRESS_ALPHA = 0.975;
export const WARRIOR_EXP_PROGRESS_POW = 3;
export const WARRIOR_DMG_PROGRESS_ALPHA = 10;
export const WARRIOR_ATKSPD_PROGRESS_ALPHA = 10;
export const WARRIOR_DEFAULT_PRICE = 3;
export const WARRIOR_LIMIT = 6;
export const DEFAULT_MAX_ENERGY = 100;

export enum EWarriorDmgBeta {
  HUMAN = 50,
  DRAGON = 52,
  ELF = 48,
  ROBOT = 49,
  DEMON = 51,
}

export enum EWarriorAtkSpdBeta {
  HUMAN = 100,
  DRAGON = 96,
  ELF = 104,
  ROBOT = 102,
  DEMON = 98,
}

export enum CONVERT_TIME {
  DAY = 1000 * 60 * 60 * 24,
  HOUR = 1000 * 60 * 60,
  MINUTE = 1000 * 60,
  SECOND = 1000,
  HALF_DAY = 1000 * 60 * 60 * 12,
}

export enum ESkillWarrior {
  Skill_Bumblebee = 'Skill_Bumblebee',
  Skill_Bulkhead = 'Skill_Bulkhead',
  Skill_Earth1 = 'Skill_Earth1',
  Skill_Earth2 = 'Skill_Earth2',
  Skill_Fire1 = 'Skill_Fire1',
  Skill_Fire2 = 'Skill_Fire2',
  Skill_Optimus = 'Skill_Optimus',
  Skill_Ultramagnus = 'Skill_Ultramagnus',
  Skill_Water1 = 'Skill_Water1',
  Skill_Water2 = 'Skill_Water2',
  Skill_Wind1 = 'Skill_Wind1',
  Skill_Wind2 = 'Skill_Wind2',
}

export enum EWarriorConfigType {
  WARRIOR_TYPE = 'WARRIOR_TYPE',
  WARRIOR_ELEMENT = 'WARRIOR_ELEMENT',
  WARRIOR_RARITY = 'WARRIOR_RARITY',
  WARRIOR_ROLE = 'WARRIOR_ROLE',
}
export enum EUserStatus {
  PENDING = 'PENDING',
  MISSING_MAIL = 'MISSING_MAIL',
  VERIFY_MAIL = 'VERIFY_MAIL',
  MISSING_NAME = 'MISSING_NAME',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum EResourceType {
  OTHER = 'OTHER',
  CURRENCY = 'CURRENCY',
  RESOURCE = 'RESOURCE',
  MATERIAL_ITEM = 'MATERIAL_ITEM',
}

export enum EResourceElement {
  None = 'NONE',
  Metal = 'METAL',
  Water = 'WATER',
  Fire = 'FIRE',
  earth = 'EARTH',
  Grass = 'GRASS',
}

export enum EResourceCode {
  COIN = 'COIN',
  ENERGY = 'ENERGY',
  MATERIAL = 'MATERIAL',
  MINERAL = 'MINERAL',
  ESSEN = 'ESSEN',
}

export enum ECurrencyCode {
  TOKEN = 'TOKEN',
}

export enum EItemCode {
  FIRE = 'FIRE',
}

export enum EUserWarriorStatus {
  MAIN = 'MAIN',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  OWNED = 'OWNED',
  PENDING = 'PENDING',
  IN_MARKET = 'IN_MARKET',
  SYSTEM = 'SYSTEM',
}

export enum EWarriorType {
  HUMAN = 'HUMAN',
  DRAGON = 'DRAGON',
  ELF = 'ELF',
  ROBOT = 'ROBOT',
  DEMON = 'DEMON',
}

export enum EWarriorRole {
  TANKER = 'TANKER',
  FIGHTER = 'FIGHTER',
  ARCHER = 'ARCHER',
  MAGE = 'MAGE',
  SUPPORTER = 'SUPPORTER',
}

export enum EWarriorRarity {
  Common = 'COMMON',
  Rare = 'RARE',
  Epic = 'EPIC',
  Legend = 'LEGEND',
}

export enum EWarriorStatus {
  Draft = 'DRAFT',
  Test = 'TEST',
  Released = 'RELEASED',
}

export enum EWarriorSyncRate {
  CommonMin = 1,
  CommonMax = 30,
  RareMin = 5,
  RareMax = 30,
  EpicMin = 10,
  EpicMax = 40,
  LegendMin = 20,
  LegendMax = 50,
}

export enum EBoxType {
  Common = 'COMMON',
  Nft = 'NFT',
}

export enum EBoxStatus {
  Released = 'RELEASED',
  Sold = 'SOLD',
  Expried = 'EXPRIED',
}

export enum EQuestType {
  USER = 'USER',
  SYSYEM = 'SYSYEM',
  BEGINNER_LOGIN_REWARD = 'BEGINNER_LOGIN_REWARD',
}

export enum EQuestStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum EQuestHasClaimed {
  YES = 'YES',
  NO = 'NO',
  LOCKED = 'LOCKED',
}

export enum EUserRewardId {
  NULL = 'NULL',
}

export enum EUserQuestStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum EQuestTotalByType {
  BEGINNER_LOGIN_REWARD_TOTAL = 7,
}

export enum ECampaignEnergyCost {
  ADVENTURE = 2,
}

export enum EScheduleStatus {
  Pending = 'PENDING',
  Executing = 'EXECUTING',
}

export enum EWarriorSize {
  THIN = 'THIN',
  FAT = 'FAT',
}

export enum EGoalType {
  RANK = 'RANK',
  LEVEL = 'LEVEL',
  MONTHLY = 'MONTHLY',
}

export enum EOrderStatus {
  CANCELLED = -1,
  OPEN = 0,
  FILL = 1,
}

export const LIST_TYPE = [
  EWarriorType.HUMAN,
  EWarriorType.DRAGON,
  EWarriorType.ELF,
  EWarriorType.ROBOT,
  EWarriorType.DEMON,
];

export enum RangeEffect {
  single = 1,
  multiple = 4,
  aoe = 7,
}

export enum SkillEffect {
  None = 'NONE',
  Repel = 'REPEL',
  Slow = 'SLOW',
  Stun = 'STUN',
  Burn = 'BURN',
}

export const LIST_TYPE_THIN = [
  EWarriorType.HUMAN,
  EWarriorType.DRAGON,
  EWarriorType.ELF,
];

export const LIST_TYPE_FAT = [EWarriorType.ROBOT, EWarriorType.DEMON];

export const LIST_ROLE = [
  EWarriorRole.TANKER,
  EWarriorRole.FIGHTER,
  EWarriorRole.ARCHER,
  EWarriorRole.MAGE,
  EWarriorRole.SUPPORTER,
];

export const LIST_RARITY = [
  EWarriorRarity.Common,
  EWarriorRarity.Rare,
  EWarriorRarity.Epic,
  EWarriorRarity.Legend,
];

export const LIST_ELEMENT = [
  EResourceElement.Fire,
  EResourceElement.Metal,
  EResourceElement.Water,
  EResourceElement.Grass,
  EResourceElement.earth,
];

export const SKILL = [
  ESkillWarrior.Skill_Bumblebee,
  ESkillWarrior.Skill_Bulkhead,
  ESkillWarrior.Skill_Earth1,
  ESkillWarrior.Skill_Earth2,
  ESkillWarrior.Skill_Fire1,
  ESkillWarrior.Skill_Fire2,
  ESkillWarrior.Skill_Optimus,
  ESkillWarrior.Skill_Ultramagnus,
  ESkillWarrior.Skill_Water1,
  ESkillWarrior.Skill_Water2,
  ESkillWarrior.Skill_Wind1,
  ESkillWarrior.Skill_Wind2,
];

export const HUMAN = [
  'HUMAN_01',
  'HUMAN_02',
  'HUMAN_03',
  'HUMAN_04',
  'HUMAN_05',
  'HUMAN_06',
  'HUMAN_07',
  'HUMAN_08',
  'HUMAN_09',
  'HUMAN_10',
];

export const ROBOT = ['ROBOT_01', 'ROBOT_02', 'ROBOT_03'];

export const DEMON = ['DEMON_01', 'DEMON_02', 'DEMON_03'];

export const ELF = ['ELF_01'];

export const DRAGON = ['DRAGON_01'];
