import React, { useState, useRef } from 'react';
import { Employee } from '../types/employee';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEllipsisV, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import useClickOutside from '../hooks/useClickOutside';
import useKeyPress from '../hooks/useKeyPress';
import Loader from './ui/loader';

interface EmployeeCardProps {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  isDeleting?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onView, onEdit, onDelete, isDeleting = false }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(menuRef, () => setOpen(false), [buttonRef]);
  useKeyPress('Escape', () => setOpen(false));

  const toggle = () => setOpen(!open);

  const statusColor = {
    active: 'text-success',
    inactive: 'text-gray-500',
    on_leave: 'text-warning',
  }[employee.status];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
      {isDeleting && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
          <Loader />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-yale-blue/20 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faUser} className="text-yale-blue text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                {employee.name}
                <span className={`text-xs ${statusColor}`}>●</span>
              </h3>
              <span className="text-sm text-gray-500">{employee.position}</span>
            </div>
          </div>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={toggle}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              disabled={isDeleting}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            <div
              ref={menuRef}
              className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg transition-all duration-150 z-10 ${
                open ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <button
                onClick={() => {
                  onView(employee);
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" /> Voir
              </button>
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(employee);
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(employee);
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{employee.email}</p>
          <p>{employee.phone}</p>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 text-sm flex justify-between items-center">
        <span>Solde congés :</span>
        <span className="font-medium">{employee.leaveBalance.remaining} j.</span>
      </div>
    </div>
  );
};

export default EmployeeCard; 