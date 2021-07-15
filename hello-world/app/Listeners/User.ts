import { EventsList } from '@ioc:Adonis/Core/Event'
import WelcomeEmail from 'App/Mailers/WelcomeEmail'

export default class User {
  public async onNewUser(user: EventsList['new:user']) {
    // send email to the new user
    console.log('🌈', user['email'])
    try {
      await new WelcomeEmail(user).sendLater()
    } catch (error) {
      console.log('메일 관련 에러')
    }
  }
}
