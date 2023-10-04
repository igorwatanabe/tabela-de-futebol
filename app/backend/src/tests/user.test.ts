import * as chai from 'chai';
import * as sinon from 'sinon';
import SequelizeUser from '../database/models/SequelizeUser';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import JWT from '../utils/JWT';
import { invalidEmailLoginBody, invalidPasswordLoginBody, userRegistered, validLoginBody, wrongPassUser } from './mocks/User.mocks';



chai.use(chaiHttp);

const { expect } = chai;

describe('Login Tests', () => {
  afterEach(sinon.restore);

  it('Não deve logar com dados vazios do body', async function() {
    const { status, body } = await chai
      .request(app)
      .post('/login')
      .send({});

    expect(status).to.equal(400);
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Não deve logar com email inválido', async function() {
    const { status, body } = await chai
      .request(app)
      .post('/login')
      .send(invalidEmailLoginBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Não deve logar com senha inválida', async function() {
    const { status, body } = await chai
      .request(app)
      .post('/login')
      .send(invalidPasswordLoginBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Não deve logar quando nao encontrar usuário', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(null);
    const { status, body } = await chai
      .request(app)
      .post('/login')
      .send(validLoginBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Deve retornar um token quando o loga corretamente', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(userRegistered as any);
    sinon.stub(JWT, 'sign').returns('validToken');

    const { status, body } = await chai
      .request(app)
      .post('/login')
      .send(validLoginBody);

    expect(status).to.equal(200);
    expect(body).to.have.key('token');
  });

  it('Deve retornar um erro quando utiliza senha errada', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(wrongPassUser as any);
    sinon.stub(JWT, 'sign').returns('validToken');

    const { status, body } = await chai.request(app)
      .post('/login')
      .send(validLoginBody);

    expect(status).to.equal(401);
    expect(body.message).to.equal('Invalid email or password');
  });
});

describe('Token Testes, rota /login/role', () => {
  it('Deve retornar um erro caso nao tenha um Token',async function() {
    const { status, body } = await chai.request(app).get('/login/role');
    expect(status).to.equal(401);
    expect(body.message).to.equal('Token not found');
  });

  it('Deve retornar um erro caso o Token seja inválido',async function() {
    const { status, body } = await chai.request(app)
      .get('/login/role')
      .set('authorization', 'invalidToken');

    expect(status).to.equal(401);
    expect(body.message).to.equal('Token must be a valid token');
    });
});

describe('Role Teste, rota /login/role', () => {
  it('Deve retornar o role do user',async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves({ role: "admin" } as any);
    sinon.stub(JWT, 'verify').resolves();

    const { status, body } = await chai.request(app)
      .get('/login/role')
      .set('authorization', 'Bearer validToken')
      
    expect(status).to.equal(200);
    expect(body).to.deep.equal({ role: "admin" });
  });
});

