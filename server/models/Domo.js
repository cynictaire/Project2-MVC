const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectId is a function that
// converts string ID to a real mongo ID

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  post: {
    type: String,
    required: true,
    trim: true,
  },

  tag: {
    type: String,
    required: false,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  post: doc.post,
  tag: doc.tag,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return DomoModel.find(search).select('title post tag').exec(callback);
};

DomoSchema.statics.deleteDomos = (domoID, callback) => {
  const search = {
    _id: convertId(domoID),
  };

  DomoModel.deleteOne(search, (err) => {
    if (err) throw err;
  }).exec(callback);
    
    console.log("successfully deleted");
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
