import { EntityManager } from '@typedorm/core';
import { AwsDynamodbService } from '@workshop/lib-nest-aws/dist/services/dynamodb';
import { WeatherRequestService } from './service';
import { WEATHER_REQUESTS } from './constants';
import { createWeatherRequestFixture } from './fixtures';
import { WeatherRequestStatus } from './enums';
import { WeatherRequestEntity } from './entity';

const weatherRequest = createWeatherRequestFixture();

let weatherRequestService: WeatherRequestService;
let awsDynamodbService: AwsDynamodbService;
let entityManager: EntityManager;

beforeEach(() => {
  entityManager = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
  } as any;

  awsDynamodbService = {
    getEntityManager: jest.fn().mockImplementation(() => entityManager),
  } as any;

  weatherRequestService = new WeatherRequestService(awsDynamodbService);
});

test('constructor', () => {
  expect(awsDynamodbService.getEntityManager).toHaveBeenCalledWith(WEATHER_REQUESTS);
});

test('create', async () => {
  (entityManager.create as any).mockImplementation(() => Promise.resolve(weatherRequest));

  const result = await weatherRequestService.create(weatherRequest);

  expect(result).toEqual(weatherRequest);
  expect(entityManager.create).toHaveBeenCalledWith(weatherRequest, undefined);
});

test('update', async () => {
  const res = <WeatherRequestEntity>{ ...weatherRequest, status: WeatherRequestStatus.IN_PROGRESS };
  const params = {
    primaryKeyAttributes: {
      id: weatherRequest.id,
      targetDate: weatherRequest.targetDate,
    },
    body: {
      status: WeatherRequestStatus.IN_PROGRESS,
    },
  };
  (entityManager.update as any).mockImplementation(() => Promise.resolve(res));

  const result = await weatherRequestService.update(params);

  expect(result).toEqual(res);
  expect(entityManager.update).toHaveBeenCalledWith(
    WeatherRequestEntity,
    params.primaryKeyAttributes,
    params.body,
    undefined,
  );
});

test('delete', async () => {
  const res = { success: true };
  (entityManager.delete as any).mockImplementation(() => Promise.resolve(res));

  const result = await weatherRequestService.delete(weatherRequest.id, weatherRequest.targetDate);

  expect(result).toEqual(res);
  expect(entityManager.delete).toHaveBeenCalledWith(WeatherRequestEntity, {
    id: weatherRequest.id,
    targetDate: weatherRequest.targetDate,
  });
});

test('count', async () => {
  const res = 100;
  const params = {
    partitionKey: {
      id: weatherRequest.id,
      targetDate: weatherRequest.targetDate,
    },
  };
  (entityManager.count as any).mockImplementation(() => Promise.resolve(res));

  const result = await weatherRequestService.count(params);

  expect(result).toEqual(res);
  expect(entityManager.count).toHaveBeenCalledWith(WeatherRequestEntity, params.partitionKey, undefined);
});

test('find', async () => {
  const params = {
    partitionKey: {
      id: weatherRequest.id,
      targetDate: weatherRequest.targetDate,
    },
  };
  (entityManager.find as any).mockImplementation(() => Promise.resolve(weatherRequest));

  const result = await weatherRequestService.find(params);

  expect(result).toEqual(weatherRequest);
  expect(entityManager.find).toHaveBeenCalledWith(WeatherRequestEntity, params.partitionKey, undefined);
});
