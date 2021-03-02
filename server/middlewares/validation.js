const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(404).json({ message: errors.array() })
    }

    next();
}