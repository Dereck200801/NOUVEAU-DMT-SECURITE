import { useState } from 'react';
import { Agent, Document } from '../types/agent';

interface UseDocumentManagementReturn {
  documents: Document[];
  showAddDocument: boolean;
  showPreview: boolean;
  previewFile: Document | null;
  newDocument: {
    name: string;
    type: string;
    date: string;
    file: File | null;
  };
  editingDocumentId: number | null;
  errors: Record<string, string>;
  setShowAddDocument: (show: boolean) => void;
  handleDocumentInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddDocument: () => void;
  handleEditDocument: (id: number) => void;
  handleDeleteDocument: (id: number) => void;
  handlePreviewDocument: (doc: Document) => void;
  handleClosePreview: () => void;
  validateForm: () => boolean;
  addDocumentFromFile: (file: File, name: string, type?: string) => void;
}

export const useDocumentManagement = (agent: Agent): UseDocumentManagementReturn => {
  const [documents, setDocuments] = useState<Document[]>(agent.documents || []);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<Document | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "ID",
    date: "",
    file: null as File | null
  });

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newDocument.name) newErrors.name = "Le nom est requis";
    if (!newDocument.date) newErrors.date = "La date est requise";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements dans le formulaire d'ajout de document
  const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const file = e.target.files?.[0] || null;
      setNewDocument(prev => ({
        ...prev,
        file
      }));
    } else {
      setNewDocument(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Ajout ou modification d'un document
  const handleAddDocument = () => {
    if (!validateForm()) return;

    const fileUrl = newDocument.file ? URL.createObjectURL(newDocument.file) : undefined;
    
    if (editingDocumentId !== null) {
      // Mode édition
      const updatedDocuments = documents.map(doc => 
        doc.id === editingDocumentId 
          ? { 
              ...doc, 
              name: newDocument.name, 
              type: newDocument.type, 
              date: newDocument.date,
              file: newDocument.file || doc.file,
              fileUrl: newDocument.file ? fileUrl : doc.fileUrl
            }
          : doc
      );
      
      setDocuments(updatedDocuments);
    } else {
      // Mode ajout
      const newId = documents.length > 0 
        ? Math.max(...documents.map(d => d.id)) + 1 
        : 1;
        
      const newDoc: Document = {
        id: newId,
        name: newDocument.name,
        type: newDocument.type,
        date: newDocument.date,
        file: newDocument.file,
        fileUrl
      };
      
      setDocuments([...documents, newDoc]);
    }
    
    // Réinitialiser le formulaire
    setNewDocument({
      name: "",
      type: "ID",
      date: "",
      file: null
    });
    setEditingDocumentId(null);
    setShowAddDocument(false);
  };

  // Éditer un document existant
  const handleEditDocument = (id: number) => {
    const docToEdit = documents.find(doc => doc.id === id);
    if (docToEdit) {
      setNewDocument({
        name: docToEdit.name,
        type: docToEdit.type,
        date: docToEdit.date,
        file: null // On ne charge pas le fichier existant pour l'édition
      });
      setEditingDocumentId(id);
      setShowAddDocument(true);
    }
  };

  // Supprimer un document
  const handleDeleteDocument = (id: number) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
  };

  // Prévisualiser un document
  const handlePreviewDocument = (doc: Document) => {
    if (doc.file || doc.fileUrl) {
      setPreviewFile(doc);
      setShowPreview(true);
    }
  };

  // Fermer la prévisualisation
  const handleClosePreview = () => {
    setPreviewFile(null);
    setShowPreview(false);
  };

  // Ajout rapide d'un document (utilisé pour photo d'identité)
  const addDocumentFromFile = (file: File, name: string, type = 'ID') => {
    const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    const fileUrl = URL.createObjectURL(file);
    const newDoc: Document = {
      id: newId,
      name,
      type,
      date: new Date().toLocaleDateString('fr-FR'),
      file,
      fileUrl,
    };
    setDocuments([...documents, newDoc]);
  };

  return {
    documents,
    showAddDocument,
    showPreview,
    previewFile,
    newDocument,
    editingDocumentId,
    errors,
    setShowAddDocument,
    handleDocumentInputChange,
    handleAddDocument,
    handleEditDocument,
    handleDeleteDocument,
    handlePreviewDocument,
    handleClosePreview,
    validateForm,
    addDocumentFromFile
  };
}; 