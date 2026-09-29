import React, { useState } from 'react';
import {
  Calculator,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  PieChart,
  Users,
  Wallet,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SearchQuery, ChecklistItem } from '../types/travel';
import { INITIAL_CHECKLIST } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

interface BudgetAndChecklistProps {
  query: SearchQuery;
}

export const BudgetAndChecklist: React.FC<BudgetAndChecklistProps> = ({ query }) => {
  const [budgetTier, setBudgetTier] = useState<'budget' | 'comfort' | 'luxury'>('comfort');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newChecklistCategory, setNewChecklistCategory] = useState<ChecklistItem['category']>('Documents');

  // Calculate nights
  const dep = new Date(query.departureDate || '2026-10-15');
  const ret = new Date(query.returnDate || '2026-10-20');
  const diffTime = Math.abs(ret.getTime() - dep.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 5;
  const days = nights + 1;
  const travelers = query.travelers || 2;

  // Base tier multipliers
  const tierSettings = {
    budget: {
      transportPerPerson: 2200,
      hotelPerNight: 1650,
      foodPerPersonPerDay: 700,
      localTransitPerDay: 400,
      activitiesPerPerson: 1000,
      bufferPerPerson: 1500,
    },
    comfort: {
      transportPerPerson: 4850,
      hotelPerNight: 4200,
      foodPerPersonPerDay: 1300,
      localTransitPerDay: 900,
      activitiesPerPerson: 2200,
      bufferPerPerson: 2500,
    },
    luxury: {
      transportPerPerson: 7500,
      hotelPerNight: 7800,
      foodPerPersonPerDay: 2600,
      localTransitPerDay: 2200,
      activitiesPerPerson: 4500,
      bufferPerPerson: 5000,
    },
  }[budgetTier];

  const totalTransport = tierSettings.transportPerPerson * travelers * (query.tripType === 'roundTrip' ? 2 : 1);
  const totalHotel = tierSettings.hotelPerNight * nights;
  const totalFood = tierSettings.foodPerPersonPerDay * days * travelers;
  const totalTransit = tierSettings.localTransitPerDay * days;
  const totalActivities = tierSettings.activitiesPerPerson * travelers;
  const totalBuffer = tierSettings.bufferPerPerson * travelers;

  const grandTotal = totalTransport + totalHotel + totalFood + totalTransit + totalActivities + totalBuffer;
  const perPersonTotal = Math.round(grandTotal / travelers);

  const budgetItems = [
    { label: 'Round-trip Transit', amount: totalTransport, color: 'bg-blue-500', pct: Math.round((totalTransport / grandTotal) * 100) },
    { label: 'Hotel & Resort', amount: totalHotel, color: 'bg-teal-500', pct: Math.round((totalHotel / grandTotal) * 100) },
    { label: 'Food & Dining', amount: totalFood, color: 'bg-amber-500', pct: Math.round((totalFood / grandTotal) * 100) },
    { label: 'Local Transit / Scooter', amount: totalTransit, color: 'bg-purple-500', pct: Math.round((totalTransit / grandTotal) * 100) },
    { label: 'Sightseeing & Water Sports', amount: totalActivities, color: 'bg-emerald-500', pct: Math.round((totalActivities / grandTotal) * 100) },
    { label: 'Buffer & Shopping', amount: totalBuffer, color: 'bg-rose-500', pct: Math.round((totalBuffer / grandTotal) * 100) },
  ];

  // Checklist logic
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      category: newChecklistCategory,
      item: newChecklistText.trim(),
      completed: false,
    };

    setChecklist((prev) => [...prev, newItem]);
    setNewChecklistText('');
  };

  const handleDeleteChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const completedCount = checklist.filter((c) => c.completed).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100) || 0;

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* BUDGET CALCULATOR */}
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
                <span>Step 7 · Trip Financial Planner</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Estimated Trip Budget Breakdown
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tailored estimate for {travelers} traveler{travelers > 1 ? 's' : ''} across {days} days ({nights} nights) in {query.to.split(',')[0]}.
              </p>
            </div>

            {/* Tier Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium self-start md:self-auto">
              {(
                [
                  { id: 'budget', label: 'Backpacker / Budget' },
                  { id: 'comfort', label: 'Comfort / Mid-range' },
                  { id: 'luxury', label: 'Luxury Premium' },
                ] as const
              ).map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setBudgetTier(tier.id)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    budgetTier === tier.id
                      ? 'bg-white text-teal-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* Top Total Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Estimated All-Inclusive Cost
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-teal-800 font-mono tracking-tight mt-1">
                  {formatCurrency(grandTotal)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Includes taxes, return transit, hotel, food, and daily activities.
                </div>
              </div>

              <div className="sm:text-right bg-teal-50 px-4 py-3 rounded-2xl border border-teal-100">
                <span className="text-xs font-bold text-teal-900 block">
                  Per Person Share ({travelers} Travelers)
                </span>
                <span className="text-2xl font-extrabold text-teal-700 font-mono">
                  {formatCurrency(perPersonTotal)}
                </span>
                <span className="text-[11px] text-teal-600 block mt-0.5">
                  ~ {formatCurrency(Math.round(perPersonTotal / days))} / person / day
                </span>
              </div>
            </div>

            {/* Visual Distribution Progress Bar */}
            <div className="mt-6">
              <div className="h-3 rounded-full overflow-hidden flex bg-slate-100 mb-4">
                {budgetItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${item.color} transition-all`}
                    style={{ width: `${item.pct}%` }}
                    title={`${item.label}: ${item.pct}%`}
                  />
                ))}
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {budgetItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-slate-900">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{item.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TRAVEL CHECKLIST */}
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
                <span>Trip Readiness · Travel Checklist</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Essential Packing & Document Checklist
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Never leave important travel IDs, beach supplies, or chargers behind.
              </p>
            </div>

            {/* Packing Progress */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800">
                  {completedCount} of {checklist.length} packed
                </span>
                <span className="text-[11px] text-teal-600 font-semibold block">
                  {progressPct}% ready
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-teal-700 font-mono">
                {progressPct}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            {/* Add Custom Item Form */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 mb-6 pb-6 border-b border-slate-100 flex-wrap sm:flex-nowrap">
              <select
                value={newChecklistCategory}
                onChange={(e) => setNewChecklistCategory(e.target.value as ChecklistItem['category'])}
                className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Documents">Documents</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Health & Toiletries">Health & Toiletries</option>
                <option value="Cash & Cards">Cash & Cards</option>
              </select>

              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Add custom packing item (e.g. Scuba snorkel mask, DSLR camera)..."
                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </form>

            {/* Checklist Items Grouped */}
            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    item.completed
                      ? 'bg-teal-50/50 border-teal-200 text-slate-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-teal-600 focus:outline-none"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 fill-teal-600 text-white" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div>
                      <span
                        className={`text-xs font-semibold ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.item}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChecklistItem(item.id);
                    }}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
