var UserService = require('../services/user.service');
var MailerService = require('../services/mailer.service');
var Authorization = require('../auth/authorization');


// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getUsers = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Users = await UserService.getUsers({}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}
exports.getUsersByMail = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    let filtro= {email: req.body.email}
    console.log(filtro)
    try {
        var Users = await UserService.getUsers(filtro, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.createUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    var User = {
        name: req.body.name,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser = await UserService.createUser(User)
        return res.status(201).json({createdUser, message: "Succesfully Created User"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        if (e.message === 'El email ya está registrado')
            return res.status(409).json({status: 409, message: e.message})
        if (e.message === 'La contraseña debe tener al menos 6 caracteres')
            return res.status(400).json({status: 400, message: e.message})
        if (e.name === 'ValidationError')
            return res.status(400).json({status: 400, message: e.message})
        return res.status(400).json({status: 400, message: "User Creation was Unsuccesfull"})
    }
}

exports.updateUser = async function (req, res, next) {

    // The Id comes from the auth token (set by the Authorization middleware)
    var User = {
        _id: req.userId,
        name: req.body.name ? req.body.name : null,
        apellido: req.body.apellido ? req.body.apellido : null,
        email: req.body.email ? req.body.email : null,
        telefono: req.body.telefono ? req.body.telefono : null,
        password: req.body.password ? req.body.password : null
    }

    try {
        var updatedUser = await UserService.updateUser(User)
        if (!updatedUser)
            return res.status(404).json({status: 404, message: "Usuario no encontrado"})
        return res.status(200).json({status: 200, data: updatedUser, message: "Succesfully Updated User"})
    } catch (e) {
        if (e.message === 'El email ya está registrado')
            return res.status(409).json({status: 409, message: e.message})
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.removeUser = async function (req, res, next) {

    // The Id comes from the auth token: each user can only delete their own account
    var id = req.userId;
    try {
        var deleted = await UserService.deleteUser(id);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}


exports.loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    var User = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var loginUser = await UserService.loginUser(User);
        if (loginUser===0)
            return res.status(401).json({message: "Error en el usuario o en la contraseña"})
        else
            return res.status(200).json({loginUser, message: "Succesfully login"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: "Invalid call"})
    }
}
exports.logoutUser = async function (req, res, next) {
    // Invalidate the token so it can't be used anymore
    Authorization.blacklistToken(req.headers['x-access-token']);
    return res.status(200).json({status: 200, message: "Logout exitoso"});
}

exports.forgotPassword = async function (req, res, next) {
    try {
        var result = await UserService.forgotPassword(req.body.email);
        if (result.found) {
            var url = (process.env.FRONTEND_URL || 'http://localhost:3000') + '/reset-password?token=' + result.token;
            await MailerService.sendResetPasswordEmail(result.user.email, url);
        }
        // Same message whether the email exists or not (security: don't reveal registered emails)
        return res.status(200).json({status: 200, message: "Si el email existe, enviamos las instrucciones para recuperar la contraseña."});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.resetPassword = async function (req, res, next) {
    try {
        var ok = await UserService.resetPassword(req.body.token, req.body.password);
        if (!ok)
            return res.status(400).json({status: 400, message: "Token inválido o expirado."});
        return res.status(200).json({status: 200, message: "Contraseña actualizada con éxito."});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}



