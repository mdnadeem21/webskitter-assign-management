const User = require('../model/user.model')
const Otp = require('../model/otp.model')
const { uploadFileOnCloudinary } = require('../utils/fileUploadOnCloudinary')
const sendOtp = require('../utils/send.otp')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


class UserController{
    async registerUser(req,res){
        try {   
                console.log("Req body : ",req.body);
                const { name, email, password, phone } = req.body;

                if(!name || !email || !password ){
                        return res.status(400).json({
                        status: false,
                        message: "All fields are required",
                    });
                }
        
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "User already exists" });
                }
        
                    const hashedPassword = await bcryptjs.hash(password, 10);
        
                    const newUser = new User({
                        name,
                        email,
                        phone,
                        password: hashedPassword,
                    });
                     // upload profile image if provided
                    if (req.file) {
                        const avatarPath = req.file.path;
                        const cloudinaryResponse = await uploadFileOnCloudinary(avatarPath);
                        newUser.avatar = cloudinaryResponse.url;
                    }
                    // send otp on email for verification
                    await sendOtp(req,newUser);
                    const data = await newUser.save();
        
                    res.status(201).json({
                        status: "success",
                        message: "User registered successfully",
                        data: data
                    });
        } catch (error) {
                    console.error(error);
                    res.status(500).json({
                        status: false,
                        message: "Server error in registerUser"
                    });
        }
    }

    async verifyOtp(req,res){
            try {
                const { email, otp } = req.body;
            
                if (!email || !otp) {
                    return res.status(400).json({ status: false, message: "All fields are required" });
                }
                const existingUser = await User.findOne({ email });

                // Check if email doesn't exists
                if (!existingUser) {
                    return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
                }

                // Check if email is already verified
                if (existingUser.isVerified) {
                    return res.status(400).json({ status: false, message: "Email is already verified" });
                }
                // Check if there is a matching email verification OTP
                const emailVerification = await Otp.findOne({ userId: existingUser._id, otp });
                // if (!emailVerification) {
                //     if (!existingUser.isVerified) {
                //         // console.log(existingUser);
                //         await sendEmail(req, existingUser);
                //         return res.status(400).json({ status: false, message: "Invalid OTP, new OTP sent to your email" });
                //     }
                //     return res.status(400).json({ status: false, message: "Invalid OTP" });
                // }
                // Check if OTP is expired
                const currentTime = new Date();
                // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
                const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
                if (currentTime > expirationTime) {
                    // OTP expired, send new OTP
                    await sendOtp(req, existingUser);
                    return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
                }
                // OTP is valid and not expired, mark email as verified
                existingUser.isVerified = true;
                await existingUser.save();

                // Delete email verification document
                await Otp.deleteMany({ userId: existingUser._id });
                return res.status(200).json({ status: true, message: "Email verified successfully" });


        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Unable to verify email, please try again later" });
        }
    }

    async loginUser(req, res) {
            try {
                const { email, password } = req.body;

                // Check if the user exists
                const user = await User.findOne({ email,isDeleted:false });
                if (!user) {
                    return res.status(400).json({
                        status: false,
                        message: 'Invalid email or password'
                    });
                }

                // Check if the password is correct
                const isMatch = await bcryptjs.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({
                        status: false,
                        message: 'Invalid email or password'
                    });
                }
                // check for verified user
                if(!user.isVerified){
                    return res.status(400).json({
                        status: false,
                        message: 'you are not verified, first verify your email.'
                    }); 
                } 
                // Generate access token using JWT
                const accesstoken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10m' });
                const refreshtoken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
                user.refreshToken = refreshtoken;
                
                await user.save();
                res.cookie("accessToken", accesstoken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                return res.status(200).json({
                    status: true,
                    message: 'Login successful',
                    data: user,
                    token: {
                        accessToken: accesstoken,
                        refreshToken: refreshtoken
                    }
                });
            } catch (error) {
                console.error('Error logging in user:', error);
                return res.status(500).json({
                    status: false,
                    message: 'Internal server error in login user'
                });
            }
    }

    async logoutUser(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'User not found'
                });
            }

            // Clear the refresh token from the user document
            user.refreshToken = null;
            await user.save();

            // Clear the cookie
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict'
            });

            return res.status(200).json({
                status: true,
                message: 'Logout successful'
            });
        } catch (error) {
            console.error('Error logging out user:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error in logout user',
                error:error.message
            });
        }
    }

    async resetPasswordLink(req, res) {

        //TODO: check for the rest password link
        try {
            const { email } = req.body;

            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'User not found'
                });
            }

            // Generate token for password reset
            const secret = user._id + process.env.JWT_SECRET;
            const tokenLink = jwt.sign({ userID: user._id }, secret, { expiresIn: '20m' });
            // Reset Link and this link generate by frontend developer
            const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${tokenLink}`;
            //console.log(resetLink);
            // Send password reset email  
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Password Reset Link",
                html: `<p>Hello ${user.name},</p><p>Please <a href="${resetLink}">Click here</a> to reset your password.</p>`
            });
            // Send success response
            res.status(200).json({ status: true, message: "Password reset link sent to your email. Please check your email." });
        } catch (error) {
            console.error('Error sending password reset link:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error in sending password reset link'
            });
        }
    }

    async resetPassword(req, res) {
        try {
            const { old_password, new_password, confirm_password } = req.body;
            const { id, token } = req.params;
            const user = await User.findById(id);
            if (!user) {
                return res.status(400).json({ status: false, message: "User not found" });
            }

            // Validate token
            const new_secret = user._id + process.env.JWT_SECRET;
            jwt.verify(token, new_secret);

            if (!old_password || !new_password || !confirm_password) {
                return res.status(400).json({ status: false, message: "Old password, new password and confirm password are required" });
            }

            // Check old password correctness
            const isOldPasswordCorrect = await bcrypt.compare(old_password, user.password);
            if (!isOldPasswordCorrect) {
                return res.status(400).json({ status: false, message: "Old password is incorrect" });
            }

            if (new_password !== confirm_password) {
                return res.status(400).json({ status: false, message: "New password and confirm password do not match" });
            }

            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(new_password, salt);

            user.password = newHashPassword;
            await user.save();

            res.status(200).json({ status: true, message: "Password reset successfully" });
        } catch (error) {
            console.error('Error resetting password:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error in resetting password'
            });
        }
    }

    async changeUserRole(req,res){
        try {
            const { userId, role } = req.body;

            if (!userId || !role) {
                return res.status(400).json({ status: false, message: 'userId and role are required' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }
            const alloweRoles = ["admin","manager","user"]
            if(!allowedRoles.include(role)){
                return res.status(400)
                            .json({
                                status:false,
                                message :"Invalid role"
                            })
            }

            user.role = role;
            await user.save();

            return res.status(200).json({ status: true, message: 'User role updated successfully', data: { id: user._id, role: user.role } });
        } catch (error) {
            console.error('Error changing user role:', error);
            return res.status(500).json({ status: false, message: 'Internal server error in changing user role' });
        }
    }

    async getAllUsers(req,res){
        try {
                const users = await User.find({
                isDeleted: false
                }).select("-password");

                if(!user){
                    res.status(400).json({
                        success: false,
                        message: "users not found"
                        });
                }
                res.status(200).json({
                success: true,
                count: users.length,
                data: users
                });

        } catch (error) {
            console.error('Error in getting all users:', error.message);
            return res.status(500).json({ status: false, message: 'Internal server error in get all users' });
        }
    }

    async getUserById(req,res){
        try {
                const user = await User.findOne({
                _id: req.params.id,
                isDeleted: false
                }).select("-password");

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                }

                res.status(200).json({
                success: true,
                data: user
                });

        } catch (error) {
            console.error('Error in getting user:', error.message);
            return res.status(500).json({ status: false, message: 'Internal server error in get user by id' });
        }
    }

    async updateUser(req,res){
        try {
            const {
            name,
            phone,
            } = req.body;

            const user = await User.findOne({
            _id: req.params.id,
            isDeleted: false
            });

            if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
            }

            user.name = name ?? user.name;
            user.phone = phone ?? user.phone;

            if(req.file){
                const avatarPath = req.file.path
                const cloudinaryResponse = await uploadFileOnCloudinary(avatarPath)
                user.avatar = cloudinaryResponse.url
            }

            await user.save();

            res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
            });

        } catch (error) {
            console.error('Error updating user:', error.message);
            return res.status(500).json({ status: false, message: 'Internal server error in update user' });
        }
    }
    async archieveUser(req,res){
        try {
                const user = await User.findOne({
                _id: req.params.id,
                isDeleted: false
                });

                if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
                }

                user.isDeleted = true;
                user.isActive = false;

                await user.save();

                res.status(200).json({
                success: true,
                message: "User deleted successfully"
                });

        } catch (error) {
            console.error('Error archieve user:', error.message);
            return res.status(500).json({ status: false, message: 'Internal server error in archieve user' });
        }
    }
}
module.exports = new UserController()