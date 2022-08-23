const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let imageSchema = mongoose.Schema({
  user: {
    type: String
  },
  image: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true });

let postSchema = mongoose.Schema({
  post: {
    from: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    content: {
      type: String,
      maxLength: 250,
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Array,
      default: []
    }
  }
}, { timestamps: true });

let communitySchema = mongoose.Schema({
  Name: {
    type: String,
  },
  Admin: {
    type: String,
  },
  Members: {
    type: Array,
    default: []
  },
  MembersCount: { type: Number, default: 0 },
  Game: {
    type: String,
  },
  Posts: {
    type: Array,
    default: []
  },
  Desc: {
    type: String,
    maxLength: 250
  }
}, { timestamps: true });

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
let Post = mongoose.model('Post', postSchema);
let Community = mongoose.model('Community', communitySchema);

module.exports.Image = Image;
module.exports.User = User;
module.exports.Post = Post;
module.exports.Community = Community;
