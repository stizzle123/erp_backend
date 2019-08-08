exports.handleError = (req, res, err, next) => {
  if (err) {
    next(err);
  } else {
    return res.status(500).send({
      err: "An Unknown error occured while performing action."
    });
  }
};
