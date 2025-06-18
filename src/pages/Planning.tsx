import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useShifts } from '../context/ShiftContext';
import { useEmployees } from '../context/EmployeeContext';
import ShiftForm from '../components/ShiftForm';
import type { Shift, NewShift } from '../types/shift';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Planning: React.FC = () => {
  const { shifts, add, update, remove } = useShifts();
  const { employees } = useEmployees();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{
    mode: 'create' | 'edit' | null;
    shift?: Shift;
  }>({ mode: null });

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit = (shift: Shift) => setModal({ mode: 'edit', shift });

  const closeModal = () => setModal({ mode: null });

  const handleSubmit = async (data: NewShift | Partial<Shift>) => {
    if (modal.mode === 'create') await add(data as NewShift);
    else if (modal.mode === 'edit' && modal.shift) await update(modal.shift.id, data);
    closeModal();
  };

  const filtered = shifts.filter((s) => {
    const emp = employees.find((e) => e.id === s.employeeId);
    const target = `${emp?.name ?? ''} ${s.location}`.toLowerCase();
    return target.includes(search.toLowerCase());
  });

  const statusBadge = (status: Shift['status']) => {
    const map: Record<Shift['status'], string> = {
      planned: 'bg-accent/20 text-accent',
      completed: 'bg-success/20 text-success',
      cancelled: 'bg-danger/20 text-danger',
    };
    return <span className={`${map[status]} text-xs rounded-full px-3 py-1 capitalize`}>{status}</span>;
  };

  const statusColorMap: Record<Shift['status'], string> = {
    planned: '#134074',
    completed: '#4CAF50',
    cancelled: '#F44336',
  };

  const getCalendarEvents = () =>
    shifts.map((shift) => {
      const emp = employees.find((e) => e.id === shift.employeeId);
      return {
        id: String(shift.id),
        title: emp ? `${emp.name} (${shift.location})` : shift.location,
        start: `${shift.date}T${shift.startTime}:00`,
        end: `${shift.date}T${shift.endTime}:00`,
        color: statusColorMap[shift.status],
      };
    });

  const handleEventClick = (arg: any) => {
    const shiftId = Number(arg.event.id);
    const sh = shifts.find((s) => s.id === shiftId);
    if (sh) openEdit(sh);
  };

  const calendarRef = useRef<any>(null);
  const [jumpMonth, setJumpMonth] = useState<string>('');

  const handleJumpMonth = () => {
    if (!jumpMonth) return;
    const [yearStr, monthStr] = jumpMonth.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (!year || !month) return;
    const targetDate = new Date(year, month - 1, 1);
    calendarRef.current?.getApi()?.gotoDate(targetDate);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Plannings</h1>
        <div className="flex items-center gap-2">
          {/* Sélecteur de mois pour navigation rapide */}
          <input
            type="month"
            value={jumpMonth}
            onChange={(e) => setJumpMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            onClick={handleJumpMonth}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm transition-colors duration-200"
          >
            Aller
          </button>

          <button
            onClick={openCreate}
            className="bg-yale-blue hover:bg-berkeley-blue text-white py-2 px-4 rounded-lg flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nouveau shift
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par employé ou lieu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-light text-sm text-gray-500">
            <tr>
              <th className="text-left py-3 px-6 font-medium">Employé</th>
              <th className="text-left py-3 px-6 font-medium">Date</th>
              <th className="text-left py-3 px-6 font-medium">Heures</th>
              <th className="text-left py-3 px-6 font-medium">Lieu</th>
              <th className="text-left py-3 px-6 font-medium">Statut</th>
              <th className="text-left py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((shift) => {
              const emp = employees.find((e) => e.id === shift.employeeId);
              return (
                <tr key={shift.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                  <td className="py-3 px-6">{emp?.name ?? '—'}</td>
                  <td className="py-3 px-6">{shift.date}</td>
                  <td className="py-3 px-6">
                    {shift.startTime} &rarr; {shift.endTime}
                  </td>
                  <td className="py-3 px-6">{shift.location}</td>
                  <td className="py-3 px-6">{statusBadge(shift.status)}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => openEdit(shift)}
                      className="text-yale-blue hover:text-berkeley-blue mr-3"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Supprimer ce shift ?')) remove(shift.id);
                      }}
                      className="text-danger hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  Aucun shift trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Calendar */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={getCalendarEvents()}
          locale="fr"
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          eventClick={handleEventClick}
        />
      </div>

      {modal.mode && (
        <ShiftForm
          isEdit={modal.mode === 'edit'}
          shift={modal.shift}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Planning; 