import * as chai from 'chai';
import * as sinon from 'sinon';
import SequelizeTeam from '../database/models/SequelizeTeam';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { team, teams } from './mocks/Team.mocks';


chai.use(chaiHttp);

const { expect } = chai;

describe('Seu teste', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  afterEach(sinon.restore);
  it('Deve retornar todos os times corretamente', async function() {
    sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(teams);
  });

  it('Deve retornar o time pelo id corretamente', async function() {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(team as any);

    const { status, body } = await chai.request(app).get('/teams/5');
    console.log(status);
    

    expect(status).to.equal(200);
    expect(body).to.deep.equal(team);
  });

  it('Deve retornar um erro com a mensagem Team not found', async function() {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/50');

    expect(status).to.equal(404);
    expect(body.message).to.equal('Team not found');
  });
});
