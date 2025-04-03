var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
const slugify = require('slugify');  // Import slugify

/* GET danh sách các danh mục. */
router.get('/', async function(req, res, next) {
  let categories = await categoryModel.find({});
  
  res.status(200).send({
    success: true,
    data: categories
  });
});

/* GET danh mục theo ID. */
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Không có ID phù hợp"
    });
  }
});

/* Tạo mới một danh mục. */
router.post('/', async function(req, res, next) {
  try {
    let newCategory = new categoryModel({
      name: req.body.name,
      slug: slugify(req.body.name, { lower: true }) // Tạo slug tự động từ tên
    });
    await newCategory.save();
    res.status(200).send({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

/* GET danh mục theo slug. */
router.get('/slug/:slug', async function(req, res, next) {
  let categorySlug = req.params.slug;
  let category = await categoryModel.findOne({ slug: categorySlug });

  if (!category) {
    return res.status(404).send({
      success: false,
      message: 'Danh mục không tồn tại'
    });
  }

  res.status(200).send({
    success: true,
    data: category
  });
});

module.exports = router;
