import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Share2,
  Download,
  BookmarkCheck,
  Check,
  Sparkles,
  Printer,
  X
} from 'lucide-react';
import { DayItinerary, ActivityItem, SearchQuery } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface ItinerarySectionProps {
  itinerary: DayItinerary[];
  query: SearchQuery;
  onUpdateItinerary: (updated: DayItinerary[]) => void;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  itinerary,
  query,
  onUpdateItinerary,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Add / Edit Activity Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<{
    dayIdx: number;
    activity?: ActivityItem;
  } | null>(null);

  // Form fields
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formTag, setFormTag] = useState<ActivityItem['tag']>('Sightseeing');
  const [formDescription, setFormDescription] = useState('');
  const [formCost, setFormCost] = useState('0');
  const [formDuration, setFormDuration] = useState('1 hr 30m');

  const currentDay = itinerary[selectedDayIndex] || itinerary[0];

  const handleOpenAddModal = (dayIdx: number) => {
    setEditingActivity({ dayIdx });
    setFormTime('11:00 AM');
    setFormTitle('');
    setFormLocation('Goa, India');
    setFormTag('Sightseeing');
    setFormDescription('');
    setFormCost('0');
    setFormDuration('1 hr 30m');
    setModalOpen(true);
  };

  const handleOpenEditModal = (dayIdx: number, act: ActivityItem) => {
    setEditingActivity({ dayIdx, activity: act });
    setFormTime(act.time);
    setFormTitle(act.title);
    setFormLocation(act.location);
    setFormTag(act.tag);
    setFormDescription(act.description);
    setFormCost(act.cost.toString());
    setFormDuration(act.duration);
    setModalOpen(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    const { dayIdx, activity } = editingActivity;
    const newAct: ActivityItem = {
      id: activity ? activity.id : `custom-${Date.now()}`,
      time: formTime,
      title: formTitle.trim() || 'New Activity',
      location: formLocation.trim() || 'Goa',
      tag: formTag,
      description: formDescription.trim(),
      cost: parseFloat(formCost) || 0,
      duration: formDuration.trim() || '1 hr'
    };

    const newItinerary = [...itinerary];
    const targetDay = { ...newItinerary[dayIdx] };

    if (activity) {
      // update existing
      targetDay.activities = targetDay.activities.map((a) => (a.id === activity.id ? newAct : a));
    } else {
      // add new
      targetDay.activities = [...targetDay.activities, newAct];
    }

    newItinerary[dayIdx] = targetDay;
    onUpdateItinerary(newItinerary);
    setModalOpen(false);
  };

  const handleRemoveActivity = (dayIdx: number, activityId: string) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIdx] = {
      ...newItinerary[dayIdx],
      activities: newItinerary[dayIdx].activities.filter((a) => a.id !== activityId),
    };
    onUpdateItinerary(newItinerary);
  };

  const handleMoveActivity = (dayIdx: number, actIdx: number, direction: 'up' | 'down') => {
    const newItinerary = [...itinerary];
    const activities = [...newItinerary[dayIdx].activities];
    const targetIdx = direction === 'up' ? actIdx - 1 : actIdx + 1;

    if (targetIdx < 0 || targetIdx >= activities.length) return;

    const temp = activities[actIdx];
    activities[actIdx] = activities[targetIdx];
    activities[targetIdx] = temp;

    newItinerary[dayIdx] = {
      ...newItinerary[dayIdx],
      activities,
    };
    onUpdateItinerary(newItinerary);
  };

  const handleSaveItinerary = () => {
    try {
      localStorage.setItem('tripmate_itinerary', JSON.stringify(itinerary));
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    } catch {
      setSavedFeedback(true);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `TripMate: ${query.from} to ${query.to} Itinerary`,
          text: `Check out our complete day-by-day travel plan for ${query.to}!`,
          url: window.location.href,
        })
        .catch(() => setShareModalOpen(true));
    } else {
      setShareModalOpen(true);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const tagColors: Record<ActivityItem['tag'], string> = {
    Travel: 'bg-blue-50 text-blue-700 border-blue-200',
    Hotel: 'bg-purple-50 text-purple-700 border-purple-200',
    Sightseeing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Food: 'bg-amber-50 text-amber-700 border-amber-200',
    Adventure: 'bg-rose-50 text-rose-700 border-rose-200',
    Leisure: 'bg-teal-50 text-teal-700 border-teal-200',
    Historical: 'bg-amber-50 text-amber-800 border-amber-300',
    Beach: 'bg-cyan-50 text-cyan-800 border-cyan-300',
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Printable Header - Only appears during print */}
        <div className="hidden print-only mb-6">
          <h1 className="text-2xl font-bold">TripMate Complete Journey Itinerary</h1>
          <p className="text-sm text-gray-600">
            Route: {query.from} → {query.to} | Dates: {query.departureDate} to {query.returnDate} | Travelers: {query.travelers}
          </p>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 no-print">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <span>Step 3 · Complete Trip Itinerary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Day-by-Day Experience Schedule
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Optimized chronological schedule. Customize timings, add attractions, or download your PDF plan.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSaveItinerary}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                savedFeedback
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {savedFeedback ? <Check className="w-3.5 h-3.5" /> : <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />}
              <span>{savedFeedback ? 'Saved Locally!' : 'Save Itinerary'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Share Plan</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Days Switcher Segmented Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-print">
          {itinerary.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex flex-col text-left px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono">Day {day.dayNumber}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      isSelected ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {day.date}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium truncate max-w-[130px] mt-0.5 ${
                    isSelected ? 'text-teal-100' : 'text-slate-500'
                  }`}
                >
                  {day.title.split('—')[1] || day.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day View */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
          {/* Day Title and Add Activity Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-3">
            <div>
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                {currentDay.date} · Day {currentDay.dayNumber} of {itinerary.length}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {currentDay.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{currentDay.subtitle}</p>
            </div>

            <button
              onClick={() => handleOpenAddModal(selectedDayIndex)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors self-start sm:self-auto no-print"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
          </div>

          {/* Activities Timeline */}
          <div className="space-y-4 relative">
            {/* Visual vertical track line */}
            <div className="absolute left-4 sm:left-6 top-3 bottom-3 w-0.5 bg-slate-100 -z-0 hidden sm:block" />

            {currentDay.activities.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No activities planned for this day yet. Click "Add Activity" to plan your day.
              </div>
            ) : (
              currentDay.activities.map((act, actIdx) => (
                <div
                  key={act.id}
                  className="relative z-10 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Time Pill */}
                    <div className="w-20 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-center shrink-0 shadow-2xs">
                      <div className="text-xs font-bold font-mono text-slate-800">{act.time}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{act.duration}</div>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            tagColors[act.tag] || 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {act.tag}
                        </span>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                          {act.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{act.location}</span>
                        {act.cost > 0 && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="font-mono font-semibold text-slate-700">
                              Est. {formatCurrency(act.cost)}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                    </div>
                  </div>

                  {/* Actions: Reorder, Edit, Remove */}
                  <div className="flex items-center gap-1.5 self-end md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-slate-200/60 no-print">
                    <button
                      onClick={() => handleMoveActivity(selectedDayIndex, actIdx, 'up')}
                      disabled={actIdx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white transition-colors"
                      title="Move Earlier"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleMoveActivity(selectedDayIndex, actIdx, 'down')}
                      disabled={actIdx === currentDay.activities.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white transition-colors"
                      title="Move Later"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(selectedDayIndex, act)}
                      className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-white transition-colors"
                      title="Edit Activity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleRemoveActivity(selectedDayIndex, act.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                      title="Remove Activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add / Edit Activity Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {editingActivity?.activity ? 'Edit Scheduled Activity' : `Add Activity to Day ${currentDay.dayNumber}`}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveActivity} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                    <input
                      type="text"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      placeholder="e.g. 10:30 AM"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      placeholder="e.g. 2 hours"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Activity Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Visit Chapora Fort Sunset"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                    <select
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value as ActivityItem['tag'])}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Food">Food & Dining</option>
                      <option value="Beach">Beach</option>
                      <option value="Historical">Historical</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Leisure">Leisure</option>
                      <option value="Travel">Travel</option>
                      <option value="Hotel">Hotel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Est. Cost (₹)</label>
                    <input
                      type="number"
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Location / Landmark</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Vagator, North Goa"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Notes / Description</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Add details, tickets needed, travel tips..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                  >
                    Save Activity
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {shareModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Share Trip Itinerary</h3>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-4">
                Share this complete itinerary with your travel companions to collaborate on the schedule.
              </p>

              <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="w-full text-xs bg-transparent text-slate-700 font-mono focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 rounded-lg shrink-0"
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="text-right">
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
