import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from 'App/Models/User'

export default class UserController {
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
      return response.status(400).send('message: required user_id and name')
    }

    await user
      .fill({ user_id: user_id, name: name })
      .save()

    if (user.$isPersisted) {
      await response.send('message : created')
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    const { name } = request.body()
    const user = await User.findOrFail(params['index'])

    if (!name) {
      return response.status(400).send('message: required  name')
    }

    user.name = name
    await user.save()

    response.send('message : updated')
  }

  public async delete({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params['index'])
    await user.delete()

    response.send('message : deleted')
  }
}
