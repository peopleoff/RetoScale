const AuthenticationController = require('./controllers/AuthenticationController');
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
const ItemControllerPolicy = require('./policies/ItemControllerPolicy');
const User = require('./controllers/UserController');
const Item = require('./controllers/ItemController');

module.exports = (app) => {

    // Get Requests
    app.get('/getItems', Item.getItems);
    app.get('/getUsers', User.getUsers);
    app.get('/getLastUpdated', Item.getLastUpdated);
    // Post Requests
    app.post('/register', AuthenticationControllerPolicy.register, User.register);
    app.post('/addItem', ItemControllerPolicy.addItem, Item.addItem);
    app.post('/updateItem', ItemControllerPolicy.updateItem, Item.updateItem);
    app.post('/updateUserStatus', User.updateUserStatus);
    app.post('/deleteItem', Item.deleteItem);
    app.post('/signIn', User.signIn);
    app.post('/getUser', User.getUser);
    app.post('/updateUser', User.updateUser);

};
