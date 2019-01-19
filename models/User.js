/*
* Modelo Usuario que integra los datos locales y de las APIs [facebook y google]
*/
const mongoose = require('mongoose');
var findorcreate = require('mongoose-findorcreate');
const helpers = require('../helpers');
const regularexpressions = require('../helpers/regularexpressions');
const providers = require('../config/providers');
const mongoDB = require('../config/databases').mongoDB;
var mongooseTimestamp = require('mongoose-timestamp');
const bcryptjs = require('bcryptjs');
/*
* username: uid o profile.id o username diligenciado por el usuario,
* email: email obtenido de profile.emails[0].value o diligenciado por el usuario,
* givenName: Nombre completo del usuario diligenciado o recibido en el profile.name,
* familyName: Apellido del usuario diligenciado o recibido en el profile.name,
* provider: Proveedor como google, facebook o none. El último para el registro manual,
* password: Contraseña o accessToken de un API dependiendo el caso
*/
let json = {
  username: {
    type: String,
    required: 'El username es obligatorio'
  },
  email: {
    type: String,
    required: 'El email es obligatorio',
    unique: true,
    match: [regularexpressions.email, 'Escribe un email válido']
  },
  givenName: {
    type: String,
    minlength: [3,'El nombre debe tener al menos 3 caracteres'],
    required: 'El nombre es obligatorio'
  },
  familyName: {
    type: String,
    minlength: [3,'El apellido debe tener al menos 3 caracteres'],
    required: 'El apellido es obligatorio'
  },
  provider: {
    type: String,
    default: providers[0],
    enum:{values:providers,message:'El proveedor no está contemplado'}
  },
  password: {
    type: String,
    required: 'La contraseña es requerida',
    validate: {
      validator: function (password_local) {
        return this.provider === providers[0] ? this.pwd_confirmation == password_local : true;
      },
      message: 'Las contraseñas no son iguales'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  photo: {
    type: String
  }
}

let virtuales = ['password_confirmation'];

let UserSchema = new mongoose.Schema(json,mongoDB.no_v);

UserSchema.plugin(findorcreate);
UserSchema.plugin(mongooseTimestamp);

UserSchema.virtual(virtuales[0])
  .get(function () {
    return this.pwd_confirmation;
  })
  .set(function (password_confirmation) {
    this.pwd_confirmation = password_confirmation;
  })
;

UserSchema.pre('save',function (next) {
  if(this.provider != providers[0]) {
    this.isVerified = true;
    next();
  } else
    bcryptjs.genSalt(10,(err,salt) => {
      bcryptjs.hash(this.password,salt,(err,hash) => {
          if(err) throw err;
          this.password = hash;
          next();
      });
    });
});


let User = mongoose.model('User',UserSchema);

let validParams = helpers.jsonToList(json);
virtuales.forEach(virtual => {
  validParams.push(virtual);
})

module.exports = {model: User,validParams};
