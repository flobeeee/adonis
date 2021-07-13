import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await UserFactory
      .merge([
        { userId: 'user1', name: '유저1', password: '1111' },
        { userId: 'user2', name: '유저2', password: '2222' },
        { userId: 'user3', name: '유저3', password: '3333' },

      ])
      .createMany(20)
  }
}