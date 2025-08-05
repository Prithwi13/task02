import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Eye, Plus } from 'lucide-react';
import { JournalEntry } from '../types';

interface CalendarViewProps {
  entries: JournalEntry[];
  onDateSelect: (date: string) => void;
  onNewEntry: () => void;
  selectedDate?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  onDateSelect,
  onNewEntry,
  selectedDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEntriesForDate = (date: string) => {
    return entries.filter(entry => entry.date === date);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    const dateString = formatDate(date);
    return selectedDate === dateString;
  };

  const hasEntry = (date: Date) => {
    const dateString = formatDate(date);
    return getEntriesForDate(dateString).length > 0;
  };

  const getRecentEntries = () => {
    return entries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const renderCalendarDay = (date: Date | null, index: number) => {
    if (!date) {
      return <div key={index} className="p-2"></div>;
    }

    const dateString = formatDate(date);
    const dayEntries = getEntriesForDate(dateString);
    const isSelectedDay = isSelected(date);
    const isTodayDate = isToday(date);
    const hasEntryForDay = hasEntry(date);

    return (
      <button
        key={index}
        onClick={() => onDateSelect(dateString)}
        className={`p-2 h-12 w-full rounded-lg text-sm transition-all duration-200 relative ${
          isSelectedDay
            ? 'bg-blue-500 text-white'
            : isTodayDate
            ? 'bg-blue-100 text-blue-800 font-semibold'
            : hasEntryForDay
            ? 'bg-green-50 text-green-800 hover:bg-green-100'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span>{date.getDate()}</span>
          {hasEntryForDay && (
            <div className={`w-1 h-1 rounded-full mt-1 ${
              isSelectedDay ? 'bg-white' : 'bg-green-500'
            }`} />
          )}
        </div>
        {dayEntries.length > 0 && (
          <div className="absolute top-1 right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
            {dayEntries.length}
          </div>
        )}
      </button>
    );
  };

  const renderListView = () => {
    const recentEntries = getRecentEntries();

    if (recentEntries.length === 0) {
      return (
        <div className="text-center py-12">
          <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries yet</h3>
          <p className="text-gray-500 mb-4">Start your journaling journey today!</p>
          <button onClick={onNewEntry} className="btn-primary">
            <Plus size={20} className="mr-2" />
            Create First Entry
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {recentEntries.map(entry => (
          <div key={entry.id} className="journal-card cursor-pointer" onClick={() => onDateSelect(entry.date)}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                {new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Eye size={16} className="mr-1" />
                {entry.questions.length} responses
              </div>
            </div>
            <div className="space-y-2">
              {entry.questions.slice(0, 2).map(response => (
                <div key={response.id} className="border-l-4 border-blue-200 pl-3">
                  <p className="text-sm font-medium text-gray-700">{response.question}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {response.answer.substring(0, 100)}
                    {response.answer.length > 100 ? '...' : ''}
                  </p>
                </div>
              ))}
              {entry.questions.length > 2 && (
                <p className="text-xs text-gray-500">
                  +{entry.questions.length - 2} more responses
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Journal Calendar</h2>
        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
          <button onClick={onNewEntry} className="btn-primary">
            <Plus size={20} className="mr-2" />
            New Entry
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="journal-card">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-xl font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((date, index) => 
              renderCalendarDay(date, index)
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
              <span>Has entries</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      ) : (
        renderListView()
      )}
    </div>
  );
};

export default CalendarView;