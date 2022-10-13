const express = require( 'express');

const controller = require( '../controllers/user.controller');

const router = express.Router();


router.post('/', controller.post);

router.get('/:id', controller.getOne);

router.get('/', controller.get);

router.put('/:id', controller.put);

router.delete('/:id', controller.remove);

module.exports = router;