import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class SequelizeLeaderboard extends Model<InferAttributes<SequelizeLeaderboard>,
InferCreationAttributes<SequelizeLeaderboard>> {
  declare name: string;
  declare totalPoints: number;
  declare totalGames: number;
  declare totalVictories: number;
  declare totalDraws: number;
  declare totalLosses: number;
  declare goalsFavor: number;
  declare goalsOwn: number;
}

SequelizeLeaderboard.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalGames: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalVictories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalDraws: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalLosses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  goalsFavor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  goalsOwn: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'leaderboards',
  timestamps: false,
  underscored: true,
});

export default SequelizeLeaderboard;
