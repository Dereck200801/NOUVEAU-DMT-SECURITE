import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoiceDollar,
  faMoneyBillWave,
  faExclamationTriangle,
  faClock,
  faSpinner,
  faPlus,
  faPen,
  faTrash,
  faCheck,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import DashboardCard from '../components/DashboardCard';
import billingService from '../services/billingService';
import type { Invoice, BillingStats } from '../types/billing';
import InvoiceFormModal from '../components/InvoiceFormModal';
import { exportToCsv } from '../utils/csvUtils';

// Enregistrer les composants ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Formatage des montants en XAF (ou autre devise)
const formatCurrency = (value: number, currency = 'XAF') =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);

const STATUS_LABELS: Record<string, string> = {
  paid: 'Payée',
  pending: 'En attente',
  overdue: 'En retard',
};

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [revenueData, setRevenueData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [inv, st, revMap] = await Promise.all([
          billingService.getAll(),
          billingService.getStats(),
          billingService.getRevenueByMonth(),
        ]);

        setInvoices(inv);
        setStats(st);

        // Préparer les données pour le graphique
        const sortedMonths = Object.keys(revMap).sort(); // yyyy-mm
        const labels = sortedMonths.map((key) => {
          const [year, month] = key.split('-').map(Number);
          const date = new Date(year, month - 1, 1);
          return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        });
        const values = sortedMonths.map((key) => revMap[key]);
        setRevenueData({ labels, values });
        setError(null);
      } catch (err: any) {
        console.error('Erreur lors du chargement des données de facturation:', err);
        setError('Impossible de charger les données de facturation.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset page when filters/search update
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, invoices]);

  // Filtrer les factures selon le statut
  const filteredInvoices = invoices.filter((inv) => {
    const statusOk = statusFilter ? inv.status === statusFilter : true;
    const termOk = searchTerm
      ? inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return statusOk && termOk;
  });

  // Pagination
  const pageCount = Math.ceil(filteredInvoices.length / PAGE_SIZE) || 1;
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const refreshStats = async (updatedInvoices: Invoice[]) => {
    setInvoices(updatedInvoices);
    // Recompute stats locally for instant feedback
    const totalRevenue = updatedInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const outstanding = updatedInvoices
      .filter((inv) => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = updatedInvoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
    setStats({ totalRevenue, outstanding, overdue, invoicesCount: updatedInvoices.length });
  };

  const handleCreate = () => {
    setEditingInvoice(undefined);
    setIsModalOpen(true);
  };

  const handleSaveInvoice = async (data: Omit<Invoice, 'id'>, id?: number) => {
    try {
      let updated: Invoice;
      if (id) {
        updated = await billingService.update(id, data);
        const updatedList = invoices.map((inv) => (inv.id === id ? updated : inv));
        await refreshStats(updatedList);
      } else {
        updated = await billingService.create(data);
        await refreshStats([updated, ...invoices]);
      }
    } catch (err) {
      console.error('Erreur de sauvegarde facture', err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette facture ?')) return;
    await billingService.remove(id);
    await refreshStats(invoices.filter((inv) => inv.id !== id));
  };

  const handleMarkPaid = async (inv: Invoice) => {
    const updated = await billingService.update(inv.id, { status: 'paid' });
    const newList = invoices.map((i) => (i.id === inv.id ? updated : i));
    await refreshStats(newList);
  };

  const handleEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setIsModalOpen(true);
  };

  const handleExportCsv = () => {
    exportToCsv('factures.csv', filteredInvoices);
  };

  // Données du graphique
  const barChartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: 'Revenu (payé)',
        data: revenueData.values,
        backgroundColor: '#134074',
        borderRadius: 6,
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Facturation &amp; Finances</h1>

      {/* Gestion des erreurs / chargement */}
      {loading && (
        <div className="flex items-center space-x-2 text-accent">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          <span>Chargement des données…</span>
        </div>
      )}
      {error && (
        <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total factures"
              value={stats.invoicesCount}
              icon={faFileInvoiceDollar}
              iconBgColor="bg-blue-100"
              iconColor="text-accent"
              borderColor="accent"
            />
            <DashboardCard
              title="Revenu encaissé"
              value={formatCurrency(stats.totalRevenue)}
              icon={faMoneyBillWave}
              iconBgColor="bg-green-100"
              iconColor="text-success"
              borderColor="success"
            />
            <DashboardCard
              title="En attente"
              value={formatCurrency(stats.outstanding)}
              icon={faClock}
              iconBgColor="bg-yellow-100"
              iconColor="text-warning"
              borderColor="warning"
            />
            <DashboardCard
              title="En retard"
              value={formatCurrency(stats.overdue)}
              icon={faExclamationTriangle}
              iconBgColor="bg-red-100"
              iconColor="text-danger"
              borderColor="danger"
            />
          </div>

          {/* Graphique revenu par mois */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-[350px]">
            <h2 className="text-lg font-semibold mb-4">Revenu encaissé par mois</h2>
            {revenueData.labels.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>

          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Recherche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-md bg-white"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-md bg-white"
            >
              <option value="">Statut (tous)</option>
              <option value="paid">Payée</option>
              <option value="pending">En attente</option>
              <option value="overdue">En retard</option>
            </select>
            <button
              onClick={() => setStatusFilter('')}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Réinitialiser
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-accent text-white rounded-md flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} /> Nouvelle facture
            </button>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} /> Export CSV
            </button>
          </div>

          {/* Tableau des factures */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Liste des factures</h2>
              <span className="text-sm text-gray-500">{filteredInvoices.length} résultats</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">CLIENT</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">MONTANT</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">STATUT</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ÉMISE LE</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ÉCHÉANCE</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.length > 0 ? (
                    paginatedInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">#{inv.id}</td>
                        <td className="py-3 px-4">{inv.clientName}</td>
                        <td className="py-3 px-4">{formatCurrency(inv.amount)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs rounded-full px-3 py-1 ${
                              inv.status === 'paid'
                                ? 'bg-success/20 text-success'
                                : inv.status === 'pending'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-danger/20 text-danger'
                            }`}
                          >
                            {STATUS_LABELS[inv.status]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(inv.issueDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(inv.dueDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                          {inv.status !== 'paid' && (
                            <button className="text-success" title="Marquer payée" onClick={() => handleMarkPaid(inv)}>
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                          )}
                          <button className="text-accent" title="Éditer" onClick={() => handleEdit(inv)}>
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button className="text-danger" title="Supprimer" onClick={() => handleDelete(inv.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">
                        Aucune facture à afficher
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {pageCount > 1 && (
              <div className="p-4 flex justify-center space-x-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 rounded ${p === currentPage ? 'bg-accent text-white' : 'bg-gray-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal */}
          <InvoiceFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveInvoice}
            invoice={editingInvoice}
          />
        </>
      )}
    </div>
  );
};

export default Billing; 