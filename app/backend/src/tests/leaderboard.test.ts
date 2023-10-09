import * as chai from 'chai';
import * as sinon from 'sinon';
import SequelizeMatch from '../database/models/SequelizeMatch';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { leaderboardHome } from './mocks/Leaderboards.mocks';
import { statusGameFalse } from './mocks/Matches.mocks';


chai.use(chaiHttp);

const { expect } = chai;

describe('Matches Tests, rota /matches', () => {
  afterEach(sinon.restore);
  it('Deve retornar a tabela corretamente, sem ordenação', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(statusGameFalse as any);

    const { status, body } = await chai.request(app).get('/leaderboard/home');    

    expect(status).to.equal(200);
    expect(body).to.deep.equal(leaderboardHome);
  });
});