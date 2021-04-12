const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {

    if(!req.user) {
        return res.status(500).json({
            msg: 'It is required to verify the role is valid token first.'
        });
    }
    const { rol, name } = req.user;

    if(rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not administrator - Cannot do this.`
        });
    }
    next();
}

module.exports = {
    isAdminRole
}