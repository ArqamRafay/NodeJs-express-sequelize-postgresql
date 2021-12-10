module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define("article", {
    title: {
      type: Sequelize.STRING
    },
    teg: {
      type: Sequelize.STRING,
      defaultValue: "science"
    },
    Ispublished: {
      type: Sequelize.BOOLEAN
    }
  });

  // `sequelize.define` also returns the model
  // console.log(Tutorial === sequelize.models.Tutorial); // true

  return Article;
};