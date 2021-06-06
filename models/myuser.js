const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretkey="My Node Js Secret Key"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password"')
                }
            }
        },
        phoneno: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (/^[0-9]{10}$/.test(value)==false) {
                    throw new Error('Phone no must be 10 digits')
                }
            }
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be a postive number')
                }
            }
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        designation: {
            type: String,
            default: '',
            trim: true
        },
        
        tokens : [ 
            {
                token : {
                    type: String,
                    default: '',
                    trim: true
                },
                
            }, 
            
        ]
    }
)
//relation ship
userSchema.virtual('usertasks', {
    ref: 'Taskdetails',
    localField: '_id',
    foreignField: 'owner'
})
//userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
//generate auth jwt token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token=jwt.sign({_id:user._id.toString()},secretkey, { expiresIn: 60 * 60 * 4 })
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token
}

//compare credentials for login
userSchema.statics.findByCredentials = async (email, password) => {
   const user = await myUser.findOne({ email:email })
   if (!user) {
        
        throw new Error('Unable to login')
    }
    const isMatch= await bcrypt.compare(password,user.password)
    if (!isMatch) {
        
        throw new Error('Unable to login')
    }
    
    return user
}
//encrypt password using bcrypt hashing algorithm
userSchema.pre('save', async function (next) {
    const user = this
    saltRounds=8
    if (user.isModified('password')) {
        user.password=await bcrypt.hash(user.password, saltRounds);
    }
    next()
})
const myUser = mongoose.model('User', userSchema)

module.exports={
    myUserModel:myUser,
    
}