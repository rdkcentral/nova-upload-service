const users = require('../handlers/users')
const applications = require('../handlers/applications')

module.exports = {
  '/users.post': {
    fn: users.createUser,
    auth: false,
  },
  '/users/me.get': {
    fn: users.getUserInfo,
    auth: true,
  },
  '/users/me.put': {
    fn: users.updateUserInfo,
    auth: true,
  },
  '/login.post': {
    fn: users.loginUser,
    auth: false,
  },
  '/applications/:id.get': {
    fn: applications.getApplication,
    auth: true,
  },
  '/applications.get': {
    fn: applications.listApplications,
    auth: true,
  },
  '/applications.post': {
    fn: applications.createApplication,
    auth: true,
  },
  '/applications/:id.put': {
    fn: applications.updateApplication,
    auth: true,
  },
  '/applications/:id.delete': {
    fn: applications.deleteApplication,
    auth: true,
  },
}
