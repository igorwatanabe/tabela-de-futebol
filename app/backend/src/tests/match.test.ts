import * as chai from 'chai';
import * as sinon from 'sinon';
import SequelizeMatch from '../database/models/SequelizeMatch';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
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
