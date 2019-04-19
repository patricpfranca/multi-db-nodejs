// create
db.heroes.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
})

for(let i=0; i <= 10000; i++) {
  db.heroes.insert({
    nome: `Clones ${i}`,
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
  })
}

db.heroes.count()

// read
db.heroes.findOne()
db.heroes.find().limit(100).sort({ nome: -1 })

// update
db.heroes.update({ _id: ObjectId("5cba4181f3c94d0c47289342") }, {
  nome: 'Mulher maravilha'
});

db.heroes.update({ _id: ObjectId("5cba4223f3c94d0c47289355") }, {
  $set: { nome: 'Lanterna Verde' }
})

db.heroes.remove({ _id: ObjectId("5cba4223f3c94d0c47289355") })