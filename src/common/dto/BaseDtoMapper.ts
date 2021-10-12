import { deepFind } from 'common/util';
import _ from 'lodash';
import 'reflect-metadata';

const symbolFromMap = Symbol('SymbolFromMap');

export type MapperFunction<A = any, B = any> = (data: A, prop: string) => B;

export type MapperClass = new (...args) => any;

export const SIMPLE_DTO_MAPPER_FN: MapperFunction = (val) => val;

export const getFromFn =
  (propKey: string | MapperFunction) => (model: any, prop) =>
    deepFind(model, propKey || prop);

export class ValueMappingFailedError extends Error {
  constructor(reason: string) {
    super(`Failed to map value: ${reason}`);
    Error.captureStackTrace(this);
  }
}

export interface MapperProp {
  mapper: MapperFunction | MapperClass;
  fromFn: MapperFunction;
  propKey: string;
  multiple: boolean;
  defaultVal?: any;
}

export interface MapperProps {
  [key: string]: MapperProp;
}

// tslint:disable-next-line:max-classes-per-file
export class DtoMapper<DTOAttributes = any> {
  public mapperProps: MapperProps;

  constructor(data?: DTOAttributes) {
    // init prop own
    this.mapping(data);
    Reflect.defineMetadata(symbolFromMap, this.mapping.bind(this), this);
  }

  protected mapping(data: any): any {
    if (!data) {
      return;
    }

    if (this.mapperProps) {
      for (const prop of Object.keys(this.mapperProps)) {
        if (this[prop] instanceof DtoMapper) {
          // support deep mapping
          this.mappingChild(this, data, prop);
          continue;
        }
        const value = this.getDataFromSource(data, this.mapperProps[prop]);
        if (typeof value !== 'undefined') {
          this[prop] = value;
        }
      }
    }
  }

  private mappingChild(object, data: any, prop: any): any {
    const value = this.getDataFromSource(data, this.mapperProps[prop]);
    if (typeof object[prop] !== 'undefined') {
      object[prop].from(value);
    }
  }

  private getDataFromSource(data: any, prop: MapperProp, ...agh): any {
    let preValue = prop.defaultVal;
    try {
      preValue = prop.fromFn(data, prop.propKey);
    } catch (ex) {
      console.log('ERROR MAPPING ATTR', ex);
    }

    const rawValue = !_.isUndefined(preValue) ? preValue : prop.defaultVal;

    if (_.isObject(rawValue) && _.isEmpty(rawValue) && prop.multiple) {
      return rawValue;
    }

    const value = prop.multiple
      ? this.mapMultipleValue(rawValue, prop.mapper)
      : this.mapValue(rawValue, prop.mapper);
    if (typeof value === 'undefined') {
      return value;
    }

    return value;
  }

  private mapMultipleValue(value, mapper: MapperFunction | MapperClass) {
    if (_.isArray(value)) {
      return value.map((val) => this.mapValue(val, mapper));
    } else if (_.isObject(value)) {
      return _.mapValues(value, (val) => this.mapValue(val, mapper));
    }
    return this.mapValue(value, mapper);
  }

  private mapValue(value: any, mapper: MapperFunction | MapperClass) {
    try {
      if (this.isClass(mapper)) {
        return new (mapper as MapperClass)(value);
      } else if (_.isFunction(mapper)) {
        // tslint:disable-next-line:ban-types
        return (mapper as Function)(value);
      }
    } catch (e) {
      throw new ValueMappingFailedError(e.message);
    }
  }

  private isClass(fn: any) {
    return /^\s*class/.test(fn.toString());
  }
}

export function MapFrom(
  fromProp?: string | MapperFunction,
  mapper?: MapperFunction | MapperClass,
  multiple?: boolean,
  defaultVal?: any,
) {
  return (target, propKey: string) => {
    if (!target.mapperProps) {
      target.mapperProps = {};
    }
    mapper = mapper ? mapper : SIMPLE_DTO_MAPPER_FN;
    fromProp = fromProp ? fromProp : propKey;
    const fromFn = _.isFunction(fromProp) ? fromProp : getFromFn(fromProp);
    multiple = multiple ? true : false;
    target.mapperProps[propKey] = {
      mapper,
      fromFn,
      propKey,
      multiple,
      defaultVal,
    };
  };
}

export type IDtoMapper<T = any> = new (source: T) => IDtoMapper<T>;

export function MappedDto(target: any) {
  // save a reference to the original constructor
  const original = target;

  // the new constructor behaviour
  const f: any = (...args) => {
    const instance = new original(args);
    if (instance.mapperProps) {
      const mapper = new DtoMapper();
      mapper.mapperProps = instance.mapperProps;
      const __from__ = Reflect.getMetadata(symbolFromMap, mapper);
      __from__(args[0]);
      Object.assign(instance, mapper);
      delete instance.mapperProps;
    }
    return instance;
  };

  // copy prototype so intanceof operator still works
  f.prototype = original.prototype;

  // return new constructor (will override original)
  return f;
}
