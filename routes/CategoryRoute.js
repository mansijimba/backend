const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/seller/CategoryManagement');
const upload = require('../middlewares/fileupload');

router.post(
    '/', 
    upload.single("filepath"),
    categoryController.createCategory
);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', 
    upload.single("filepath"),
    categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;