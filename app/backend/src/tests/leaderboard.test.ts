import * as chai from 'chai';
import * as sinon from 'sinon';
import SequelizeMatch from '../database/models/SequelizeMatch';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { leaderboardAway, leaderboardHome } from './mocks/Leaderboards.mocks';
import { allMatchesFinished } from './mocks/Matches.mocks';


chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboards Tests, rota /leaderboard/home', () => {
  afterEach(sinon.restore);
  it('Deve retornar a tabela corretamente, com ordenação', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(allMatchesFinished as any);

    const { status, body } = await chai.request(app).get('/leaderboard/home');    

    expect(status).to.equal(200);
    expect(body).to.deep.equal(leaderboardHome);
  });
});

describe('Leaderboards Tests, rota /leaderboard/away', () => {
  afterEach(sinon.restore);
  it('Deve retornar a tabela corretamente, com ordenação', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(allMatchesFinished as any);

    const { status, body } = await chai.request(app).get('/leaderboard/away');    

    expect(status).to.equal(200);
    expect(body).to.deep.equal(leaderboardAway);
  });
});