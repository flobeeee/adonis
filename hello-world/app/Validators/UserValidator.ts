import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
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

	public messages = {
		'*': (field, rule, arrayExpressionPointer, options) => {
			return `${rule} validation error on ${field}`
		},
		'user.user_id.required': 'Missing value for username',
		'user.password.required': 'Missing value for password',
		'user.user_id.unique': 'Username not available',
		'user.user_id.minLength': 'value has at least 2 length or more words',
		'user.password.minLength': 'value has at least 2 length or more words',
		'user.user_id.maxLength': 'length limit exceeded',
	}
}
