import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await UserFactory
      .merge([
        { userId: 'user1', email: 'test1@gmail.com', password: '1111' },
        { userId: 'user2', email: 'test2@gmail.com', password: '2222' },
        { userId: 'user3', email: 'test3@gmail.com', password: '3333' },

      ])
      .createMany(20)
  }
}