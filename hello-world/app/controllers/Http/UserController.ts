import Application from '@ioc:Adonis/Core/Application'
import Database from "@ioc:Adonis/Lucid/Database"
import Event from '@ioc:Adonis/Core/Event'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import User from 'App/Models/User'
import Alarm from "App/Models/Alarm"
import { PostValidator, PatchValidator } from 'App/Validators/UserValidator'
import NoContent from 'App/Exceptions/NocontentException'
import BadRequest from 'App/Exceptions/BadRequestException'



export default class UserController {

  // 모든 유저 조회
  public async cgetAction({ params, response }: HttpContextContract) {
    const page = params['page'] || 1
    const limit = 10
    const users = await Database.from('users').paginate(page, limit)

    if (users['rows'].length === 0) {
      throw new NoContent('no record found', 204)
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
      const email = payload.email
      const password = payload.password

      if (!/^[A-Za-z0-9]*$/.test(user_id)) {
        throw new BadRequest('special characters', 400)
      }

      await user
        .fill({ userId: user_id, email: email, password: password })
        .save()

      if (user.$isPersisted) {
        const alarm = new Alarm()
        await alarm
          .fill({ user_id: user.id, isSend: false })
          .save()

        // 이벤트
        await Event.emit('new:user', { email: user.email, userId: user.userId })
        alarm.isSend = true
        await alarm.save()

        return response.created(user)
      }
    } catch (error) {
      throw new BadRequest(error.messages, 400)
    }
  }

  // 유저 이메일 변경
  public async patchEmailAction({ request, params, response }: HttpContextContract) {

    try {
      const user = await User.findOrFail(params['index'])

      await request.validate(PatchValidator)
      const email = request.input('email')

      user.email = email
      await user.save()

      if (user.$isPersisted) {
        return response.ok(user)
      }
    } catch (error) {
      throw new BadRequest(error.messages, 400)
    }
  }

  // 유저 삭제
  public async deleteAction({ params }: HttpContextContract) {
    const user = await User.findOrFail(params['index'])
    await user.delete()

    if (user.$isDeleted) {
      throw new NoContent('no record found', 204)
    }
  }

  // 사진업로드
  public async postImageAction({ request, params, response }: HttpContextContract) {
    const user = await User.findOrFail(params['index'])
    const image = request.file('image')
    // console.log('가공전 image', image)
    if (image) {
      const fileName = `${cuid()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: fileName
      })
      // console.log('가공후 image', image)
      user.image = `${image?.fileName}`
      await user.save()
      response.send(image)
    } else {
      response.badRequest('required image')
    }
  }

  // 직접 파일 업로드
  // public async postImageAction({ request }: HttpContextContract) {
  //   request.multipart.onFile('input_field_name', {}, (part) => {
  //     someSdk.uploadStream(part)
  //   })

  //   await request.multipart.process()

  //   const file = request.input('input_field_name')
  //   if (file.hasErrors) {
  //     return file.errors
  //   }
  // }
}

  // cgetAction - 목록 => /users
  // getAction - 단일 객체 조회 => /users/:id
  // putAction - 수정 => /users/:id => route.put
  // patchAction - 상태변경등 한개만 수정을 해야할때 사용 => 
  // /users/:id/status => patchStatusAction => route.patch 사용중 -> 중지 / 중지 -> 사용중
  // deleteAction - 삭제 => /users/:id

  // /users | /users/:id |
  // /users/:id/status => patchStatusAction