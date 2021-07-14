import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasOne, HasOne, afterCreate } from '@ioc:Adonis/Lucid/Orm'
import Alarm from 'App/Models/Alarm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'user_id', serializeAs: 'userId' })
  public userId: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Alarm)
  public profile: HasOne<typeof Alarm>
}