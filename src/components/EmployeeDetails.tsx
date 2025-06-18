import React from 'react';
import { Employee } from '../types/employee';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUser,
  faEnvelope,
  faPhone,
  faBriefcase,
  faFileContract,
  faCalendarAlt,
  faPlaneDeparture,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusColors: Record<Employee['status'], string> = {
  active: 'text-success',
  inactive: 'text-gray-500',
  on_leave: 'text-warning',
};

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Header */}
        <div className="flex items-start p-6 border-b">
          <div className="w-16 h-16 rounded-lg bg-yale-blue/20 flex items-center justify-center mr-4">
            <FontAwesomeIcon icon={faUser} className="text-yale-blue text-2xl" />
          </div>
          <div>
            <h2 className="font-bold text-2xl flex items-center gap-2">
              {employee.name} <span className={`text-xs ${statusColors[employee.status]}`}>●</span>
            </h2>
            <p className="text-gray-500 capitalize flex items-center gap-2">
              <FontAwesomeIcon icon={faBriefcase} /> {employee.position}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm text-gray-700 max-h-[70vh] overflow-y-auto">
          {/* Coordonnées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4" />
              <span>{employee.phone}</span>
            </div>
          </div>

          {/* Contrat */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faFileContract} /> Contrat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium">Type :</span> {employee.contract.type.toUpperCase()}
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span className="font-medium">Début :</span> {employee.contract.startDate || '—'}
              </div>
              {employee.contract.endDate && (
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span className="font-medium">Fin :</span> {employee.contract.endDate}
                </div>
              )}
            </div>
          </div>

          {/* Congés */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faPlaneDeparture} /> Congés
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Droits acquis</p>
                <p className="text-lg font-bold">{employee.leaveBalance.annual} j.</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Restant</p>
                <p className="text-lg font-bold">{employee.leaveBalance.remaining} j.</p>
              </div>
            </div>
          </div>

          {/* Documents (si présents) */}
          {employee.documents && employee.documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <ul className="space-y-1 list-disc list-inside">
                {employee.documents.map((doc) => (
                  <li key={doc.id}>{doc.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-yale-blue hover:bg-berkeley-blue text-white rounded-lg flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails; 