import type { Agent } from '../types/agent';

const AGENTS_DATA: Agent[] = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@dmt-securite.com',
    phone: '+241 77123456',
    address: '123 Rue des Palmiers, Libreville',
    birthDate: '15/05/1985',
    education: 'Formation en sécurité',
    certifications: ['Agent de sécurité', 'Premier secours'],
    specialty: 'Protection rapprochée',
    joinDate: '15/03/2021',
    status: 'active',
    documents: [],
    missionHistory: [],
    badge: 'AG001',
    specializations: ['Protection rapprochée', 'Surveillance']
  },
  {
    id: 2,
    name: 'Marie Koumba',
    email: 'marie.koumba@dmt-securite.com',
    phone: '+241 77234567',
    address: "456 Avenue de l'Indépendance, Libreville",
    birthDate: '22/09/1990',
    education: 'Formation en sécurité',
    certifications: ['Agent de sécurité', "Contrôle d'accès"],
    specialty: "Contrôle d'accès",
    joinDate: '01/06/2021',
    status: 'active',
    documents: [],
    missionHistory: [],
    badge: 'AG002',
    specializations: ["Contrôle d'accès", 'Surveillance']
  },
  {
    id: 3,
    name: 'Pierre Moussavou',
    email: 'pierre.moussavou@dmt-securite.com',
    phone: '+241 77345678',
    address: '789 Boulevard Triomphal, Libreville',
    birthDate: '10/12/1988',
    education: 'Formation en sécurité et protection',
    certifications: ['Agent de sécurité', 'Formation'],
    specialty: 'Formation',
    joinDate: '10/01/2022',
    status: 'active',
    documents: [],
    missionHistory: [],
    badge: 'AG003',
    specializations: ['Protection rapprochée', 'Formation']
  }
];

export default AGENTS_DATA; 