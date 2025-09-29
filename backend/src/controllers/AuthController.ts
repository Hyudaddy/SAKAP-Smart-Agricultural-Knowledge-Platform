import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types';

// Define JWT payload interface
interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, province, municipality, barangay } = req.body;
      
      // Check if user already exists
      const existingUser = await UserService.getUserByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Generate user ID based on role
      const roleId = await UserService.generateUserId(role || 'public');
      
      // Create user
      const user = await UserService.createUser({
        id: roleId,
        name,
        email,
        password_hash: hashedPassword,
        role: role || 'public',
        province,
        municipality,
        barangay,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Partial<User>);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role } as JwtPayload,
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );
      
      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await UserService.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash || '');
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role } as JwtPayload,
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );
      
      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      // In a real implementation, you might want to invalidate the token
      // For now, we'll just send a success response
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      // Extract user from request (set by auth middleware)
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          user
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get user data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}