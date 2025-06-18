import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Employee, NewEmployee, ContractType } from '../types/employee';
import { Document } from '../types/agent';
import DocumentForm from './DocumentForm';
import DocumentList from './DocumentList';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: NewEmployee | Partial<Employee>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const defaultContract: Employee['contract'] = {
  type: 'cdi',
  startDate: '',
  status: 'pending',
};

const defaultLeave = { annual: 25, remaining: 25 };

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState<NewEmployee | Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'active',
    contract: defaultContract,
    leaveBalance: defaultLeave,
  });

  const [documents, setDocuments] = useState<Document[]>(employee?.documents ?? []);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDoc, setNewDoc] = useState<{name:string; type:string; date:string; file: File|null}>({name:'', type:'ID', date:'', file:null});
  const [editingId, setEditingId] = useState<number|null>(null);
  const [docErrors, setDocErrors] = useState<Record<string,string>>({});

  useEffect(() => {
    if (employee) setFormData({ ...employee });
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('contract.')) {
      const field = name.split('.')[1] as keyof Employee['contract'];
      setFormData((prev) => {
        const updatedContract = {
          ...(prev.contract ?? defaultContract),
          [field]: value,
        } as Employee['contract'];

        // Si on choisit un CDI, on vide la date de fin
        if (field === 'type' && value === 'cdi') {
          updatedContract.endDate = '';
        }

        return {
          ...prev,
          contract: updatedContract,
        };
      });
    } else if (name.startsWith('leave.')) {
      const field = name.split('.')[1] as keyof Employee['leaveBalance'];
      setFormData((prev) => ({
        ...prev,
        leaveBalance: {
          ...(prev.leaveBalance ?? defaultLeave),
          [field]: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetDocForm = () => {
    setNewDoc({name:'', type:'ID', date:'', file:null});
    setEditingId(null);
    setDocErrors({});
  };

  const validateDoc = () => {
    const errs:Record<string,string> = {};
    if(!newDoc.name.trim()) errs.name='Nom requis';
    if(!newDoc.date.trim()) errs.date='Date requise';
    setDocErrors(errs);
    return Object.keys(errs).length===0;
  };

  const handleDocInput = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
    const {name,value,files} = e.target as HTMLInputElement;
    if(name==='file') setNewDoc(prev=>({...prev,file:files?files[0]:null}));
    else setNewDoc(prev=>({...prev,[name]:value}));
  };

  const addOrUpdateDoc = () => {
    if(!validateDoc()) return;
    if(editingId!==null){
      setDocuments(prev=>prev.map(d=>d.id===editingId?{...d,...newDoc}:d));
    } else {
      const id = documents.length?Math.max(...documents.map(d=>d.id))+1:1;
      setDocuments(prev=>[...prev,{id,...newDoc} as Document]);
    }
    resetDocForm();
    setShowAddDoc(false);
  };

  const editDoc = (id:number)=>{
    const doc = documents.find(d=>d.id===id);
    if(doc){
      setNewDoc({name:doc.name,type:doc.type,date:doc.date,file:doc.file});
      setEditingId(id);
      setShowAddDoc(true);
    }
  };

  const deleteDoc = (id:number)=>{
    setDocuments(prev=>prev.filter(d=>d.id!==id));
  };

  const previewDoc = (doc:Document)=>{/* simple alert for now */ window.open(doc.fileUrl??'#','_blank');};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(isEdit? formData : (formData as NewEmployee)),
      documents,
    });
  };

  const contractTypes: ContractType[] = ['cdi', 'cdd', 'interim', 'stagiaire'];
  const statuses: Employee['status'][] = ['active', 'inactive', 'on_leave'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'Modifier un employé' : 'Ajouter un employé'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yale-blue"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yale-blue"
              />
            </div>
            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yale-blue"
              />
            </div>
            {/* Poste */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
              <input
                type="text"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yale-blue"
              />
            </div>
            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yale-blue"
              >
                {statuses.map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>

          {/* Contrat */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Contrat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="contract.type"
                  value={formData.contract?.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yale-blue"
                >
                  {contractTypes.map(t => (<option key={t} value={t}>{t.toUpperCase()}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                <input
                  type="date"
                  name="contract.startDate"
                  value={formData.contract?.startDate || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yale-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                <input
                  type="date"
                  name="contract.endDate"
                  value={formData.contract?.endDate || ''}
                  onChange={handleChange}
                  disabled={formData.contract?.type === 'cdi'}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yale-blue ${
                    formData.contract?.type === 'cdi' ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Documents</h3>
              <button type="button" onClick={()=>{resetDocForm();setShowAddDoc(true);}} className="bg-yale-blue text-white px-3 py-1 rounded-lg text-sm">+ Ajouter</button>
            </div>

            {showAddDoc && (
              <DocumentForm
                newDocument={newDoc}
                errors={docErrors}
                editingDocumentId={editingId}
                onInputChange={handleDocInput}
                onSubmit={addOrUpdateDoc}
                onCancel={()=>{setShowAddDoc(false); resetDocForm();}}
              />
            )}

            <DocumentList
              documents={documents}
              onPreview={previewDoc}
              onEdit={editDoc}
              onDelete={deleteDoc}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue">
              {isEdit ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm; 