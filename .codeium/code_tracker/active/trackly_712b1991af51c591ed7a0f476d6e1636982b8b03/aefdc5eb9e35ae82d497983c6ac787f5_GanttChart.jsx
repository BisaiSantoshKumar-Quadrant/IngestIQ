š„import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Minus } from 'lucide-react';
import Button from '../../common-components/Button';
 
const GanttChart = ({ tasks }) => {
  const [viewMode, setViewMode] = useState('month'); // 'week', 'month', 'quarter'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const scrollContainerRef = useRef(null);
 
  // Generate dates for the timeline based on view mode
  const getDates = () => {
    const dates = [];
    let startDate = new Date(currentDate);
   
    if (viewMode === 'week') {
      // Start at the beginning of the week (Sunday)
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day);
     
      // Generate 14 days (2 weeks)
      for (let i = 0; i < 14; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        dates.push(date);
      }
    } else if (viewMode === 'month') {
      // Start at the beginning of the month
      startDate.setDate(1);
     
      // Go back to include part of previous month
      const prevMonthDays = 15;
      const prevStart = new Date(startDate);
      prevStart.setDate(prevStart.getDate() - prevMonthDays);
     
      // Generate around 60 days (2 months)
      for (let i = 0; i < 60; i++) {
        const date = new Date(prevStart);
        date.setDate(date.getDate() + i);
        dates.push(date);
      }
    } else if (viewMode === 'quarter') {
      // Start at the beginning of the quarter
      const quarterStartMonth = Math.floor(startDate.getMonth() / 3) * 3;
      startDate = new Date(startDate.getFullYear(), quarterStartMonth, 1);
     
      // Generate dates for 3 months (a quarter)
      for (let i = 0; i < 90; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        dates.push(date);
      }
    }
   
    return dates;
  };
 
  // Format date for display
  const formatDate = (date, format = 'day') => {
    if (format === 'day') {
      return date.getDate();
    } else if (format === 'month') {
      return date.toLocaleString('default', { month: 'short' });
    } else if (format === 'full') {
      return date.toLocaleDateString();
    } else if (format === 'weekday') {
      return date.toLocaleString('default', { weekday: 'short' });
    }
  };
 
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
 
  // Check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };
 
  // Check if date is first of month
  const isFirstOfMonth = (date) => {
    return date.getDate() === 1;
  };
 
  // Move timeline forward or backward
  const navigateTimeline = (direction) => {
    const newDate = new Date(currentDate);
   
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'quarter') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3));
    }
   
    setCurrentDate(newDate);
  };
 
  // Helper function to safely format date to YYYY-MM-DD string
  const formatDateToYYYYMMDD = (dateInput) => {
    try {
      const date = new Date(dateInput);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error("Invalid date:", dateInput);
      return null;
    }
  };
 
  // Calculate position and width of task bars
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
   
    const dates = getDates();
    const startDateStr = formatDateToYYYYMMDD(dates[0]);
    const endDateStr = formatDateToYYYYMMDD(dates[dates.length - 1]);
   
    if (!startDateStr || !endDateStr) return;
   
    // Filter tasks that fall within the visible time range
    const tasksInRange = tasks.filter(task => {
      if (!task.startDate || !task.dueDate) return false;
     
      const taskStart = formatDateToYYYYMMDD(task.startDate);
      const taskEnd = formatDateToYYYYMMDD(task.dueDate);
     
      if (!taskStart || !taskEnd) return false;
     
      return (taskStart <= endDateStr && taskEnd >= startDateStr);
    });
   
    // Calculate visual properties for each task
    const processedTasks = tasksInRange.map(task => {
      try {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.dueDate);
       
        // Validate dates
        if (isNaN(taskStart.getTime()) || isNaN(taskEnd.getTime())) {
          console.warn("Invalid date in task:", task.id || task.name);
          return null; // This task will be filtered out
        }
      // Safely create Date objects
      const safeTaskStart = new Date(taskStart);
      const safeTaskEnd = new Date(taskEnd);
     
      // Validate dates
      const isValidTaskStart = !isNaN(safeTaskStart.getTime());
      const isValidTaskEnd = !isNaN(safeTaskEnd.getTime());
     
      // Find index of dates in our visible dates array
      const startIdx = isValidTaskStart ? dates.findIndex(date =>
        date.getDate() === safeTaskStart.getDate() &&
        date.getMonth() === safeTaskStart.getMonth() &&
        date.getFullYear() === safeTaskStart.getFullYear()
      ) : -1;
     
      const endIdx = isValidTaskEnd ? dates.findIndex(date =>
        date.getDate() === safeTaskEnd.getDate() &&
        date.getMonth() === safeTaskEnd.getMonth() &&
        date.getFullYear() === safeTaskEnd.getFullYear()
      ) : -1;
     
      // If dates not found, approximate position
      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1];
     
      let left = 0;
      let width = 0;
     
      if (startIdx >= 0 && endIdx >= 0) {
        left = startIdx;
        width = Math.max(1, endIdx - startIdx + 1); // Ensure minimum width of 1
      } else {
        try {
          // Calculate days from start
          const daysDiff = (safeTaskStart - firstDate) / (1000 * 60 * 60 * 24);
          const totalDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
          const duration = (safeTaskEnd - safeTaskStart) / (1000 * 60 * 60 * 24) + 1;
         
          // Handle potential NaN values
          if (isNaN(daysDiff) || isNaN(duration)) {
            left = 0;
            width = 1; // Default to 1-day width if calculations fail
          } else {
            left = Math.max(0, daysDiff);
            width = Math.max(1, Math.min(duration, totalDays - left)); // Ensure minimum width of 1
          }
        } catch (e) {
          console.error("Error calculating task position:", e);
          left = 0;
          width = 1;
        }
      }
     
      // Get status-based color
      let color = 'bg-blue-500';
      if (task.status === 'completed') {
        color = 'bg-green-500';
      } else if (task.status === 'overdue' || (new Date() > taskEnd && task.status !== 'completed')) {
        color = 'bg-red-500';
      } else if (task.status === 'in-progress') {
        color = 'bg-yellow-500';
      }
     
      return {
        ...task,
        left,
        width,
        color
      };
    } catch (e) {
      console.error("Error processing task:", task.id || task.name, e);
      return null;
    }
    }).filter(Boolean); // Remove null tasks
   
    setVisibleTasks(processedTasks);
   
    // Scroll to today if in view
    if (scrollContainerRef.current) {
      setTimeout(() => {
        const today = new Date();
        const todayIndex = dates.findIndex(date =>
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
       
        if (todayIndex >= 0) {
          const cellWidth = 40 * zoomLevel;
          const scrollPosition = todayIndex * cellWidth - scrollContainerRef.current.clientWidth / 2;
          scrollContainerRef.current.scrollLeft = scrollPosition;
        }
      }, 100);
    }
  }, [tasks, currentDate, viewMode, zoomLevel]);
 
  // Zoom in and out of the chart
  const handleZoom = (direction) => {
    if (direction === 'in' && zoomLevel < 2) {
      setZoomLevel(zoomLevel + 0.25);
    } else if (direction === 'out' && zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.25);
    }
  };
 
  const dates = getDates();
  const cellWidth = 40 * zoomLevel; // Base cell width multiplied by zoom level
 
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Task Timeline</h2>
       
        <div className="flex items-center space-x-4">
          {/* View mode selector */}
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'quarter' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              onClick={() => setViewMode('quarter')}
            >
              Quarter
            </button>
          </div>
         
          {/* Navigation and zoom controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="p-1 h-8 w-8"
              onClick={() => navigateTimeline('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
           
            <Button
              variant="outline"
              className="p-1 h-8 w-8 flex items-center justify-center"
              onClick={() => setCurrentDate(new Date())}
            >
              <Calendar className="w-4 h-4" />
            </Button>
           
            <Button
              variant="outline"
              className="p-1 h-8 w-8"
              onClick={() => navigateTimeline('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
           
            <Button
              variant="outline"
              className="p-1 h-8 w-8"
              onClick={() => handleZoom('out')}
            >
              <Minus className="w-4 h-4" />
            </Button>
           
            <Button
              variant="outline"
              className="p-1 h-8 w-8"
              onClick={() => handleZoom('in')}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
     
      {/* Gantt chart container */}
      <div className="overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-3"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
        >
          {/* Timeline header */}
          <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="min-w-[200px] p-2 bg-gray-50 border-r border-gray-200 font-medium">
              Task
            </div>
            <div className="flex">
              {dates.map((date, index) => {
                const isMonth = isFirstOfMonth(date);
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center border-r border-gray-200
                      ${isWeekend(date) ? 'bg-gray-50' : ''}
                      ${isToday(date) ? 'bg-blue-50' : ''}`}
                    style={{
                      width: `${cellWidth}px`,
                      minWidth: `${cellWidth}px`
                    }}
                  >
                    {isMonth && (
                      <div className="text-xs text-gray-500 font-medium w-full text-center border-b border-gray-200">
                        {formatDate(date, 'month')}
                      </div>
                    )}
                    <div className="flex flex-col items-center py-1">
                      <span className={`text-xs ${isToday(date) ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                        {formatDate(date, 'day')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(date, 'weekday')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
         
          {/* Task rows */}
          <div>
            {visibleTasks.length > 0 ? (
              visibleTasks.map((task, taskIndex) => (
                <div key={task.id || taskIndex} className="flex border-b border-gray-200 hover:bg-gray-50">
                  {/* Task name */}
                  <div className="min-w-[200px] p-2 border-r border-gray-200 flex items-center overflow-hidden">
                    <div className="truncate">
                      <div className="font-medium text-gray-800 truncate">{task.name}</div>
                      {task.assignedTo && (
                        <div className="text-xs text-gray-500 truncate">Assigned to: {task.assignedTo}</div>
                      )}
                    </div>
                  </div>
                 
                  {/* Timeline */}
                  <div className="flex relative" style={{ height: '60px' }}>
                    {dates.map((date, dateIndex) => (
                      <div
                        key={dateIndex}
                        className={`border-r border-gray-200
                          ${isWeekend(date) ? 'bg-gray-50' : ''}
                          ${isToday(date) ? 'bg-blue-50' : ''}`}
                        style={{
                          width: `${cellWidth}px`,
                          minWidth: `${cellWidth}px`
                        }}
                      />
                    ))}
                   
                    {/* Task bar */}
                    <div
                      className={`absolute top-1/2 transform -translate-y-1/2 h-6 rounded-md ${task.color} shadow-sm flex items-center px-2`}
                      style={{
                        left: `${task.left * cellWidth}px`,
                        width: `${task.width * cellWidth}px`,
                        minWidth: '20px'
                      }}
                    >
                      {task.width * cellWidth > 80 && (
                        <span className="text-white text-xs truncate w-full">
                          {task.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No tasks scheduled in this time period
              </div>
            )}
          </div>
        </div>
      </div>
     
      {/* Legend */}
      <div className="mt-4 flex items-center space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1" />
          <span>Not Started</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-sm mr-1" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-sm mr-1" />
          <span>Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-sm mr-1" />
          <span>Overdue</span>
        </div>
      </div>
    </div>
  );
};
 
export default GanttChart;š„"(712b1991af51c591ed7a0f476d6e1636982b8b032Tfile:///c:/Users/BisaiSantoshKumar%28Qu/Documents/Trackly/trackly/src/GanttChart.jsx:Afile:///c:/Users/BisaiSantoshKumar%28Qu/Documents/Trackly/trackly