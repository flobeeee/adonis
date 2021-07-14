import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('user_id').unique().notNullable()
      table.string('email').notNullable()
      table.string('password').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      // truncate 사용하면 index 초기화 가능
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
