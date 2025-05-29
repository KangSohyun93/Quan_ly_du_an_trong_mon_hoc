module.exports = (sequelize, DataTypes) => {
  const PeerAssessment = sequelize.define('PeerAssessment', {
    assessment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assessor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assessee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'peer_assessments',
    timestamps: false,
  });

  PeerAssessment.associate = (models) => {
    PeerAssessment.belongsTo(models.Group, { foreignKey: 'group_id' });
    PeerAssessment.belongsTo(models.User, { foreignKey: 'assessor_id', as: 'assessor' });
    PeerAssessment.belongsTo(models.User, { foreignKey: 'assessee_id', as: 'assessee' });
  };

  return PeerAssessment;
};