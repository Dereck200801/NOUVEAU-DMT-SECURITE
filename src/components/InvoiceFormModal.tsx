import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Invoice, InvoiceStatus } from '../types/billing';

export interface InvoiceFormValues extends Omit<Invoice, 'id'> {}

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: InvoiceFormValues, id?: number) => void;
  invoice?: Invoice; // existing invoice for edit mode
}

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ isOpen, onClose, onSave, invoice }) => {
  const [formData, setFormData] = useState<InvoiceFormValues>({
    clientId: 0,
    clientName: '',
    amount: 0,
    currency: 'XAF',
    status: 'pending',
    issueDate: new Date().toISOString().substring(0, 10),
    dueDate: new Date().toISOString().substring(0, 10),
    description: '',
  });

  useEffect(() => {
    if (invoice) {
      // populate fields for editing
      const { id, ...rest } = invoice;
      setFormData({ ...rest, issueDate: rest.issueDate.substring(0, 10), dueDate: rest.dueDate.substring(0, 10) });
    } else {
      // reset to defaults
      setFormData({
        clientId: 0,
        clientName: '',
        amount: 0,
        currency: 'XAF',
        status: 'pending',
        issueDate: new Date().toISOString().substring(0, 10),
        dueDate: new Date().toISOString().substring(0, 10),
        description: '',
      });
    }
  }, [invoice]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, invoice?.id);
  };

  const STATUS_OPTIONS: InvoiceStatus[] = ['paid', 'pending', 'overdue'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 animate-fade-in overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{invoice ? 'Modifier la facture' : 'Nouvelle facture'}</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client (nom)</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Client ID</label>
            <input
              type="number"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Montant</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Devise</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date d'émission</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date d'échéance</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full h-28 resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg">
              {invoice ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceFormModal; 