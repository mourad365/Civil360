import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subdirectories based on file type
    let subDir = '';
    if (file.fieldname === 'planFile') {
      subDir = 'plans';
    } else if (file.fieldname === 'qualityImage') {
      subDir = 'quality';
    } else if (file.fieldname === 'profileImage') {
      subDir = 'profiles';
    } else {
      subDir = 'general';
    }

    const fullPath = path.join(uploadDir, subDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter for allowed types
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Define allowed file types per field
  const allowedTypes: { [key: string]: string[] } = {
    planFile: ['.dwg', '.ifc', '.pdf', '.rvt', '.skp'],
    qualityImage: ['.jpg', '.jpeg', '.png', '.webp'],
    profileImage: ['.jpg', '.jpeg', '.png', '.webp'],
    general: ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx']
  };

  const fileExt = path.extname(file.originalname).toLowerCase();
  const fieldAllowedTypes = allowedTypes[file.fieldname] || allowedTypes.general;

  if (fieldAllowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types for ${file.fieldname}: ${fieldAllowedTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB default
    files: 10 // Maximum 10 files per request
  }
});

// Export different upload configurations
export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => upload.array(fieldName, maxCount);
export const uploadFields = (fields: { name: string; maxCount?: number }[]) => upload.fields(fields);

// Utility function to delete uploaded file
export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Utility function to get file URL
export const getFileUrl = (req: any, filePath: string): string => {
  const relativePath = path.relative(uploadDir, filePath);
  return `${req.protocol}://${req.get('host')}/uploads/${relativePath.replace(/\\/g, '/')}`;
};

export default upload;
