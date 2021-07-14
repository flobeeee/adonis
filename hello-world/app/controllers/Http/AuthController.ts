import User from "App/Models/User"
import { PostValidator, PutValidator } from 'App/Validators/AuthValidator'
import UnAuthorized from 'App/Exceptions/UnAuthorizedException'
import BadRequest from 'App/Exceptions/BadRequestException'

export default class AuthController {
  // 로그인
  public async postLoginAction({ auth, request }) {

    try {
      const payload = await request.validate(PostValidator)
      const userId = payload.user_id
      const password = payload.password

      if (!/^[a-z0-9]*$/.test(userId)) {
        throw new BadRequest('special characters', 400)
      }

      const token = await auth.use('api').attempt(userId, password, {
        expiresIn: '1days'
      })
      return token
    } catch (error) {
      throw new UnAuthorized('invalid ID or wrong password', 401)
    }
  }

  // 마이페이지
  public async getMypageAction({ auth, response }) {
    // await auth.use('api').authenticate()

    if (auth.user!) {
      const user = await User.findOrFail(auth.user!['$attributes'].id)
      return response.ok(user)
    } else {
      throw new UnAuthorized('you are not authorized', 401)
    }
  }

  // 회원정보 변경 (이름, 비밀번호)
  public async putAction({ auth, request, params, response }) {
    // 유저 확인
    // await auth.use('api').authenticate()

    if (auth.user!) {
      if (Number(params['index']) !== auth.user!['$attributes'].id) {
        throw new UnAuthorized('wrong token', 401)
      }

      try {

        const payload = await request.validate(PutValidator)
        const user = await User.findOrFail(params['index'])
        const email = payload.email
        const password = payload.password

        user.email = email
        user.password = password
        await user.save()

        if (user.$isPersisted) {
          return response.ok(user)
        }
      } catch (error) {
        throw new BadRequest(error.messages, 400)
      }

    } else {
      throw new UnAuthorized('you are not authorized', 401)
    }
  }
}