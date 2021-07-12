import User from "App/Models/User"
import UserValidator from 'App/Validators/UserValidator'

export default class AuthController {
  // 로그인
  public async postLoginAction({ auth, request, response }) {

    try {
      const payload = await request.validate(UserValidator)
      const user_id = payload.user_id
      const password = payload.password

      if (!/^[a-z0-9]*$/.test(user_id)) {
        return response.badRequest({ 'message': 'special characters' })
      }

      const token = await auth.use('api').attempt(user_id, password, {
        expiresIn: '1days'
      })
      return token
    } catch (error) {
      return response.badRequest('Invalid credentials')
      // return response.send(error)
    }
  }

  // 마이페이지
  public async getMypageAction({ auth, response }) {
    await auth.use('api').authenticate()

    if (auth.user!) {
      const user = await User.findOrFail(auth.user!['$attributes'].id)
      return response.ok(user)
    } else {
      return response.unauthorized()
    }
  }

  // 회원정보 변경 (이름, 비밀번호)
  public async putAction({ auth, request, params, response }) {
    await auth.use('api').authenticate()

    if (auth.user!) {
      try {
        const payload = await request.validate(UserValidator)
        const user = await User.findOrFail(params['index'])
        const name = payload.name
        const password = payload.password

        user.name = name
        user.password = password

        if (user.$isPersisted) {
          return response.ok(user)
        }
      } catch (error) {
        return response.badRequest(error.messages)
      }

    } else {
      return response.unauthorized()
    }
  }
}