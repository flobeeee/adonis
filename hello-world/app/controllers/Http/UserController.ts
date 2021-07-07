import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import User from 'App/Models/User'

export default class UserController {
  public async cgetAction({ params, response }: HttpContextContract) {
    const page = params['page'] || 1
    const limit = 10
    const users = await Database.from('users').paginate(page, limit)

    if (users['rows'].length === 0) {
      return response.noContent()
    }
    response.ok(users)
  }

  public async getAction({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params['index'])
    response.ok(user)
  }

  public async postAction({ request, response }: HttpContextContract) {
    const user = new User()
    const user_id = request.input('user_id')
    const name = request.input('name')

    if (!user_id || !name) {
      return response.badRequest({ 'message': 'required user_id and name' })
    }

    await user
      .fill({ user_id: user_id, name: name })
      .save()

    if (user.$isPersisted) {
      return response.created(user)
    }
  }

  public async patchNameAction({ request, params, response }: HttpContextContract) {
    const name = request.input('name')
    const user = await User.findOrFail(params['index'])

    if (!name) {
      return response.badRequest({ 'message': 'required name' })
    }

    user.name = name
    await user.save()

    if (user.$isPersisted) {
      return response.ok(user)
    }
  }

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