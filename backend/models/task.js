var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const todoSchema = new Schema({
  task: String
});

module.exports = mongoose.model('Todo', todoSchema);
