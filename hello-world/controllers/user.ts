class User { // 2. 데이터베이스 구축, ORM 연결
  public index: number;
  public id: string;

  constructor(
    index: number,
    id: string,
  ) {
    this.index = index;
    this.id = id;
  }
}

const user1: User = new User(1, 'user1');
const user2: User = new User(2, 'user2');

let userDB: User[] = [user1, user2];
let getnextIdx = (userDB: User[]): number => {
  return userDB.length +1;
}

module.exports = { // 1. 클래스화 시키기!
  'read' : ({ response }) => {
    response.send(userDB);
  },

  'create' : ({ request, response }) => {
    const newUser = request.body().id;
    if (!newUser) {
      return response.status(400).send({ 'message': 'required id' });
    }
    userDB.push(new User(getnextIdx(userDB), newUser));
    response.send(userDB[getnextIdx(userDB) -1]);
  },

  'update' : ({ request, params , response}) => {
    const userId = request.body().id;
    const index = params.index -1;
    if (!userId) {
      return response.status(400).send({ 'message': 'required id' });
    }
    userDB[index]['id'] = userId;
    response.send(`changed as ${userDB[index]['id']}`);
  },

  'delete' : ({ params, response }) => {
    const index = params.index;
    if (!index) {
      return response.status(400).send({ 'message': 'required index' });
    }
    if (Number(index) > userDB.length) {
      return response.status(404).send({ 'message': `user index : ${index} not found`});
    }
    userDB = userDB.filter((user) => user.index !== Number(index));
    response.send({ 'message' : `deleted index : ${index}` });
  }
}