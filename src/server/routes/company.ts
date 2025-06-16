import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import Company from '../models/Company';

const router = express.Router();

// Get company info
router.get('/', auth, async (req, res) => {
  try {
    const company = await Company.findOne();
    if (!company) {
      return res.status(404).json({ message: 'Informations de l\'entreprise non trouvées' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des informations de l\'entreprise' });
  }
});

// Update company info (admin only)
router.put('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { companyName, address, phone, email, website, taxId } = req.body;
    let company = await Company.findOne();

    if (!company) {
      // Create new company if it doesn't exist
      company = new Company({
        companyName,
        address,
        phone,
        email,
        website,
        taxId
      });
    } else {
      // Update existing company
      company.companyName = companyName || company.companyName;
      company.address = address || company.address;
      company.phone = phone || company.phone;
      company.email = email || company.email;
      company.website = website || company.website;
      company.taxId = taxId || company.taxId;
    }

    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des informations de l\'entreprise' });
  }
});

export default router; 