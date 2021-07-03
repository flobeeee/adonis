import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User';

export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        user_id: 'user1',
        name: '유저1'
      },
      {
        user_id: 'user2',
        name: '유저2'
      }
    ])
  }
}
