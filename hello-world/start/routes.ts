/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'


Route.get('/', async () => {
  return 'hello world'
})

// 사진 저장
Route.get('uploads/:filename', async ({ params, response }) => {
  return response.attachment(
    Application.tmpPath('uploads', params.filename)
  )
})

Route.group(() => {
  // 로그인
  Route.post('/', 'AuthController.postLoginAction')

  Route.group(() => {
    // 마이페이지
    Route.get('/mypage', 'AuthController.getMypageAction')
    // 회원정보 변경 (닉네임, 비밀번호)
    Route.put('/:index', 'AuthController.putAction').where('index', /^[1-9]*$/)
  })
    .middleware('auth')
}).prefix('/login')

Route.group(() => {
  // 모든 유저 조회 (Read)
  Route.get('/get/:page', 'UserController.cgetAction').where('page', /^[1-9]*$/)
  // 유저 추가 (Create)
  Route.post('/', 'UserController.postAction')

  Route.group(() => {
    // 한 유저 조회 (Read)
    Route.get('/:index', 'UserController.getAction')
    // 유저 아이디 변경 (Update)
    Route.patch('/:index', 'UserController.patchEmailAction')
    // 유저 삭제 (Delete)
    Route.delete('/:index', 'UserController.deleteAction')
    // 사진업로드
    Route.post(':index', 'UserController.postImageAction')
  })
    .where('index', /^[1-9]*$/) // /^[A-Za-z0-9]*$/
}).prefix('/users')