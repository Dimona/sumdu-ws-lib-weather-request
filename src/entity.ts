import { TRequest, WeatherInfo, WeatherPayload } from './types';
import {
  Attribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  AutoGenerateAttribute,
  Entity,
  INDEX_TYPE,
} from '@typedorm/common';
import { default as crypto } from 'crypto';
import { AwsDynamodbEntity } from '@workshop/lib-nest-aws/dist/services/dynamodb';
import { statusNextTimeIndex } from './constants';

@Entity({
  name: 'WeatherRequest',
  primaryKey: {
    partitionKey: '{{id}}',
    sortKey: '{{targetDate}}',
  },
  indexes: {
    [statusNextTimeIndex]: {
      partitionKey: '{{status}}',
      sortKey: '{{nextTime}}',
      type: INDEX_TYPE.GSI,
    },
  },
})
export class WeatherRequestEntity extends AwsDynamodbEntity<TRequest<WeatherPayload>> {
  @Attribute({ unique: true })
  id: string;

  @Attribute()
  targetDate: string;

  @Attribute()
  email: string;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
    autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
  })
  createdAt?: number;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
    autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
  })
  updatedAt?: number;

  @Attribute()
  status: string;

  @Attribute()
  nextTime: number;

  @Attribute()
  expireAt?: number;

  @Attribute()
  payload: WeatherPayload;

  @Attribute()
  error?: any;

  @Attribute()
  data?: WeatherInfo;

  static buildRequestId(email: string, { latitude, longitude }: { latitude: number; longitude: number }): string {
    return crypto
      .createHash('shake256', { outputLength: 10 })
      .update(`${email}|${latitude}|${longitude}`)
      .digest('hex');
  }
}
