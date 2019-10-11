var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const todoSchema = new Schema({
  task: String,
  username: {
    type: String,
    required: true,
  },
  done: Boolean
});

module.exports = mongoose.model('Todo', todoSchema);
