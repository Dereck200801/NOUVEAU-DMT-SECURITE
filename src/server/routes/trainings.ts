import express from 'express';
import { Certification, Training, CertificationStatus } from '../../types/training';

const router = express.Router();

/*****************************
 * MOCK DATA IN-MEMORY
 *****************************/
let certifications: Certification[] = [];
let trainings: Training[] = [];

/*****************************
 *  UTILITIES
 *****************************/
const generateId = (collection: { id: number }[]): number => {
  return collection.length > 0 ? Math.max(...collection.map((c) => c.id)) + 1 : 1;
};

const computeDaysRemaining = (expirationDate: string): number => {
  const today = new Date();
  const exp = new Date(expirationDate);
  const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
  return diff;
};

const resolveStatus = (daysRemaining: number): CertificationStatus => {
  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= 30) return 'expiring';
  return 'valid';
};

/*****************************
 *  CERTIFICATION ENDPOINTS
 *****************************/
// GET /certifications
router.get('/certifications', (req, res) => {
  const { status, type, search, expiringWithin } = req.query as Partial<{
    status: CertificationStatus;
    type: string;
    search: string;
    expiringWithin: string;
  }>;

  let result = [...certifications];

  if (status) result = result.filter((c) => c.status === status);
  if (type) result = result.filter((c) => c.type === type);
  if (search) {
    const term = search.toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(term) || c.agentName.toLowerCase().includes(term));
  }
  if (expiringWithin) {
    const within = parseInt(expiringWithin, 10);
    result = result.filter((c) => c.daysRemaining <= within);
  }

  res.json(result);
});

// GET /certifications/:id
router.get('/certifications/:id', (req, res) => {
  const id = Number(req.params.id);
  const certification = certifications.find((c) => c.id === id);
  if (!certification) return res.status(404).json({ message: 'Certification non trouvée' });
  res.json(certification);
});

// POST /certifications
router.post('/certifications', (req, res) => {
  const newCert: Certification = {
    id: generateId(certifications),
    ...req.body,
  };
  newCert.daysRemaining = computeDaysRemaining(newCert.expirationDate);
  newCert.status = resolveStatus(newCert.daysRemaining);
  certifications.push(newCert);
  res.status(201).json(newCert);
});

// PUT /certifications/:id
router.put('/certifications/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = certifications.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ message: 'Certification non trouvée' });
  certifications[index] = { ...certifications[index], ...req.body };
  certifications[index].daysRemaining = computeDaysRemaining(certifications[index].expirationDate);
  certifications[index].status = resolveStatus(certifications[index].daysRemaining);
  res.json(certifications[index]);
});

// DELETE /certifications/:id
router.delete('/certifications/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = certifications.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ message: 'Certification non trouvée' });
  certifications = certifications.filter((c) => c.id !== id);
  res.status(204).send();
});

// GET /certifications/stats
router.get('/certifications/stats', (_req, res) => {
  const total = certifications.length;
  const stats = {
    total,
    valid: certifications.filter((c) => c.status === 'valid').length,
    expiring: certifications.filter((c) => c.status === 'expiring').length,
    expired: certifications.filter((c) => c.status === 'expired').length,
    byType: certifications.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.type] = (acc[cur.type] || 0) + 1;
      return acc;
    }, {}),
  };
  res.json(stats);
});

/*****************************
 *  TRAINING ENDPOINTS
 *****************************/
// GET /trainings
router.get('/trainings', (req, res) => {
  const { status, search, startDate, endDate } = req.query as Partial<{
    status: 'completed' | 'in_progress' | 'scheduled';
    search: string;
    startDate: string;
    endDate: string;
  }>;

  let result = [...trainings];

  if (status) result = result.filter((t) => t.status === status);
  if (search) {
    const term = search.toLowerCase();
    result = result.filter((t) => t.name.toLowerCase().includes(term) || t.agentName.toLowerCase().includes(term));
  }
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    result = result.filter((t) => new Date(t.startDate) >= start && new Date(t.endDate) <= end);
  }

  res.json(result);
});

// GET /trainings/:id
router.get('/trainings/:id', (req, res) => {
  const id = Number(req.params.id);
  const training = trainings.find((t) => t.id === id);
  if (!training) return res.status(404).json({ message: 'Formation non trouvée' });
  res.json(training);
});

// POST /trainings
router.post('/trainings', (req, res) => {
  const newTraining: Training = {
    id: generateId(trainings),
    ...req.body,
  };
  trainings.push(newTraining);
  res.status(201).json(newTraining);
});

// PUT /trainings/:id
router.put('/trainings/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = trainings.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Formation non trouvée' });
  trainings[index] = { ...trainings[index], ...req.body };
  res.json(trainings[index]);
});

// DELETE /trainings/:id
router.delete('/trainings/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = trainings.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Formation non trouvée' });
  trainings = trainings.filter((t) => t.id !== id);
  res.status(204).send();
});

export default router; 