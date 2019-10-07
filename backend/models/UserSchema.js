var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        index: {
            unique: true
        },
        required: true
    },
    password: {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
    last_login: Date
})

UserSchema.pre('save', function (next) {
    let user = this;

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (input, callback) {
    bcrypt.compare(input, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);