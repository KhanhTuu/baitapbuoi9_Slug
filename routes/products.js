var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');
let CategoryModel = require('../schemas/category');
const slugify = require('slugify');

// Route để lấy tất cả sản phẩm trong một danh mục theo slug của danh mục
router.get('/slug/:category', async function(req, res, next) {
    let categorySlug = req.params.category;
    let category = await CategoryModel.findOne({ slug: categorySlug });

    if (!category) {
        return res.status(404).send({ success: false, message: 'Danh mục không tồn tại' });
    }

    let products = await productModel.find({ category: category._id });

    res.status(200).send({
        success: true,
        data: products
    });
});
// Route để thêm mới sản phẩm
router.post('/', async function(req, res, next) {
  try {
      // Kiểm tra xem category có tồn tại không
      let category = await CategoryModel.findById(req.body.category);
      if (!category) {
          return res.status(400).send({
              success: false,
              message: 'Danh mục không tồn tại'
          });
      }

      let newProduct = new productModel({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          quantity: req.body.quantity,
          imgURL: req.body.imgURL,
          category: req.body.category,
          slug: slugify(req.body.name, { lower: true }) // Tạo slug từ tên sản phẩm
      });

      await newProduct.save();

      res.status(200).send({
          success: true,
          data: newProduct
      });
  } catch (error) {
      res.status(400).send({
          success: false,
          message: error.message
      });
  }
});

// Route để lấy một sản phẩm cụ thể theo slug của danh mục và slug của sản phẩm
router.get('/slug/:category/:product', async function(req, res, next) {
    let categorySlug = req.params.category;
    let productSlug = req.params.product;

    let category = await CategoryModel.findOne({ slug: categorySlug });

    if (!category) {
        return res.status(404).send({ success: false, message: 'Danh mục không tồn tại' });
    }

    let product = await productModel.findOne({ slug: productSlug, category: category._id });

    if (!product) {
        return res.status(404).send({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).send({
        success: true,
        data: product
    });
});

module.exports = router;
