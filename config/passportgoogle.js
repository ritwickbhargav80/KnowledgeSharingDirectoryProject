// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const mongoose = require("mongoose");
// const passport = require("passport");

// const User = require("../models/User");

// require("dotenv").config();

// module.exports = passport => {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "/api/v1/users/login/google/callback",
//         proxy: true
//       },
//       (accessToken, refreshToken, profile, done) => {
//         const img = profile.photos[0].value;
//         // console.log(profile);
//         const newUser = {
//           googleID: profile.id,
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           img: img
//         };

//         User.findOne({ googleID: profile.id }).then(user => {
//           if (user) {
//             done(null, user);
//           } else {
//             new User(newUser).save().then(user => {
//               done(null, user);
//             });
//           }
//         });
//       }
//     )
//   );

//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {
//     User.findById(id).then(user => {
//       done(null, user);
//     });
//   });
// };
