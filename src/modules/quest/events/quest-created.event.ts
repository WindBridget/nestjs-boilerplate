import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';

export class QuestCreatedEvent extends DtoMapper {
  @MapFrom()
  userId: string;
}
