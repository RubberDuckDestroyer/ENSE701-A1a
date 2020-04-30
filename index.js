//imports for Keystone app core
const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { NextApp } = require('@keystonejs/app-next');
const { StaticApp } = require('@keystonejs/app-static');

const { staticRoute, staticPath, distDir } = require('./config');
const { User, Post, PostCategory, Comment } = require('./schema');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv').config();

const keystone = new Keystone({
  name: 'Keystone Demo Blog',
  adapter: new MongooseAdapter({mongoUri: process.env.CONNECT_TO}),
  cookieSecret: process.env.SESSION_KEY,
  secureCookies: false,
  sessionStore: new MongoStore({
    url: process.env.CONNECT_TO
  })
});

keystone.createList('User', User);
keystone.createList('Post', Post);
keystone.createList('PostCategory', PostCategory);
keystone.createList('Comment', Comment);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

const adminApp = new AdminUIApp({
  adminPath: '/admin',
  hooks: require.resolve('./admin/'),
  authStrategy,
  isAccessAllowed: ({ authentication: { item: user } }) => !!user && !!user.isAdmin,
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: staticRoute, src: staticPath }),
    adminApp,
    new NextApp({ dir: 'app' }),
  ],
  distDir,
};
