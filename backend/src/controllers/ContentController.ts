import { Request, Response } from 'express';
import { ContentService } from '../services/contentService';
import { LibraryService } from '../services/libraryService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
    if (file.mimetype === 'application/pdf' || 
        file.mimetype.startsWith('video/') || 
        file.mimetype.startsWith('audio/') ||
        file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

export class ContentController {
  static async getNews(req: Request, res: Response) {
    try {
      const news = await ContentService.getAllNews();
      res.status(200).json({
        success: true,
        data: {
          news
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getActivities(req: Request, res: Response) {
    try {
      const activities = await ContentService.getAllActivities();
      res.status(200).json({
        success: true,
        data: {
          activities
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get activities',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getLibraryContent(req: Request, res: Response) {
    try {
      const content = await LibraryService.getAllContent();
      res.status(200).json({
        success: true,
        data: {
          content
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get library content',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getLibraryContentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const content = await LibraryService.getContentById(id);
      
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Library content not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          content
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get library content',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async incrementViewCount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const content = await LibraryService.incrementViewCount(id);
      
      res.status(200).json({
        success: true,
        data: {
          content
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to increment view count',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async incrementDownloadCount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const content = await LibraryService.incrementDownloadCount(id);
      
      res.status(200).json({
        success: true,
        data: {
          content
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to increment download count',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async toggleLike(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id; // Assuming user is attached to request by auth middleware
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      // Check if user has already liked this content
      const hasLiked = await LibraryService.hasUserLikedContent(id, userId);
      
      let result;
      if (hasLiked) {
        // Remove like
        result = await LibraryService.removeLikeFromContent(id, userId);
      } else {
        // Add like
        result = await LibraryService.addLikeToContent(id, userId);
      }
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: hasLiked ? 'Failed to remove like' : 'Failed to add like'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          content: result.content
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to toggle like',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async createNews(req: Request, res: Response) {
    try {
      const news = await ContentService.createNews(req.body);
      res.status(201).json({
        success: true,
        message: 'News created successfully',
        data: {
          news
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async createActivity(req: Request, res: Response) {
    try {
      const activity = await ContentService.createActivity(req.body);
      res.status(201).json({
        success: true,
        message: 'Activity created successfully',
        data: {
          activity
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create activity',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Handle file upload for library content
  static async uploadLibraryContent(req: Request, res: Response) {
    // Use multer to handle the file upload
    upload.single('file')(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
      }

      try {
        // Check if file was uploaded
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No file uploaded'
          });
        }

        // Get form data from request body
        const { title, description, content_type, category, tags } = req.body;
        const uploaded_by = (req as any).user?.id || 'anonymous';

        // Validate required fields
        if (!title || !content_type || !category) {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);
          
          return res.status(400).json({
            success: false,
            message: 'Title, content_type, and category are required'
          });
        }

        // Create content data
        const contentData = {
          title,
          description: description || '',
          content_type: content_type.toLowerCase(),
          category: category.toLowerCase(),
          file_url: `/uploads/${req.file.filename}`,
          file_size: req.file.size,
          uploaded_by,
          tags: tags ? JSON.parse(tags) : [],
          is_published: true,
          download_count: 0,
          view_count: 0,
          like_count: 0
        };

        // Save to database
        const content = await LibraryService.createContent(contentData);

        res.status(201).json({
          success: true,
          message: 'Library content uploaded successfully',
          data: {
            content
          }
        });
      } catch (error) {
        // Clean up uploaded file if database operation failed
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
          success: false,
          message: 'Failed to upload library content',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  // Handle library content update
  static async updateLibraryContent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, content_type, category, tags, is_published } = req.body;
      
      // Create update data
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (content_type) updateData.content_type = content_type.toLowerCase();
      if (category) updateData.category = category.toLowerCase();
      if (tags !== undefined) updateData.tags = JSON.parse(tags);
      if (is_published !== undefined) updateData.is_published = is_published;
      updateData.updated_at = new Date().toISOString();

      // Update in database
      const content = await LibraryService.updateContent(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Library content updated successfully',
        data: {
          content
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update library content',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Handle library content deletion
  static async deleteLibraryContent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Get content to delete file
      const content = await LibraryService.getContentById(id);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Library content not found'
        });
      }
      
      // Delete file from filesystem
      const filePath = path.join(__dirname, '../../uploads', path.basename(content.file_url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Delete from database
      await LibraryService.deleteContent(id);

      res.status(200).json({
        success: true,
        message: 'Library content deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete library content',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}