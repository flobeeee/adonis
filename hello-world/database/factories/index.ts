import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      userId: faker.random.alpha({ count: 5 }),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.random.image()
    }
  })
  .build()