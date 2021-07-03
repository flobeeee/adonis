import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class User {
  public async read({request, response}: HttpContextContract) {
    response.send('모든 유저 리턴')
  }
  public async create({request, response}: HttpContextContract) {
    console.log(request.body())
    response.send('유저 한명 생성')
  }
  public async update({request, params, response}: HttpContextContract) {
    console.log(params)
    response.send('유저 닉네임 변경')
  }
  public async delete({request, params, response}: HttpContextContract) {
    console.log(params)
    response.send('한 유저 삭제')
  }
}
