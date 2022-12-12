import { registerAs } from '@nestjs/config';
import { INDEX_TYPE, Table } from '@typedorm/common';
import { AWS_DYNAMODB_API_VERSION, AwsDynamodbModuleOptions } from '@workshop/lib-nest-aws/dist/services/dynamodb';
import { AWS_DYNAMODB_CONFIG } from './aws.dynamodb.constants';
import { statusNextTimeIndex, WEATHER_REQUESTS } from './constants';
import { WeatherRequestEntity } from './entity';

export const awsDynamodbConfig = registerAs(AWS_DYNAMODB_CONFIG, () => {
  const env = process.env.ENVIRONMENT;

  return <AwsDynamodbModuleOptions>{
    client: {
      apiVersion: process.env.AWS_DYNAMODB_API_VERSION || AWS_DYNAMODB_API_VERSION,
      endpoint: env === 'local' ? process.env.DYNAMODB_LOCAL : undefined,
      retryMode: 'standard',
    },
    connections: {
      [WEATHER_REQUESTS]: {
        table: new Table({
          name: `${
            process.env.MOCK_DYNAMODB_ENDPOINT
              ? 'ws-weather-weather-requests-test'
              : process.env.WS_WEATHER_REQUESTS_DYNAMODB_TABLE
          }`,
          partitionKey: 'id',
          sortKey: 'targetDate',
          indexes: {
            [statusNextTimeIndex]: {
              type: INDEX_TYPE.GSI,
              partitionKey: 'status',
              sortKey: 'nextTime',
            },
          },
        }),
        entities: [WeatherRequestEntity],
      },
    },
  };
});
