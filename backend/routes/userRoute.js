const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require("node:crypto");
const {Resend} = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY); 

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const {name, email, password} = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({
            message: "Name is required"
        })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        })
    }
    if (!password || password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        })
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            message: "Email already registered"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
        name,
        email,
        password : hashedPassword,
        isEmailVerified: false,
        verificationToken,
        verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });
    const verificationLink = `https://finora-expense-tracker-project.vercel.app/verify-email/${verificationToken}`;
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your Finora account",
      html: `
        <h2>Verify your Finora account</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
    res.status(201).json({
        message: "Registration successful. Please check your email to verify your account.",
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to register user",
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to login",
    });
  }
});


router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to verify email",
    });
  }
});


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
});



router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.body.name || !req.body.name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
});



router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isDemo) {
    return res.status(403).json({
      message: "Password cannot be changed for the demo account",
    });
  }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to change password",
    });
  }
});


router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email address",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `https://finora-expense-tracker-project.vercel.app/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your Finora password",
      html: `
        <h2>Reset your Finora password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send password reset link",
    });
  }
});


router.put("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset link",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to reset password",
    });
  }
});


module.exports = router;