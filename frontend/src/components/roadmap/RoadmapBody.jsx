import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    eachDayofInterval, format, getDate, getDaysInMonth,
    isToday, addMonths, subMonths, getMonth, getYear,
    isSameMonth, isBefore, startOfDay, endOfDay, isAfter
} from 'date-fns';
import {vi} from 'date-fns/locale';
import './RoadmapBody.css';
import TaskCard from './TaskCard';
import { ChevronLeftIcon, ChevronRightIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const DAY_CELL_WIDTH = 40; // Width of each day cell in pixels
const SIDEBAR_TASK_ITEM_HEIGHT = 40; // Height of each sidebar task item in pixels

const RoadmapBody = ({task = []. currentDisplayMonth, currentDisplauYear, onMonthYearChange}) => {
    const today = startOfDay(new Date());
    const [timelineScrollLeft, setTimelineScrollLeft] = useState(0);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [visibleTaskDetails, setVisibleTaskDetails] = useState({});
    const {stickyTasks, nonStickyTasks} = useState({});

    const timelineContainerRef = useRef(null);
    const taskRefs = useRef({});
    const taskSidebarRefs = useRef({});

    const  sortedTasks = [...tasks].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const firstDayOfMonth = new Date(currentDisplayYear, currentDisplayMonth, 1);
    const lastDayOfMonth = new Date(currentDisplayYear, currentDisplayMonth + 1, 0);
    const daysInCurrentMonth = eachDayofInterval({ start:
        firstDayOfMonth, end: lastDayOfMonth });
    
    useEffect(() => {
        if (isSameMonth(today, firstDayOfMonth) && timelineContainerRef.current) {
            const todayIndex = daysInCurrentMonth.findIndex(date => isToday(date));
            if (todayIndex !== -1) {
                const scrollTarget = todayIndex * DAY_CELL_WIDTH - (timelineContainerRef.current.offsetWidth / 3);
                timelineContainerRef.current.scrollLeft = Math.max(0, scrollTarget);
                setTimeliveScrollLeft(Math.max(0, scrollTarget));
            }
        } else if (timelineContainerRef.current) {
            timelineContainerRef.current.scrollLeft = 0;
            setTimelineScrollLeft(0);
        }
    }, [currentDisplayMonth, currentDisplayYear, daysInCurrentMonth, today]);

    const handleScroll = (event) => {
        setTimelineScrollLeft(event.target.scrollLeft);
    }

    const handlePrevMonth = () => {
        const newDate = subMonths
    }

}