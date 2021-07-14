import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Alarm extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'is_send', serializeAs: 'isSend' })
  public isSend: boolean

  @column()
  public user_id: number // FK

  @belongsTo(() => User, {
    foreignKey: 'userId'
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
