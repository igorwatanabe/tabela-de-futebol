import * as chai from 'chai';
import * as sinon from 'sinon';
import SequelizeMatch from '../database/models/SequelizeMatch';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import JWT from '../utils/JWT';
import { matches, statusGameFalse, statusGameTrue } from './mocks/Matches.mocks';


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
    console.log(body);
    

    expect(status).to.equal(200);
    expect(body.message).to.equal("Finished");
  });
});