const express = require('express');
const authRouter = require('./auth');
const clientsRouter = require('./clients');
const employeesRouter = require('./employees');
const productsRouter = require('./products');
const salesRouter = require('./sales');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/clients', clientsRouter);
router.use('/employess', employeesRouter);
router.use('/products', productsRouter);
router.use('/sales', salesRouter);

module.exports = router;