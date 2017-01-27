var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'production',
	var sequelize;

if (env === 'production')
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: "postgres"
	});
else
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + 'data.sqlite'
	});

var db = {};

db.contact = function(sequelize, DataTypes) {
	return sequelize.define('contact', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1, 100]
			}
		},
		mobile: {
			type: DataTypes.NUMBER,
			allowNull: false,
			unique: true,
			validate: {
				len: [4, 18]
			}
		},
		home: {
			type: DataTypes.NUMBER,
			allowNull: false,
			unique: true,
			validate: {
				len: [4, 18]
			}
		},
		work: {
			type: DataTypes.NUMBER,
			allowNull: false,
			unique: true,
			validate: {
				len: [4, 18]
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNULL: false,
			unique: true,
			validate: {
				isEmail: true
			}
		}
	});
};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
