import React, { useState, useLayoutEffect } from 'react'; // Bỏ useEffect nếu hook quản lý fetch
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale, Legend } from 'chart.js';
import './latetaskschart.css';

// Import hook và utility
import useLateTasksData from '../../../hooks/useLateTasksData'; // Điều chỉnh đường dẫn
import { generateLateTasksChartConfig } from '../../../utils/generateLateTasksChartConfig'; // Điều chỉnh đường dẫn

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale, Legend);

const LateTasksChart = ({ groupId }) => { // Đổi tên component cho nhất quán (nếu file là LateTasksChart.js)
    const { sprintData, members, error, loading } = useLateTasksData(groupId);
    const [chartKey, setChartKey] = useState(0); // Giữ lại chartKey để re-render khi resize

    // useLayoutEffect cho resize vẫn giữ ở component vì nó liên quan đến việc re-render UI
    useLayoutEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setChartKey(prevKey => prevKey + 1);
            }, 150);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);


    // Gọi utility để lấy config biểu đồ
    // Cần kiểm tra members và sprintData trước khi gọi để tránh lỗi nếu chúng rỗng/undefined
    const { data, options } = (members && members.length > 0 && Object.keys(sprintData).length > 0)
        ? generateLateTasksChartConfig(members, sprintData)
        : generateLateTasksChartConfig([], {}); // Config mặc định nếu không có data

    if (loading) {
        return <div className="barchart-container loading">Loading late task data...</div>;
    }

    if (error) {
        return <div className="barchart-container error">{error}</div>;
    }

    if (!members || members.length === 0) {
        // Có thể thêm điều kiện kiểm tra groupId để hiển thị thông báo phù hợp hơn
        const message = groupId ? "No late task data available for members in this group." : "Please select a group.";
        return <div className="barchart-container no-data">{message}</div>;
    }

    // Kiểm tra xem có dữ liệu để vẽ biểu đồ không, sau khi loading và error đã qua
    const hasDataToDisplay = data.labels && data.labels.length > 0 && data.datasets.some(ds => ds.data && ds.data.length > 0 && ds.data.some(d => d > 0));

    if (!hasDataToDisplay && groupId) { // Nếu có groupId nhưng không có task trễ nào
        return <div className="barchart-container no-data">No late tasks recorded for members in this group.</div>;
    }


    return (
        <div className="barchart-container">
            <Bar key={chartKey} data={data} options={options} />
        </div>
    );
};

export default LateTasksChart; // Đổi tên export cho nhất quán