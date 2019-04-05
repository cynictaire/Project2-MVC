const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An unexpected error has occured.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.title || !req.body.post) {
    return res.status(400).json({ error: 'Title and post content are required.' });
  }

  const domoData = {
    title: req.body.title,
    post: req.body.post,
    tag: req.body.tag,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists.' });
    }

    return res.status(400).json({ error: 'An unexpected error has occured.' });
  });

  return domoPromise;
};

const deleteDomos = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.domoID) {
    return res.status(400).json({ error: 'An error occurred' });
  }

  Domo.DomoModel.deleteDomos(req.body.domoID, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(202).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });

  return false;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.deleteDomos = deleteDomos;
