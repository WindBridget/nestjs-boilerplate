import { UserWarriorBaseStatsDto } from 'modules/userWarrior/dtos/userWarriorBaseStats.dto';
import {
  CONVERT_TIME,
  DEMON,
  DRAGON,
  ELF,
  EWarriorAtkSpdBeta,
  EWarriorDmgBeta,
  EWarriorSize,
  EWarriorType,
  HUMAN,
  LIST_TYPE_FAT,
  LIST_TYPE_THIN,
  ROBOT,
  WARRIOR_ATKSPD_PROGRESS_ALPHA,
  WARRIOR_DMG_PROGRESS_ALPHA,
  WARRIOR_EXP_PROGRESS_ALPHA,
  WARRIOR_EXP_PROGRESS_POW,
  WARRIOR_EXP_PROGRESS_SEED,
} from './constant/gameConstants';
import { randomStr } from 'common/util';

export function warriorName(role: string, type: string): string {
  const token = randomStr(6);
  return 'W-' + role.substring(0, 2) + type.substring(0, 2) + '-' + token;
}

export function getRandom(items: any[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getTypeBySize(initSize: string) {
  return initSize === EWarriorSize.THIN
    ? getRandom(LIST_TYPE_THIN)
    : getRandom(LIST_TYPE_FAT);
}

export function getCodeByType(type: EWarriorType) {
  switch (type) {
    case EWarriorType.HUMAN:
      return getRandom(HUMAN);
    case EWarriorType.ROBOT:
      return getRandom(ROBOT);
    case EWarriorType.DRAGON:
      return getRandom(DRAGON);
    case EWarriorType.DEMON:
      return getRandom(DEMON);
    case EWarriorType.ELF:
      return getRandom(ELF);
    default:
      return '';
  }
}

export function getWarriorStats(
  raw: number,
  syncRate: number,
  fusionRate: number,
) {
  return +Math.floor(raw * (syncRate * 0.01) * (fusionRate * 0.01 + 1));
}

export function getWarriorCurrentStats(raw: number, rate: number) {
  return Math.floor(raw * (rate * 0.01));
}

export function syncWarriorAttribute(
  pointPerUnit: number,
  actual: number,
  current: number,
  raw: number,
) {
  return Math.floor(pointPerUnit * actual * (current / raw) * 0.01);
}

export function generateBaseStats(type: string): UserWarriorBaseStatsDto {
  switch (type) {
    case EWarriorType.HUMAN:
      return {
        damage: getStatsProgression(
          WARRIOR_DMG_PROGRESS_ALPHA,
          EWarriorDmgBeta.HUMAN,
          1,
        ),
        attackSpeed: getStatsProgression(
          WARRIOR_ATKSPD_PROGRESS_ALPHA,
          EWarriorAtkSpdBeta.HUMAN,
          1,
        ),
      };
    case EWarriorType.DEMON:
      return {
        damage: getStatsProgression(
          WARRIOR_DMG_PROGRESS_ALPHA,
          EWarriorDmgBeta.DEMON,
          1,
        ),
        attackSpeed: getStatsProgression(
          WARRIOR_ATKSPD_PROGRESS_ALPHA,
          EWarriorAtkSpdBeta.DEMON,
          1,
        ),
      };
    case EWarriorType.ELF:
      return {
        damage: getStatsProgression(
          WARRIOR_DMG_PROGRESS_ALPHA,
          EWarriorDmgBeta.ELF,
          1,
        ),
        attackSpeed: getStatsProgression(
          WARRIOR_ATKSPD_PROGRESS_ALPHA,
          EWarriorAtkSpdBeta.ELF,
          1,
        ),
      };
    case EWarriorType.ROBOT:
      return {
        damage: getStatsProgression(
          WARRIOR_DMG_PROGRESS_ALPHA,
          EWarriorDmgBeta.ROBOT,
          1,
        ),
        attackSpeed: getStatsProgression(
          WARRIOR_ATKSPD_PROGRESS_ALPHA,
          EWarriorAtkSpdBeta.ROBOT,
          1,
        ),
      };
    case EWarriorType.DRAGON:
      return {
        damage: getStatsProgression(
          WARRIOR_DMG_PROGRESS_ALPHA,
          EWarriorDmgBeta.DRAGON,
          1,
        ),
        attackSpeed: getStatsProgression(
          WARRIOR_ATKSPD_PROGRESS_ALPHA,
          EWarriorAtkSpdBeta.DRAGON,
          1,
        ),
      };
    default:
      return {
        damage: 50,
        attackSpeed: 100,
      };
  }
}

export function getTotalPages(pageSize: number, total: number) {
  // console.log('getTotalPages', pageSize, total, Math.ceil(total / pageSize));
  if (!pageSize) {
    return 0;
  }
  return Math.ceil(total / pageSize);
}

export function getLevelExp(level: number) {
  console.log('getLevelExp', level);
  if (level <= 1) {
    return Math.round(
      getExpProgression(
        WARRIOR_EXP_PROGRESS_SEED,
        WARRIOR_EXP_PROGRESS_ALPHA,
        WARRIOR_EXP_PROGRESS_POW,
        1,
      ),
    );
  }
  const nextLevel = getExpProgression(
    WARRIOR_EXP_PROGRESS_SEED,
    WARRIOR_EXP_PROGRESS_ALPHA,
    WARRIOR_EXP_PROGRESS_POW,
    level + 1,
  );
  const currentLevel = getExpProgression(
    WARRIOR_EXP_PROGRESS_SEED,
    WARRIOR_EXP_PROGRESS_ALPHA,
    WARRIOR_EXP_PROGRESS_POW,
    level,
  );
  const required = nextLevel - currentLevel;
  console.log('getLevelExp', required, nextLevel, currentLevel);
  return required;
}

export function getExpProgression(
  seed: number,
  alpha: number,
  pow: number,
  level: number,
) {
  return Math.round(Math.pow(level, pow) / (seed * Math.pow(alpha, level - 1)));
}

export function getStatsProgression(
  alpha: number,
  beta: number,
  level: number,
) {
  return alpha * level + beta;
}

export function TimeToEndDay() {
  const startDay: Date = new Date(new Date().toDateString());
  const timeToNow: number = new Date().getTime() - startDay.getTime();
  const timezoneResset = +process.env.MEMBER_RESET_TIMEZONE || 7;
  const rs = CONVERT_TIME.DAY - timeToNow - CONVERT_TIME.HOUR * timezoneResset;
  return rs < 0 ? rs + CONVERT_TIME.DAY : rs;
}

export function TimeToMidDay() {
  const startDay: Date = new Date(new Date().toDateString());
  const timeToNow: number = new Date().getTime() - startDay.getTime();
  const timezoneResset = +process.env.MEMBER_RESET_TIMEZONE || 8;
  const rs =
    CONVERT_TIME.HALF_DAY - timeToNow - CONVERT_TIME.HOUR * timezoneResset;
  return rs < 0 ? rs + CONVERT_TIME.DAY : rs;
}
