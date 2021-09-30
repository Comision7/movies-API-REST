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
            })
        } else {
            res.status(404).json({
                meta: {
                    status: 404,
                    msg: "ID not found",
                  },
            })
        }
      });
    }
  },
  create: (req, res) => {},
  update: (req, res) => {},
  delete: (req, res) => {},
};
