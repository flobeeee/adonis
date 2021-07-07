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
  // 모든 유저 조회 (Read)
  Route.get('/', 'UserController.read')
  // 유저 추가 (Create)
  Route.post('/', 'UserController.create')

  Route.group(() => {
    // 한 유저 조회 (Read)
    Route.get('/:index', 'UserController.readone')
    // 유저 아이디 변경 (Update)
    Route.patch('/:index', 'UserController.update')
    // 유저 삭제 (Delete)
    Route.delete('/:index', 'UserController.delete')
  })
    .where('index', /^[0-9]*$/) // /^[A-Za-z0-9]*$/
}).prefix('/users')