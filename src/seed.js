var faker = require('faker');
let db = require("mongoose");


console.log('Creating Todos');

console.log(db);
for(let i = 0; i < 50000; i++) {
  console.log(`Creating Todo number ${i}`);
  let todo = new db.Todo({
    title: faker.name.findName(),
    text: faker.name.findName()
  });
  todo.save()
}

console.log('Finished Seeding Todos');
