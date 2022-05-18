const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let imageSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String
  }
})

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

module.exports.Image = Image;
module.exports.User = User;