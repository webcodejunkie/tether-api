const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let imageSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String
  }
});

let postSchema = mongoose.Schema({
  msg: {
    type: String,
    maxLength: 300,
    required: true
  },

  user: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    required: true
  }
}, { timestamps: true });

let userSchema = mongoose.Schema({
  Username: {
    type: String,
    maxLength: 10,
    minLength: 6,
    required: true
  },
  Password: {
    type: String,
    minLength: 8,
    required: true
  },
  Email: { type: String, required: true },
  Birthday: { type: Date, required: true },
  ProfilePicture: {
    type: String,
    default: "https://placeimg.com/640/480/any"
  },
  Bio: { type: String },
  PlayerType: {
    type: String,
    required: true
  },
  Friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
}

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
}

let User = mongoose.model('User', userSchema);
let Image = mongoose.model('Image', imageSchema);
let Post = mongoose.model('Post', postSchema);

module.exports.Post = Post;
module.exports.Image = Image;
module.exports.User = User;