const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verificar se o usuário já existe com este Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      // Usuário já existe, fazer login
      return done(null, user);
    }
    
    // Verificar se já existe um usuário com este email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Usuário existe com email, vincular conta Google
      user.googleId = profile.id;
      user.avatar = profile.photos[0]?.value;
      await user.save();
      return done(null, user);
    }
    
    // Criar novo usuário
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0]?.value,
      userType: 'pessoa', // Padrão para usuários do Google
      // Campos opcionais que podem ser preenchidos depois
      location: {
        city: '',
        state: ''
      }
    });
    
    await user.save();
    return done(null, user);
    
  } catch (error) {
    console.error('Erro na autenticação Google:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;