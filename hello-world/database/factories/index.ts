import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      userId: faker.random.alpha({ count: 5 }),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    }
  })
  .build()