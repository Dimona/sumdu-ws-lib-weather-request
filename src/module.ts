import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsDynamodbModule, AwsDynamodbModuleOptions } from '@workshop/lib-nest-aws/dist/services/dynamodb';
import { awsDynamodbConfig } from './aws.dynamodb.config';
import { AWS_DYNAMODB_CONFIG } from './aws.dynamodb.constants';
import { WeatherRequestService } from './service';

@Module({
  imports: [
    ConfigModule.forFeature(awsDynamodbConfig),
    AwsDynamodbModule.registerAsync({
      useFactory(configService: ConfigService) {
        return configService.get<AwsDynamodbModuleOptions>(AWS_DYNAMODB_CONFIG);
      },
      inject: [ConfigService],
    }),
  ],
  providers: [WeatherRequestService],
  exports: [WeatherRequestService],
})
export class WeatherRequestModule {}
