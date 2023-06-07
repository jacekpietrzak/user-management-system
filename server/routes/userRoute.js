const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// create, find, update, delete
router.get('/', userController.view);
router.post('/', userController.find);
router.get('/view-user/:id', userController.viewUser);
router.get('/add-user', userController.addForm);
router.post('/add-user', userController.create);
router.get('/edit-user/:id', userController.editForm);
router.post('/edit-user/:id', userController.edit);
router.get('/:id', userController.delete);

module.exports = router;
