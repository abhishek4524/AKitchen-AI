const express = require('express');
const { getItems, addItem, updateItem, deleteItem, clearAll } = require('../controller/itemController');
const router = express.Router();

router.get('/items', getItems);
router.post('/items', addItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);
router.delete('/items', clearAll);

module.exports = router;