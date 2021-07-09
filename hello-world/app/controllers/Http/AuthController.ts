import User from "App/Models/User"
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async postLoginAction({ auth, request, response }) {
    const loginSchema = schema.create({
      user_id: schema.string({ trim: true }, [
        rules.minLength(2),
        rules.maxLength(12),
      ]),
      password: schema.string({}, [
        rules.minLength(4)
      ])
    })

    try {
      const payload = await request.validate({ schema: loginSchema })
      const user_id = payload.user_id
      const password = payload.password

      if (!/^[a-z0-9]*$/.test(user_id)) {
        return response.badRequest({ 'message': 'special characters' })
      }

      const token = await auth.use('api').attempt(user_id, password, {
        expiresIn: '1days'
      })
      return token
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async getMypageAction({ auth, response }) {
    await auth.use('api').authenticate()

    if (auth.user!) {
      const user = await User.findOrFail(auth.user!['$attributes'].id)
      return response.ok(user)
    } else {
      return response.unauthorized()
    }
  }
}