import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../sequelize';

export class Recipe extends Model<
  InferAttributes<Recipe>,
  InferCreationAttributes<Recipe>
> {}

Recipe.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { sequelize },
);

// Recipe.sync({ force: true });
