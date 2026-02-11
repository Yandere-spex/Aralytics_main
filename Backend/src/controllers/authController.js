const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new ApiError(400, 'Please provide all required fields');
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, 'Passwords do not match');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password
  });

  const token = user.generateToken();

  res.status(201).json(
    new ApiResponse(201, {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    }, 'User registered successfully')
  );
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = user.generateToken();

  res.status(200).json(
    new ApiResponse(200, {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    }, 'Login successful')
  );
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json(
    new ApiResponse(200, { user }, 'User retrieved successfully')
  );
});

exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, null, 'Logout successful')
  );
});