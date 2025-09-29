import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        data: {
          users
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get users',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
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
        message: 'Failed to get user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.updateUser(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
          user
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getFeaturedExperts(req: Request, res: Response) {
    try {
      const featuredExperts = await UserService.getFeaturedExperts();
      
      res.status(200).json({
        success: true,
        data: { featuredExperts }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get featured experts',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateFeaturedStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { featured, achievement, quote } = req.body;
      
      const user = await UserService.updateFeaturedStatus(id, featured, achievement, quote);
      
      res.status(200).json({
        success: true,
        message: `User ${featured ? 'added to' : 'removed from'} featured experts`,
        data: { 
          user
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update featured status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}