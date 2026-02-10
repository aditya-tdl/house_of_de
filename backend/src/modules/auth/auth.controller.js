import bcrypt from "bcrypt";
import { prisma } from "../../config/db.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import catchAsync from "../../utils/catchAsync.js";
import { generateToken } from "../../utils/token.js";

export const register = catchAsync(async (req, res, next) => {
  const { name, email, gender, mobile, password } = req.body;

  if (!name || !email || !password || !mobile || !gender) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      gender,
      mobile,
      password: hashedPassword,
      role: "USER",
    },
  });

  // Generate token and set cookie
  const token = generateToken(res, user.id);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        token,
      },
      "User registered successfully",
    ),
  );
});

export const registerAdmin = catchAsync(async (req, res, next) => {
  const { name, email, gender, mobile, password } = req.body;

  if (!name || !email || !password || !mobile || !gender) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      gender,
      mobile,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Generate token and set cookie
  generateToken(res, user.id);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { id: user.id, name: user.name, email: user.email, role: user.role },
        "Admin registered successfully",
      ),
    );
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }
  // console.log("data", req.body);
  const user = await prisma.user.findUnique({
    where: { email: username },
  });
  // console.log("user", user);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate token and set cookie
  const token = generateToken(res, user.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id: user.id, name: user.name, email: user.email, role: user.role, token, mobile: user.mobile },
        "Login successful",
      ),
    );
});
