import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from 'App/Models/User'

export default class UserController {
  // cgetAction - 목록 => /users
  // getAction - 단일 객체 조회 => /users/:id
  // putAction - 수정 => /users/:id => route.put
  // patchAction - 상태변경등 한개만 수정을 해야할때 사용 => 
  // /users/:id/status => patchStatusAction => route.patch 사용중 -> 중지 / 중지 -> 사용중
  // deleteAction - 삭제 => /users/:id

  // /users | /users/:id |
  // /users/:id/status => patchStatusAction

  public async read({ response }: HttpContextContract) {
    const allUser = await User.all()
    if (allUser.length === 0) {
      return response.status(204)
    }
    response.send(allUser)
  }

  public async readone({ params, response }: HttpContextContract) {
    const userInfo = await User.findOrFail(params['index'])
    response.send(userInfo)
  }

  public async create({ request, response }: HttpContextContract) {
    const user = new User()
    const { user_id, name } = request.body()

    if (!user_id || !name) {
      return response.status(400).send({ 'message': 'required user_id and name' })
    }

    await user
      .fill({ user_id: user_id, name: name })
      .save()

    if (user.$isPersisted) {
      return response.status(201).send({ 'message': 'created' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    // const { name } = request.body()
    const name = request.input('name')
    const user = await User.findOrFail(params['index'])

    if (!name) {
      return response.status(400).send({ 'message': 'required name' })
    }

    user.name = name
    await user.save()

    // return user
    // return response.status(200).send(user)
    return response.send({ 'message': 'updated' })
  }

  public async delete({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params['index'])
    await user.delete()

    // return response.noContent() 
    response.send({ 'message': 'deleted' })
    // http status code  
  }
}
