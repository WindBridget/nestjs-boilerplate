import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';
import { BundleDto } from './bundle.dto';

@ObjectType()
export class BundleVersionDto extends DtoMapper {
  @Field()
  @MapFrom('bundleVersion.value')
  bundleVersion: string;

  @Field(() => [BundleDto], {defaultValue: []})
  @MapFrom((data) =>
    data.bundlesPriority.map((bundle) => new BundleDto(bundle)),
  )
  bundlesPriority: BundleDto[];

  @Field()
  @MapFrom('bundleUrl.value')
  bundleUrl: string;
}
