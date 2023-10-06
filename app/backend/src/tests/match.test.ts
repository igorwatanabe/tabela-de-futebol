import * as chai from 'chai';
import * as sinon from 'sinon';
import SequelizeMatch from '../database/models/SequelizeMatch';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Validations from '../middlewares/Validations';
import JWT from '../utils/JWT';
import { matchFinished, matchInProgress, matches, statusGameFalse, statusGameTrue } from './mocks/Matches.mocks';


chai.use(chaiHttp);

const { expect } = chai;

describe('Matches Tests, rota /matches', () => {
  afterEach(sinon.restore);
  it('Deve retornar todas as partidas corretamente', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches');    

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matches);
  });

  it('Deve retornar todas as partidas finalizadas corretamente', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(statusGameFalse as any);

    const { status, body } = await chai.request(app)
      .get('/matches')
      .query({ inProgress: false })
    
    expect(status).to.equal(200);
    expect(body).to.deep.equal(statusGameFalse);
  });

  it('Deve retornar todas as partidas em progresso corretamente', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(statusGameTrue as any);

    const { status, body } = await chai.request(app)
      .get('/matches')
      .query({ inProgress: true })
    
    expect(status).to.equal(200);
    expect(body).to.deep.equal(statusGameTrue);
  });
});

describe('Matches Tests, rota /matches/:id/finish', () => {
  afterEach(sinon.restore);
  it('Deve retornar uma mensagem com a partida finalizada', async function() {
    sinon.stub(SequelizeMatch, 'update').resolves({ message: "Finished" }  as any);
    sinon.stub(JWT, 'verify').resolves();

    const { status, body } = await chai.request(app)
    .patch('/matches/41/finish')
    .set('authorization', 'Bearer validToken') 

    expect(status).to.equal(200);
    expect(body.message).to.equal("Finished");
  });
});

describe('Matches Tests, rota /matches/:id', () => {
  afterEach(sinon.restore);
  it('Deve retornar uma mensagem com os goals atualizados corretamente', async function() {
    sinon.stub(SequelizeMatch, 'findByPk').resolves(matchInProgress  as any);
    sinon.stub(SequelizeMatch, 'update').resolves({ message: "Updated Goals" }  as any);
    sinon.stub(JWT, 'verify').resolves();

    const { status, body } = await chai.request(app)
    .patch('/matches/41')
    .set('authorization', 'Bearer validToken')
    

    expect(status).to.equal(200);
    expect(body.message).to.equal("Updated Goals");
  });

  it('Deve retornar uma mensagem com os goals atualizados corretamente', async function() {
    sinon.stub(SequelizeMatch, 'findByPk').resolves(matchFinished  as any);
    sinon.stub(SequelizeMatch, 'update').resolves({ message: "No match in progress" }  as any);
    sinon.stub(JWT, 'verify').resolves();

    const { status, body } = await chai.request(app)
    .patch('/matches/41')
    .set('authorization', 'Bearer validToken')

    expect(status).to.equal(400);
    expect(body.message).to.equal("No match in progress");
  });
});

describe('Matches Tests POST, rota /matches', () => {
  afterEach(sinon.restore);
  it('Deve retornar uma partida criada corretamente', async function() {
    sinon.stub(SequelizeMatch, 'create').resolves(matchInProgress  as any);
    sinon.stub(JWT, 'verify').resolves();

    const { status, body } = await chai.request(app)
    .post('/matches')
    .set('authorization', 'Bearer validToken')
    .send({ homeTeamId: 16,
      homeTeamGoals: 2,
      awayTeamId: 9,
      awayTeamGoals: 0})
    
    expect(status).to.equal(201);
    expect(body).to.deep.equal(matchInProgress);
  });

  it('Deve retornar um erro ao tentar criar partida com time iguais', async function() {
    sinon.stub(Validations, 'validateInputCreateMatch')
      .resolves({ message: 'It is not possible to create a match with two equal teams' });
    sinon.stub(JWT, 'verify').resolves();

    const { status, body } = await chai.request(app)
    .post('/matches')
    .set('authorization', 'Bearer validToken')
    .send({ homeTeamId: 9,
      homeTeamGoals: 2,
      awayTeamId: 9,
      awayTeamGoals: 0})
    
    expect(status).to.equal(422);
    expect(body.message).to.deep.equal('It is not possible to create a match with two equal teams');
  });

  it('Deve retornar um erro ao tentar criar partida com time inexistente', async function() {
    sinon.stub(SequelizeMatch, 'create').resolves({ message: "There is no team with such id!" }  as any);
    sinon.stub(Validations, 'validateInputCreateMatch').resolves();
    sinon.stub(JWT, 'verify').resolves();

    const { status, body } = await chai.request(app)
    .post('/matches')
    .set('authorization', 'Bearer validToken')
    .send({ homeTeamId: 200,
      homeTeamGoals: 2,
      awayTeamId: 9,
      awayTeamGoals: 0})
    
    expect(status).to.equal(404);
    expect(body.message).to.equal("There is no team with such id!");
  });
});