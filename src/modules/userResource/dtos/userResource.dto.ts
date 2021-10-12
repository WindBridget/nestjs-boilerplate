import { Resource } from 'modules/resource/schemas/resource.schema';

export class UserResourceDto {
  public userId?: string;

  public resource: Resource;
}
