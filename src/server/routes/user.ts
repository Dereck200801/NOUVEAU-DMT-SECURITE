import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, language } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.language = language || user.language;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
});

// Update notification settings
router.put('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.notification_settings = {
      ...user.notification_settings,
      ...req.body
    };

    await user.save();
    res.json(user.notification_settings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des paramètres de notification' });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Check current password
    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Update password
    user.password = new_password;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
  }
});

// Get all users (admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

export default router; 