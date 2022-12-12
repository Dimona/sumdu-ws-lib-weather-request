import { WeatherRequestEntity } from './entity';
import { faker } from '@faker-js/faker';
import { WeatherRequestStatus } from './enums';

export const createWeatherRequestFixture = (): WeatherRequestEntity => {
  const [latitude, longitude] = faker.address.nearbyGPSCoordinate();

  return {
    id: faker.datatype.string(8),
    targetDate: '05.12.2022',
    email: faker.internet.email(),
    createdAt: faker.datatype.number(),
    updatedAt: faker.datatype.number(),
    status: WeatherRequestStatus.DONE,
    nextTime: faker.datatype.number(),
    payload: {
      latitude: Number(latitude),
      longitude: Number(longitude),
    },
    data: {
      icon: faker.internet.url(),
      temperature: Number(faker.datatype.bigInt({ min: -30, max: 30 })),
      windSpeed: faker.datatype.number(),
      windDirection: faker.datatype.string(),
      precipitation: faker.datatype.string(),
      sunrise: faker.datatype.string(),
      sunset: faker.datatype.string(),
    },
  };
};
