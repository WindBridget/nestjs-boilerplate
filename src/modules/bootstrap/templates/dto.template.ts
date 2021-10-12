export const dtoTemplate = (name: string, className: string) => {
  return `
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class ${className}Dto {
  @Field()
  field: string;
}
`;
};
