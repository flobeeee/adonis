import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Database from "@ioc:Adonis/Lucid/Database"
import User from 'App/Models/User'
import { PostValidator, PatchValidator } from 'App/Validators/UserValidator'

// import Hash from '@ioc:Adonis/Core/Hash'

export default class UserController {
  // 모든 유저 조회
  public async cgetAction({ params, response }: HttpContextContract) {
    const page = params['page'] || 1
    const limit = 10
    const users = await Database.from('users').paginate(page, limit)

    if (users['rows'].length === 0) {
      return response.noContent()
    }
    response.ok(users)
  }

  // 한 유저 조회
  public async getAction({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params['index'])
    response.ok(user)
  }

  // 유저 등록
  public async postAction({ request, response }: HttpContextContract) {

    try {
      const payload = await request.validate(PostValidator)
      const user = new User()
      const user_id = payload.user_id
      const name = payload.name
      const password = payload.password

      if (!/^[A-Za-z0-9]*$/.test(user_id)) {
        return response.badRequest({ 'message': 'special characters' })
      }

      await user
        .fill({ userId: user_id, name: name, password: password })
        .save()

      if (user.$isPersisted) {
        return response.created(user)
      }
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  // 유저 이름 변경
  public async patchNameAction({ request, params, response }: HttpContextContract) {

    try {
      const user = await User.findOrFail(params['index'])
      // const checkPassword = await Hash.verify(user.password, request.input('password'))
      // if (!checkPassword) {
      //   return response.unauthorized()
      // }
      await request.validate(PatchValidator)
      const name = request.input('name')

      user.name = name
      await user.save()

      if (user.$isPersisted) {
        return response.ok(user)
      }
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  // 유저 삭제
  public async deleteAction({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params['index'])
    await user.delete()

    if (user.$isDeleted) {
      return response.noContent()
    }
  }
}

  // cgetAction - 목록 => /users
  // getAction - 단일 객체 조회 => /users/:id
  // putAction - 수정 => /users/:id => route.put
  // patchAction - 상태변경등 한개만 수정을 해야할때 사용 => 
  // /users/:id/status => patchStatusAction => route.patch 사용중 -> 중지 / 중지 -> 사용중
  // deleteAction - 삭제 => /users/:id

  // /users | /users/:id |
  // /users/:id/status => patchStatusAction