var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const todoSchema = new Schema({
  task: String,
  username: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Todo', todoSchema);
