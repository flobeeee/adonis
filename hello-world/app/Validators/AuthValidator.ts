import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const invalidMessage = {
  'required': 'Missing value for {{field}}',
  'user_id.unique': 'Username not available',
  'minLength': '{{field}} has at least {{options.minLength}} length or more words',
  'maxLength': '{{field}} length limit exceeded',
}

export class PostValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    user_id: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(12),
    ]),
    password: schema.string({}, [
      rules.minLength(4)
    ])
  })

  public messages = invalidMessage
}

export class PutValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    // user_id: schema.string({ trim: true }, [
    //   rules.unique({ table: 'users', column: 'user_id' }),
    //   rules.minLength(2),
    //   rules.maxLength(12),
    // ]),
    email: schema.string({ trim: true }, [
      rules.email()
    ]),
    password: schema.string({}, [
      rules.minLength(4)
    ])
  })

  public messages = invalidMessage
}