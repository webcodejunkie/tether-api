const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let imageSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  desc: String,
  image: {
    data: Buffer,
    contentType: String
  }
});

let userSchema = mongoose.Schema({
  Username: {
    type: String,
    maxLength: 12,
    minLength: 5,
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
  Bio: { type: String, required: true },
  PlayerType: {
    type: String,
  },
  Country: {
    type: String,
    required: true
  },
  Region: {
    type: String,
    required: true
  },
  Friends: {
    type: Array,
    default: [],
  },
  Favorites: {
    type: Array,
    default: [],
  },
}, { timestamps: true });

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
}

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
}

let User = mongoose.model('User', userSchema);
let Image = mongoose.model('Image', imageSchema);

module.exports.Image = Image;
module.exports.User = User;
