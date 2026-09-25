// Gettign the Newly created Mongoose Model we just created
var User = require('../models/User.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query",query)
        var Users = await User.paginate(query, options)
        // Return the Userd list that was retured by the mongoose promise
        return Users;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while Paginating Users');
    }
}

exports.createUser = async function (user) {
    if (!user.password || user.password.length < 6)
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    // Creating a new Mongoose Object by using the new keyword
    var hashedPassword = bcrypt.hashSync(user.password, 8);
    
    // The first registered user becomes the admin of the site
    var userCount = await User.estimatedDocumentCount();

    var newUser = new User({
        name: user.name,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        date: new Date(),
        password: hashedPassword,
        role: userCount === 0 ? 'admin' : 'usuario'
    })

    try {
        // Saving the User 
        var savedUser = await newUser.save();
        var token = jwt.sign({
            id: savedUser._id,
            role: savedUser.role
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    } catch (e) {
        // return a Error message describing the reason
        if (e.code === 11000) throw new Error('El email ya está registrado');
        if (e.name === 'ValidationError') throw e;
        throw Error("Error while Creating User")
    }
}

exports.updateUser = async function (user) {

    try {
        //Find the User by the Id that came in the auth token
        var oldUser = await User.findById(user._id).select('+password');
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }
    //Edit only the provided fields
    if (user.name) oldUser.name = user.name
    if (user.apellido) oldUser.apellido = user.apellido
    if (user.email) oldUser.email = user.email
    if (user.telefono) oldUser.telefono = user.telefono
    if (user.password) oldUser.password = bcrypt.hashSync(user.password, 8)
    try {
        var savedUser = await oldUser.save()
        savedUser.password = undefined
        return savedUser;
    } catch (e) {
        if (e.code === 11000) throw new Error('El email ya está registrado');
        if (e.name === 'ValidationError') throw e;
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUser = async function (id) {
    // Delete the User
    try {
        var deleted = await User.deleteOne({
            _id: id
        })
        if (deleted.deletedCount === 0) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}

exports.getUserById = async function (id) {
    try {
        var user = await User.findById(id).select('-password');
        return user;
    } catch (e) {
        throw Error("Error while finding User by Id");
    }
}


exports.forgotPassword = async function (email) {
    try {
        var user = await User.findOne({ email: email });
        // Always respond ok, so the endpoint doesn't reveal which emails are registered
        if (!user) return { found: false };
        var token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // valid for 1 hour
        await user.save();
        return { found: true, user: user, token: token };
    } catch (e) {
        throw Error("Error while recovering password")
    }
}

exports.resetPassword = async function (token, newPassword) {
    if (!newPassword || newPassword.length < 6)
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    try {
        var user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+password');
        if (!user) return false;
        user.password = bcrypt.hashSync(newPassword, 8);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return true;
    } catch (e) {
        throw Error("Error while resetting password")
    }
}

exports.loginUser = async function (user) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 
        var _details = await User.findOne({
            email: user.email
        }).select('+password');
        if (!_details) return 0;
        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) return 0;

        var token = jwt.sign({
            id: _details._id,
            role: _details.role
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        _details.password = undefined;
        return {token:token, user:_details};
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Login User")
    }

}