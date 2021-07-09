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

// Route.get('/', async () => {
//   return 'hello world'
// })

Route.group(() => {
  Route.post('/', 'AuthController.postLoginAction')
  Route.get('/mypage', 'AuthController.getMypageAction')

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
    Route.patch('/:index', 'UserController.patchNameAction')
    // 유저 삭제 (Delete)
    Route.delete('/:index', 'UserController.deleteAction')
  })
    .where('index', /^[1-9]*$/) // /^[A-Za-z0-9]*$/
}).prefix('/users')