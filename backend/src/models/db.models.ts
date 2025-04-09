import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

// Category Model
interface CategoryAttributes {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
  }
);

// File Model
interface FileAttributes {
  id: number;
  name: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FileCreationAttributes extends Optional<FileAttributes, 'id'> {}

export class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: number;
  public name!: string;
  public path!: string;
  public size!: number;
  public type!: string;
  public uploadedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'files',
  }
);

// Block Model
interface BlockAttributes {
  id: number;
  name: string;
  categoryId: number;
  fileId: number;
  properties: object;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BlockCreationAttributes extends Optional<BlockAttributes, 'id'> {}

export class Block extends Model<BlockAttributes, BlockCreationAttributes> implements BlockAttributes {
  public id!: number;
  public name!: string;
  public categoryId!: number;
  public fileId!: number;
  public properties!: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Block.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: File,
        key: 'id',
      },
    },
    properties: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'blocks',
  }
);

// Associations
Category.hasMany(Block, { foreignKey: 'categoryId' });
Block.belongsTo(Category, { foreignKey: 'categoryId' });

File.hasMany(Block, { foreignKey: 'fileId' });
Block.belongsTo(File, { foreignKey: 'fileId' });

// Export models
export const models = {
  Category,
  File,
  Block,
}; 