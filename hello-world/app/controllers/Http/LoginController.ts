import User from "App/Models/User"

export default class LoginController {
  public async postLoginAction({ auth, request, response }) {
    const user_id = request.input('user_id')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(user_id, password, {
        expiresIn: '1days'
      })
      // 만료된 토큰을 삭제하려면 따로 쿼리날려야함 (expires_at)
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