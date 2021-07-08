import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User';

export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany(cseed())
  }
}

function cseed() {
  let seeds : object[] = [];
  for (let i = 1; i < 21; i++) {
    seeds.push({ user_id: `user${i}`, name: `유저${i}`})
  }
  return seeds;
}