const db = require("../../database/models");

const getUrl = (req) =>
  req.protocol + "://" + req.get("host") + req.originalUrl;

module.exports = {
  getAllMovies: (req, res) => {
    db.Movie.findAll({
      include: [{ association: "genre" }, { association: "actors" }],
    })
      .then((movies) =>
        res.status(200).json({
          meta: {
            endPoint: getUrl(req),
            total: movies.length,
          },
          data: movies,
        })
      )
      .catch((error) => res.status(400).send(error));
  },
  getOneMovie: (req, res) => {
    if (req.params.id % 1 !== 0 || req.params.id < 0) {
      return res.status(400).json({
        meta: {
          status: 400,
          msg: "Wrong ID",
        },
      });
    } else {
      db.Movie.findOne({
        where: { id: req.params.id },
        include: [{ association: "actors" }, { association: "genre" }],
      }).then((movie) => {
        if (movie) {
          return res.status(200).json({
            meta: {
              endPoint: getUrl(req),
              name: movie.title,
            },
            data: movie,
          });
        } else {
          res.status(404).json({
            meta: {
              status: 404,
              msg: "ID not found",
            },
          });
        }
      });
    }
  },
  create: (req, res) => {
    const { title, rating, awards, release_date, length, genre_id } = req.body;
    db.Movie.create({
      title,
      rating,
      awards,
      release_date,
      length,
      genre_id,
    })
      .then((movie) => {
        res.status(201).json({
          meta: {
            endPoint: getUrl(req),
            msg: "Movie added successfully",
          },
          data: movie,
        });
      })
      .catch((error) => {
        switch (error.name) {
          case "SequelizeValidationError":
            let errorsMsg = [];
            let notNullErrors = [];
            let validationsErrors = [];
            error.errors.forEach((error) => {
              errorsMsg.push(error.message);
              if (error.type == "notNull Violation") {
                notNullErrors.push(error.message);
              }
              if (error.type == "Validation error") {
                validationsErrors.push(error.message);
              }
            });
            let response = {
              status: 400,
              message: "missing or wrong data",
              errors: {
                quantity: errorsMsg.length,
                msg: errorsMsg,
                notNull: notNullErrors,
                validations: validationsErrors,
              },
            };
            return res.status(400).json(response);
          default:
            return res.status(500).json({
              error,
            });
        }
      });
  },
  update: (req, res) => {},
  delete: (req, res) => {},
};
