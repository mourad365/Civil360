import express from 'express';
import { mongoStorage } from '../storage-mongo';
import { generateToken, authenticateToken } from '../middleware/auth';
import UserModel from '../models/User';

const router = express.Router();

// Mock login for development
router.post('/mock-login', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ error: 'Mock login only available in development' });
    }

    const { role } = req.body;
    
    // Mock users for different roles
    const mockUsers = {
      general_director: {
        id: '507f1f77bcf86cd799439011',
        username: 'directeur.general',
        name: 'Directeur Général Mock',
        role: 'general_director',
        email: 'dg@civil360.ma'
      },
      project_engineer: {
        id: '507f1f77bcf86cd799439012',
        username: 'ingenieur.projet',
        name: 'Ingénieur Projet Mock',
        role: 'project_engineer',
        email: 'engineer@civil360.ma'
      },
      purchasing_manager: {
        id: '507f1f77bcf86cd799439013',
        username: 'responsable.achats',
        name: 'Responsable Achats Mock',
        role: 'purchasing_manager',
        email: 'purchasing@civil360.ma'
      },
      logistics_manager: {
        id: '507f1f77bcf86cd799439014',
        username: 'responsable.logistique',
        name: 'Responsable Logistique Mock',
        role: 'logistics_manager',
        email: 'logistics@civil360.ma'
      }
    };

    const selectedRole = role || 'general_director';
    const mockUser = mockUsers[selectedRole as keyof typeof mockUsers] || mockUsers.general_director;

    // Generate token
    const token = generateToken(mockUser);

    res.json({
      success: true,
      message: 'Mock login successful',
      user: mockUser,
      token
    });
  } catch (error) {
    console.error('Mock login error:', error);
    res.status(500).json({ error: 'Mock login failed' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, role, email } = req.body;

    // Validation
    if (!username || !password || !name) {
      return res.status(400).json({ 
        error: 'Username, password, and name are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await mongoStorage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username already exists' 
      });
    }

    // Create new user
    const newUser = await mongoStorage.createUser({
      username,
      password,
      name,
      role: role || 'Chef de Chantier',
      email
    });

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email
      },
      token
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Find user by username
    const user = await UserModel.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      },
      token
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Failed to login',
      details: error.message 
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await mongoStorage.getUser(req.user!.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });

  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get user profile',
      details: error.message 
    });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.user!.id;

    // Get current user
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      updates, 
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser!._id,
        username: updatedUser!.username,
        name: updatedUser!.name,
        role: updatedUser!.role,
        email: updatedUser!.email
      }
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: error.message 
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'New password must be at least 6 characters long' 
      });
    }

    // Get user with password
    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      error: 'Failed to change password',
      details: error.message 
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await mongoStorage.getUser(req.user!.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token
    });

  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      error: 'Failed to refresh token',
      details: error.message 
    });
  }
});

export default router;
