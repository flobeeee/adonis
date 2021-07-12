import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      userId: faker.random.word(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    }
  })
  .build()