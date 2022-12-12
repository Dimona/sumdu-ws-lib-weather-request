import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Injectable } from '@nestjs/common';
import { AwsDynamodbService } from '@workshop/lib-nest-aws/dist/services/dynamodb';
import {
  EntityManager,
  EntityManagerCountOptions,
  EntityManagerFindOptions,
  EntityManagerUpdateOptions,
} from '@typedorm/core';
import { EntityAttributes } from '@typedorm/common';
import { UpdateBody } from '@typedorm/core/cjs/src/classes/expression/update-body-type';
import { EntityManagerCreateOptions } from '@typedorm/core/cjs/src/classes/manager/entity-manager';
import { FindResults } from './aws.dynamodb.types';
import { WEATHER_REQUESTS } from './constants';
import { WeatherRequestEntity } from './entity';

dayjs.extend(customParseFormat);

@Injectable()
export class WeatherRequestService {
  private readonly entityManager: EntityManager;

  constructor(private readonly awsDynamodbService: AwsDynamodbService) {
    this.entityManager = this.awsDynamodbService.getEntityManager(WEATHER_REQUESTS);
  }

  create(
    entity: WeatherRequestEntity,
    options?: EntityManagerCreateOptions<WeatherRequestEntity>,
  ): Promise<WeatherRequestEntity> {
    return this.entityManager.create(entity, options);
  }

  delete(id: string, targetDate: string): Promise<{ success: boolean }> {
    return this.entityManager.delete(WeatherRequestEntity, { id, targetDate });
  }

  async count({
    partitionKey,
    queryOptions,
  }: {
    partitionKey: Partial<EntityAttributes<WeatherRequestEntity>>;
    queryOptions?: EntityManagerCountOptions<WeatherRequestEntity, Partial<EntityAttributes<WeatherRequestEntity>>>;
  }): Promise<number> {
    return this.entityManager.count(WeatherRequestEntity, partitionKey, queryOptions);
  }

  async find({
    partitionKey,
    queryOptions,
  }: {
    partitionKey: Partial<EntityAttributes<WeatherRequestEntity>>;
    queryOptions?: EntityManagerFindOptions<WeatherRequestEntity, any>;
  }): Promise<FindResults<WeatherRequestEntity>> {
    return this.entityManager.find(WeatherRequestEntity, partitionKey, queryOptions);
  }

  async update({
    primaryKeyAttributes,
    body,
    options,
  }: {
    primaryKeyAttributes: Partial<WeatherRequestEntity>;
    body: UpdateBody<
      Omit<WeatherRequestEntity, 'createdAt' | 'updatedAt'>,
      Omit<WeatherRequestEntity, 'createdAt' | 'updatedAt'>
    >;
    options?: EntityManagerUpdateOptions<Omit<WeatherRequestEntity, 'createdAt' | 'updatedAt'>>;
  }): Promise<WeatherRequestEntity | undefined> {
    return this.entityManager.update(WeatherRequestEntity, primaryKeyAttributes, body, options);
  }
}
