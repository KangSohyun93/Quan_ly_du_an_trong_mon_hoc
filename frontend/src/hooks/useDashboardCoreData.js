// // // // src/hooks/useDashboardCoreData.js
// // // import { useState, useEffect, useCallback } from 'react';
// // // import axios from 'axios';

// // // // Giả sử bạn có fixedUserAndClassContext ở đâu đó hoặc truyền vào
// // // const FIXED_USER_AND_CLASS_CONTEXT = { userId: 1, classId: 100001 };

// // // const useDashboardCoreData = () => {
// // //     const [selectedGroup, setSelectedGroup] = useState(null);
// // //     const [groups, setGroups] = useState([]);
// // //     const [loadingGroups, setLoadingGroups] = useState(true);
// // //     const [currentUserRole, setCurrentUserRole] = useState(null);

// // //     const [sprints, setSprints] = useState([]);
// // //     const [selectedSprintId, setSelectedSprintId] = useState('all');
// // //     const [loadingSprints, setLoadingSprints] = useState(false);

// // //     const [statData, setStatData] = useState({
// // //         totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
// // //         tasksLate: 0, totalCommits: 0, totalLOC: 0,
// // //     });
// // //     const [loadingStats, setLoadingStats] = useState(false);

// // //     const [isMasterRefreshing, setIsMasterRefreshing] = useState(false);
// // //     const [refreshNonce, setRefreshNonce] = useState(0);

// // //     // Fetch groups and user role
// // //     useEffect(() => {
// // //         const fetchInitialData = async () => {
// // //             setLoadingGroups(true);
// // //             setCurrentUserRole(null);
// // //             try {
// // //                 const response = await axios.get(`http://localhost:5000/api/groups?userId=${FIXED_USER_AND_CLASS_CONTEXT.userId}&classId=${FIXED_USER_AND_CLASS_CONTEXT.classId}`);
// // //                 const fetchedGroups = response.data.groups || [];
// // //                 setCurrentUserRole(response.data.role);
// // //                 setGroups(fetchedGroups);

// // //                 if (fetchedGroups.length > 0) {
// // //                     // Cố gắng tìm group_id === 1 làm mặc định, nếu không thì lấy group đầu tiên
// // //                     const defaultGroup = fetchedGroups.find(g => g.group_id === 1) || fetchedGroups[0];
// // //                     setSelectedGroup(defaultGroup);
// // //                 } else {
// // //                     setSelectedGroup(null);
// // //                 }
// // //             } catch (error) {
// // //                 console.error('Error fetching groups:', error);
// // //                 setGroups([]);
// // //                 setSelectedGroup(null);
// // //                 setCurrentUserRole(null);
// // //             }
// // //             setLoadingGroups(false);
// // //         };
// // //         fetchInitialData();
// // //     }, []); // Chỉ chạy một lần khi mount

// // //     const currentGroupId = selectedGroup?.group_id;
// // //     const currentProjectId = selectedGroup?.project_id;

// // //     // Fetch sprints when selectedGroup (currentGroupId) changes
// // //     useEffect(() => {
// // //         if (currentGroupId) {
// // //             setLoadingSprints(true);
// // //             axios.get(`http://localhost:5000/api/groups/${currentGroupId}/sprints`)
// // //                 .then(response => {
// // //                     const fetchedSprints = response.data || [];
// // //                     setSprints(fetchedSprints);
// // //                     if (fetchedSprints.length > 0) {
// // //                         const now = new Date();
// // //                         const currentOrUpcomingSprint =
// // //                             fetchedSprints.find(s => new Date(s.endDate) >= now && new Date(s.startDate) <= now) ||
// // //                             fetchedSprints.find(s => new Date(s.startDate) > now) ||
// // //                             (fetchedSprints.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)))[0];
// // //                         setSelectedSprintId(currentOrUpcomingSprint ? currentOrUpcomingSprint.id : 'all');
// // //                     } else {
// // //                         setSelectedSprintId('all');
// // //                     }
// // //                 })
// // //                 .catch(error => {
// // //                     console.error('Error fetching sprints:', error);
// // //                     setSprints([]);
// // //                     setSelectedSprintId('all');
// // //                 })
// // //                 .finally(() => setLoadingSprints(false));
// // //         } else {
// // //             setSprints([]);
// // //             setSelectedSprintId('all');
// // //             setLoadingSprints(false);
// // //         }
// // //     }, [currentGroupId]);

// // //     // Fetch stats when selectedGroup (currentGroupId), selectedSprintId, or refreshNonce changes
// // //     const fetchStats = useCallback(async () => {
// // //         if (currentGroupId) {
// // //             setLoadingStats(true);
// // //             try {
// // //                 const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${selectedSprintId}`);
// // //                 setStatData(response.data || {
// // //                     totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
// // //                     tasksLate: 0, totalCommits: 0, totalLOC: 0,
// // //                 });
// // //             } catch (error) {
// // //                 console.error('Error fetching stats:', error);
// // //                 setStatData({
// // //                     totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
// // //                     tasksLate: 0, totalCommits: 0, totalLOC: 0,
// // //                 });
// // //             } finally {
// // //                 setLoadingStats(false);
// // //             }
// // //         } else {
// // //             setStatData({
// // //                 totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
// // //                 tasksLate: 0, totalCommits: 0, totalLOC: 0,
// // //             });
// // //             setLoadingStats(false);
// // //         }
// // //     }, [currentGroupId, selectedSprintId]); // Không cần refreshNonce ở đây, sẽ gọi fetchStats khi nonce thay đổi

// // //     useEffect(() => {
// // //         fetchStats();
// // //     }, [fetchStats, refreshNonce]); // Gọi fetchStats khi hàm thay đổi hoặc nonce thay đổi

// // //     // Master refresh logic
// // //     const handleMasterRefresh = useCallback(async () => {
// // //         if (!currentProjectId) {
// // //             console.warn("[useDashboardCoreData] No project selected, cannot refresh.");
// // //             return;
// // //         }
// // //         if (isMasterRefreshing) return;

// // //         setIsMasterRefreshing(true);
// // //         try {
// // //             console.log(`[useDashboardCoreData] Triggering master refresh for projectId: ${currentProjectId}`);
// // //             await axios.post(`http://localhost:5000/api/projects/${currentProjectId}/commits/refresh`);
// // //             console.log(`[useDashboardCoreData] Master refresh API call completed for projectId: ${currentProjectId}`);
// // //             setRefreshNonce(prev => prev + 1); // Đây sẽ trigger useEffect gọi fetchStats
// // //         } catch (error) {
// // //             console.error(`[useDashboardCoreData] Failed to trigger master refresh for projectId ${currentProjectId}:`, error);
// // //             alert("Error refreshing data from source. Please check the console."); // Có thể thay alert bằng một cơ chế thông báo tốt hơn
// // //         } finally {
// // //             setIsMasterRefreshing(false);
// // //         }
// // //     }, [currentProjectId, isMasterRefreshing]);


// // //     const handleGroupChange = useCallback((newGroupId) => {
// // //         const group = groups.find(g => g.group_id === Number(newGroupId));
// // //         setSelectedGroup(group || null);
// // //     }, [groups]);

// // //     return {
// // //         selectedGroup,
// // //         setSelectedGroup: handleGroupChange, // Thay vì trả về setSelectedGroup trực tiếp
// // //         groups,
// // //         loadingGroups,
// // //         currentUserRole,
// // //         sprints,
// // //         selectedSprintId,
// // //         setSelectedSprintId,
// // //         loadingSprints, // Thêm state này
// // //         statData,
// // //         loadingStats,
// // //         isMasterRefreshing,
// // //         refreshNonce,
// // //         handleMasterRefresh,
// // //         currentProjectId, // Trả về để các chart con sử dụng
// // //         currentGroupId    // Trả về để các chart con sử dụng
// // //     };
// // // };

// // // export default useDashboardCoreData;

// // // --- START OF FILE useDashboardCoreData.js ---
// // import { useState, useEffect, useCallback } from 'react';
// // import axios from 'axios';

// // // Bỏ FIXED_USER_AND_CLASS_CONTEXT

// // const useDashboardCoreData = (userId, classId, initialGroupIdFromContext) => { // << NHẬN PARAMS
// //     const [selectedGroup, setSelectedGroup] = useState(null);
// //     const [groups, setGroups] = useState([]);
// //     const [loadingGroups, setLoadingGroups] = useState(true);
// //     const [currentUserRole, setCurrentUserRole] = useState(null);

// //     const [sprints, setSprints] = useState([]);
// //     // selectedSprintId sẽ được set bởi Dashboard component dựa trên context, hoặc mặc định 'all'
// //     // const [selectedSprintId, setSelectedSprintId] = useState(null);
// //     // const [loadingSprints, setLoadingSprints] = useState(false);

// //     // const [statData, setStatData] = useState({
// //     //     totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
// //     //     tasksLate: 0, totalCommits: 0, totalLOC: 0,
// //     // });
// //     // const [loadingStats, setLoadingStats] = useState(false);

// //     // const [isMasterRefreshing, setIsMasterRefreshing] = useState(false);
// //     // const [refreshNonce, setRefreshNonce] = useState(0);

// //     // // Fetch groups and user role based on userId and classId from props
// //     // useEffect(() => {
// //     //     if (!userId || !classId) {
// //     //         setLoadingGroups(false);
// //     //         setGroups([]);
// //     //         setSelectedGroup(null);
// //     //         setCurrentUserRole(null);
// //     //         console.warn("[useDashboardCoreData] userId or classId is missing.");
// //     //         return;
// //     //     }

// //     //     let isMounted = true;
// //     //     const fetchInitialData = async () => {
// //     //         if (!isMounted) return;
// //     //         setLoadingGroups(true);
// //     //         setGroups([]);
// //     //         setCurrentUserRole(null);
// //     //         setSelectedGroup(null); // Reset selected group
// //     //         try {
// //     //             // Sử dụng userId và classId từ props
// //     //             const response = await axios.get(`http://localhost:5000/api/groups?userId=${userId}&classId=${classId}`);
// //     //             if (!isMounted) return;

// //     //             const fetchedGroups = response.data.groups || [];
// //     //             const role = response.data.role;

// //     //             setCurrentUserRole(role);
// //     //             setGroups(fetchedGroups);

// //     //             if (fetchedGroups.length > 0) {
// //     //                 // Ưu tiên initialGroupId nếu được cung cấp và tồn tại trong fetchedGroups
// //     //                 // initialGroupId này chính là group mà người dùng đang xem chi tiết
// //     //                 let groupToSelect = null;
// //     //                 const groupToSelect = initialGroupId
// //     //                     ? fetchedGroups.find(g => g.group_id === Number(initialGroupId))
// //     //                     : null; // Không chọn group đầu tiên nữa, để Dashboard component quyết định

// //     //                 if (groupToSelect) {
// //     //                     setSelectedGroup(groupToSelect);
// //     //                 } else if (initialGroupId && fetchedGroups.length > 0) {
// //     //                     // Nếu initialGroupId được cung cấp nhưng không tìm thấy (ví dụ user không thuộc group đó nữa)
// //     //                     // Log cảnh báo, và có thể chọn group đầu tiên làm fallback nếu logic yêu cầu.
// //     //                     // Hiện tại, để selectedGroup là null, Dashboard sẽ hiển thị loading/no data.
// //     //                     console.warn(`[useDashboardCoreData] Initial group ID ${initialGroupId} not found in fetched groups. Dashboard might not display specific group data.`);
// //     //                     // Hoặc: setSelectedGroup(fetchedGroups[0]); // Fallback to first group
// //     //                 } else if (fetchedGroups.length > 0 && !initialGroupId) {
// //     //                     // Nếu không có initialGroupId, có thể chọn group đầu tiên nếu là student
// //     //                     // hoặc không chọn nếu là instructor (để instructor tự chọn từ dropdown nếu có)
// //     //                     // Hiện tại, để null để Dashboard tự xử lý
// //     //                     console.log("[useDashboardCoreData] No initialGroupId, group selection might be manual or based on other logic.")
// //     //                 }

// //     //             } else {
// //     //                 setSelectedGroup(null); // Không có group nào thì set null
// //     //             }
// //     //         } catch (error) {
// //     //             console.error('Error fetching groups:', error);
// //     //             setGroups([]);
// //     //             setSelectedGroup(null);
// //     //             setCurrentUserRole(null);
// //     //         }
// //     //         setLoadingGroups(false);
// //     //     };
// //     //     fetchInitialData();
// //     // }, [userId, classId, initialGroupId]); // Chạy lại khi các ID này thay đổi

// //     // const currentGroupId = selectedGroup?.group_id;
// //     // const currentProjectId = selectedGroup?.project_id;

// //     // // Fetch sprints khi selectedGroup (currentGroupId) thay đổi
// //     // useEffect(() => {
// //     //     if (currentGroupId) {
// //     //         setLoadingSprints(true);
// //     //         axios.get(`http://localhost:5000/api/groups/${currentGroupId}/sprints`)
// //     //             .then(response => {
// //     //                 const fetchedSprints = response.data || [];
// //     //                 setSprints(fetchedSprints);
// //     //                 // Việc chọn sprint mặc định (currentOrUpcomingSprint) sẽ bị ghi đè
// //     //                 // bởi selectedSprintId từ context trong Dashboard component.
// //     //                 // Nếu muốn giữ logic chọn sprint mặc định này, cần cân nhắc thứ tự ưu tiên.
// //     //                 // Hiện tại, để selectedSprintId được quản lý từ bên ngoài (Dashboard).
// //     //                 // if (fetchedSprints.length > 0 && selectedSprintId === 'all') { // Chỉ set nếu chưa có sprint cụ thể nào được chọn
// //     //                 //     const now = new Date();
// //     //                 //     const currentOrUpcomingSprint =
// //     //                 //         fetchedSprints.find(s => new Date(s.endDate) >= now && new Date(s.startDate) <= now) ||
// //     //                 //         fetchedSprints.find(s => new Date(s.startDate) > now) ||
// //     //                 //         (fetchedSprints.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)))[0];
// //     //                 //     setSelectedSprintId(currentOrUpcomingSprint ? currentOrUpcomingSprint.id : 'all');
// //     //                 // } else if (fetchedSprints.length === 0) {
// //     //                 //     setSelectedSprintId('all');
// //     //                 // }
// //     //             })
// //     //             .catch(error => {
// //     //                 console.error('Error fetching sprints:', error);
// //     //                 setSprints([]);
// //     //                 // setSelectedSprintId('all');
// //     //             })
// //     //             .finally(() => setLoadingSprints(false));
// //     //     } else {
// //     //         setSprints([]);
// //     //         // setSelectedSprintId('all');
// //     //         setLoadingSprints(false);
// //     //     }
// //     // }, [currentGroupId]); // Không phụ thuộc vào selectedSprintId ở đây để tránh vòng lặp

// //     // // Fetch stats
// //     // const fetchStats = useCallback(async () => {
// //     //     // Chỉ fetch khi có currentGroupId VÀ selectedSprintId (có thể là 'all' hoặc một ID)
// //     //     if (currentGroupId && selectedSprintId !== undefined) {
// //     //         setLoadingStats(true);
// //     //         try {
// //     //             const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${selectedSprintId}`);
// //     //             setStatData(response.data || {
// //     //                 totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
// //     //                 tasksLate: 0, totalCommits: 0, totalLOC: 0,
// //     //             });
// //     //         } catch (error) {
// //     //             console.error('Error fetching stats:', error);
// //     //             setStatData({
// //     //                 totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
// //     //                 tasksLate: 0, totalCommits: 0, totalLOC: 0,
// //     //             });
// //     //         } finally {
// //     //             setLoadingStats(false);
// //     //         }
// //     //     } else {
// //     //         // Reset stats nếu không có currentGroupId hoặc selectedSprintId
// //     //         setStatData({
// //     //             totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
// //     //             tasksLate: 0, totalCommits: 0, totalLOC: 0,
// //     //         });
// //     //         setLoadingStats(false);
// //     //     }
// //     // }, [currentGroupId, selectedSprintId]);

// //     // useEffect(() => {
// //     //     fetchStats();
// //     // }, [fetchStats, refreshNonce]);

// //     // // Master refresh logic (giữ nguyên)
// //     // const handleMasterRefresh = useCallback(async () => {
// //     //     if (!currentProjectId) {
// //     //         console.warn("[useDashboardCoreData] No project selected, cannot refresh.");
// //     //         return;
// //     //     }
// //     //     if (isMasterRefreshing) return;
// //     //     setIsMasterRefreshing(true);
// //     //     try {
// //     //         await axios.post(`http://localhost:5000/api/projects/${currentProjectId}/commits/refresh`);
// //     //         setRefreshNonce(prev => prev + 1);
// //     //     } catch (error) {
// //     //         console.error(`[useDashboardCoreData] Failed to trigger master refresh for projectId ${currentProjectId}:`, error);
// //     //         alert("Error refreshing data from source. Please check the console.");
// //     //     } finally {
// //     //         setIsMasterRefreshing(false);
// //     //     }
// //     // }, [currentProjectId, isMasterRefreshing]);

// //     // // handleGroupChange không còn cần thiết nếu group được xác định bởi initialGroupId từ context
// //     // // Nếu vẫn muốn cho phép user thay đổi group từ dropdown bên trong Dashboard (khác với group từ URL)
// //     // // thì cần giữ lại và điều chỉnh logic. Hiện tại, Dashboard sẽ hiển thị dữ liệu của group từ URL.
// //     // // const handleGroupChange = useCallback((newGroupId) => {
// //     // //     const group = groups.find(g => g.group_id === Number(newGroupId));
// //     // //     setSelectedGroup(group || null);
// //     // // }, [groups]);

// //     const [selectedSprintId, setSelectedSprintId] = useState(null); // Khởi tạo là null

// //     useEffect(() => {
// //         if (!userId || !classId) {
// //             setLoadingGroups(false);
// //             setGroups([]);
// //             setSelectedGroup(null);
// //             setCurrentUserRole(null);
// //             console.warn("[useDashboardCoreData] userId or classId is missing for fetching groups.");
// //             return;
// //         }

// //         let isMounted = true; // Để tránh set state trên component đã unmount
// //         const fetchInitialData = async () => {
// //             if (!isMounted) return;
// //             setLoadingGroups(true); // Đặt loading true khi bắt đầu fetch
// //             // Reset trước khi fetch để tránh hiển thị data cũ
// //             setGroups([]);
// //             setSelectedGroup(null);
// //             setCurrentUserRole(null);

// //             try {
// //                 const response = await axios.get(`http://localhost:5000/api/groups?userId=${userId}&classId=${classId}`);
// //                 if (!isMounted) return;

// //                 const fetchedGroups = response.data.groups || [];
// //                 const role = response.data.role;

// //                 setGroups(fetchedGroups);
// //                 setCurrentUserRole(role);

// //                 if (fetchedGroups.length > 0) {
// //                     let groupToSelect = null;
// //                     if (initialGroupIdFromContext) {
// //                         groupToSelect = fetchedGroups.find(g => g.group_id === Number(initialGroupIdFromContext));
// //                         if (!groupToSelect) {
// //                             console.warn(`[useDashboardCoreData] Initial group ID ${initialGroupIdFromContext} not found in fetched groups. Attempting to select first group.`);
// //                             // Nếu initialGroupId không hợp lệ, thử chọn group đầu tiên (nếu có)
// //                             // Điều này quan trọng khi trang được load trực tiếp vào dashboard của một group cụ thể
// //                             groupToSelect = fetchedGroups[0];
// //                         }
// //                     } else if (fetchedGroups.length > 0) {
// //                         // Nếu không có initialGroupId (ví dụ: user vào trang class chung, chưa chọn group)
// //                         // Hoặc nếu role là student, thường chỉ có 1 group trong context này, nên chọn group đầu tiên.
// //                         // Nếu là instructor và có nhiều group, có thể không chọn group nào ban đầu,
// //                         // để instructor chọn từ dropdown (nếu có).
// //                         // Tuy nhiên, vì Dashboard này đang là con của trang chi tiết group, nên initialGroupIdFromContext nên luôn có.
// //                         // Fallback này để phòng trường hợp.
// //                         groupToSelect = fetchedGroups[0];
// //                         console.log("[useDashboardCoreData] No initialGroupIdFromContext, selected first available group.");
// //                     }
// //                     setSelectedGroup(groupToSelect);
// //                 } else {
// //                     setSelectedGroup(null); // Không có group nào
// //                 }
// //             } catch (error) {
// //                 if (isMounted) {
// //                     console.error('Error fetching groups:', error);
// //                     setGroups([]);
// //                     setSelectedGroup(null);
// //                     setCurrentUserRole(null);
// //                 }
// //             } finally {
// //                 if (isMounted) {
// //                     setLoadingGroups(false);
// //                 }
// //             }
// //         };

// //         fetchInitialData();
// //         return () => { isMounted = false; };

// //     }, [userId, classId, initialGroupIdFromContext]);

// //     const currentGroupId = selectedGroup?.group_id;
// //     const currentProjectId = selectedGroup?.project_id;

// //     // Fetch sprints (giữ nguyên logic, nhưng đảm bảo nó chạy SAU khi selectedGroup được set)
// //     useEffect(() => {
// //         if (currentGroupId) { // Chỉ fetch khi có currentGroupId
// //             setLoadingSprints(true);
// //             axios.get(`http://localhost:5000/api/groups/${currentGroupId}/sprints`)
// //                 .then(response => {
// //                     const fetchedSprints = response.data || [];
// //                     setSprints(fetchedSprints);
// //                     // setSelectedSprintId(null); // Để Dashboard tự set từ context
// //                 })
// //                 .catch(error => {
// //                     console.error('Error fetching sprints:', error);
// //                     setSprints([]);
// //                 })
// //                 .finally(() => setLoadingSprints(false));
// //         } else {
// //             setSprints([]);
// //             setLoadingSprints(false);
// //         }
// //     }, [currentGroupId]);

// //     // Fetch stats (giữ nguyên logic)
// //     const fetchStats = useCallback(async () => {
// //         if (currentGroupId && selectedSprintId !== undefined && selectedSprintId !== null) { // Thêm check selectedSprintId !== null
// //             setLoadingStats(true);
// //             try {
// //                 const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${selectedSprintId}`);
// //                 setStatData(response.data || { /* default stats */ });
// //             } catch (error) { /* ... */ } finally { setLoadingStats(false); }
// //         } else {
// //             setStatData({ /* default stats */ });
// //             setLoadingStats(false);
// //         }
// //     }, [currentGroupId, selectedSprintId]);

// //     useEffect(() => {
// //         if (selectedSprintId !== null) { // Chỉ fetch stats khi selectedSprintId đã được xác định (không phải null ban đầu)
// //             fetchStats();
// //         }
// //     }, [fetchStats, refreshNonce, selectedSprintId]);

// //     const handleMasterRefresh = useCallback(async () => {
// //         if (!currentProjectId) {
// //             console.warn("[useDashboardCoreData] No project selected, cannot refresh.");
// //             return;
// //         }
// //         if (isMasterRefreshing) return;
// //         setIsMasterRefreshing(true);
// //         try {
// //             await axios.post(`http://localhost:5000/api/projects/${currentProjectId}/commits/refresh`);
// //             setRefreshNonce(prev => prev + 1);
// //         } catch (error) {
// //             console.error(`[useDashboardCoreData] Failed to trigger master refresh for projectId ${currentProjectId}:`, error);
// //             alert("Error refreshing data from source. Please check the console.");
// //         } finally {
// //             setIsMasterRefreshing(false);
// //         }
// //     }, [currentProjectId, isMasterRefreshing]);

// //     return {
// //         selectedGroup,
// //         // setSelectedGroup: handleGroupChange, // Bỏ nếu group được xác định bởi context/URL
// //         groups,
// //         loadingGroups,
// //         currentUserRole,
// //         sprints,
// //         selectedSprintId,
// //         setSelectedSprintId, // Dashboard sẽ gọi hàm này
// //         loadingSprints,
// //         statData,
// //         loadingStats,
// //         isMasterRefreshing,
// //         refreshNonce,
// //         handleMasterRefresh,
// //         currentProjectId,
// //         currentGroupId
// //     };
// // };

// // export default useDashboardCoreData;
// // // --- END OF FILE useDashboardCoreData.js ---

// // --- START OF FILE useDashboardCoreData.js ---
// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// const useDashboardCoreData = (userId, classId, initialGroupIdFromContext) => {
//     const [selectedGroup, setSelectedGroup] = useState(null);
//     const [groups, setGroups] = useState([]);
//     const [loadingGroups, setLoadingGroups] = useState(true);
//     const [currentUserRole, setCurrentUserRole] = useState(null);

//     const [sprints, setSprints] = useState([]);
//     const [selectedSprintId, setSelectedSprintId] = useState(null); // Khởi tạo là null, Dashboard sẽ set từ context
//     const [loadingSprints, setLoadingSprints] = useState(false); // Khai báo lại

//     const [statData, setStatData] = useState({ // Khai báo lại
//         totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
//         tasksLate: 0, totalCommits: 0, totalLOC: 0,
//     });
//     const [loadingStats, setLoadingStats] = useState(false); // Khai báo lại

//     const [isMasterRefreshing, setIsMasterRefreshing] = useState(false); // Khai báo lại
//     const [refreshNonce, setRefreshNonce] = useState(0); // Khai báo lại

//     useEffect(() => {
//         if (!userId || !classId) {
//             setLoadingGroups(false);
//             setGroups([]);
//             setSelectedGroup(null);
//             setCurrentUserRole(null);
//             console.warn("[useDashboardCoreData] userId or classId is missing for fetching groups.");
//             return;
//         }

//         let isMounted = true;
//         const fetchInitialData = async () => {
//             if (!isMounted) return;
//             setLoadingGroups(true);
//             setGroups([]);
//             setSelectedGroup(null);
//             setCurrentUserRole(null);

//             try {
//                 const response = await axios.get(`http://localhost:5000/api/groups?userId=${userId}&classId=${classId}`);
//                 if (!isMounted) return;

//                 const fetchedGroups = response.data.groups || [];
//                 const role = response.data.role;

//                 setGroups(fetchedGroups);
//                 setCurrentUserRole(role);

//                 if (fetchedGroups.length > 0) {
//                     let groupToSelect = null;
//                     if (initialGroupIdFromContext) {
//                         groupToSelect = fetchedGroups.find(g => g.group_id === Number(initialGroupIdFromContext));
//                         if (!groupToSelect) {
//                             console.warn(`[useDashboardCoreData] Initial group ID ${initialGroupIdFromContext} not found in fetched groups. Selecting first available group.`);
//                             groupToSelect = fetchedGroups[0];
//                         }
//                     } else if (fetchedGroups.length > 0) {
//                         groupToSelect = fetchedGroups[0];
//                         console.log("[useDashboardCoreData] No initialGroupIdFromContext, selected first available group.");
//                     }
//                     setSelectedGroup(groupToSelect);
//                 } else {
//                     setSelectedGroup(null);
//                 }
//             } catch (error) {
//                 if (isMounted) {
//                     console.error('Error fetching groups:', error);
//                     setGroups([]);
//                     setSelectedGroup(null);
//                     setCurrentUserRole(null);
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoadingGroups(false);
//                 }
//             }
//         };

//         fetchInitialData();
//         return () => { isMounted = false; };

//     }, [userId, classId, initialGroupIdFromContext]);

//     const currentGroupId = selectedGroup?.group_id;
//     const currentProjectId = selectedGroup?.project_id;

//     useEffect(() => {
//         if (currentGroupId) {
//             setLoadingSprints(true); // Sử dụng setLoadingSprints
//             axios.get(`http://localhost:5000/api/groups/${currentGroupId}/sprints`)
//                 .then(response => {
//                     const fetchedSprints = response.data || [];
//                     setSprints(fetchedSprints);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching sprints:', error);
//                     setSprints([]);
//                 })
//                 .finally(() => setLoadingSprints(false)); // Sử dụng setLoadingSprints
//         } else {
//             setSprints([]);
//             setLoadingSprints(false); // Sử dụng setLoadingSprints
//         }
//     }, [currentGroupId]);

//     const fetchStats = useCallback(async () => {
//         if (currentGroupId && selectedSprintId !== undefined && selectedSprintId !== null) {
//             setLoadingStats(true); // Sử dụng setLoadingStats
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${selectedSprintId}`);
//                 setStatData(response.data || { // Sử dụng setStatData
//                     totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
//                     tasksLate: 0, totalCommits: 0, totalLOC: 0,
//                 });
//             } catch (error) {
//                 console.error('Error fetching stats:', error);
//                 setStatData({ // Sử dụng setStatData
//                     totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
//                     tasksLate: 0, totalCommits: 0, totalLOC: 0,
//                 });
//             } finally {
//                 setLoadingStats(false); // Sử dụng setLoadingStats
//             }
//         } else {
//             setStatData({ // Sử dụng setStatData
//                 totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
//                 tasksLate: 0, totalCommits: 0, totalLOC: 0,
//             });
//             setLoadingStats(false); // Sử dụng setLoadingStats
//         }
//     }, [currentGroupId, selectedSprintId]);

//     useEffect(() => {
//         if (selectedSprintId !== null) {
//             fetchStats();
//         }
//     }, [fetchStats, refreshNonce, selectedSprintId]); // refreshNonce được khai báo

//     const handleMasterRefresh = useCallback(async () => {
//         if (!currentProjectId) {
//             console.warn("[useDashboardCoreData] No project selected, cannot refresh.");
//             return;
//         }
//         if (isMasterRefreshing) return; // isMasterRefreshing được khai báo
//         setIsMasterRefreshing(true); // setIsMasterRefreshing được khai báo
//         try {
//             console.log(`[useDashboardCoreData] Triggering master refresh for projectId: ${currentProjectId}`);
//             await axios.post(`http://localhost:5000/api/projects/${currentProjectId}/commits/refresh`);
//             console.log(`[useDashboardCoreData] Master refresh API call completed for projectId: ${currentProjectId}`);
//             setRefreshNonce(prev => prev + 1); // setRefreshNonce được khai báo
//         } catch (error) {
//             console.error(`[useDashboardCoreData] Failed to trigger master refresh for projectId ${currentProjectId}:`, error);
//             alert("Error refreshing data from source. Please check the console.");
//         } finally {
//             setIsMasterRefreshing(false); // setIsMasterRefreshing được khai báo
//         }
//     }, [currentProjectId, isMasterRefreshing]); // isMasterRefreshing được khai báo

//     return {
//         selectedGroup,
//         groups,
//         loadingGroups,
//         currentUserRole,
//         sprints,
//         selectedSprintId,
//         setSelectedSprintId,
//         loadingSprints, // loadingSprints được khai báo và trả về
//         statData,       // statData được khai báo và trả về
//         loadingStats,   // loadingStats được khai báo và trả về
//         isMasterRefreshing, // isMasterRefreshing được khai báo và trả về
//         refreshNonce,       // refreshNonce được khai báo và trả về
//         handleMasterRefresh,
//         currentProjectId,
//         currentGroupId
//     };
// };

// export default useDashboardCoreData;
// // --- END OF FILE useDashboardCoreData.js ---

// --- START OF FILE useDashboardCoreData.js ---
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// userId, classId, initialGroupIdFromContext sẽ được truyền từ Dashboard.js
const useDashboardCoreData = (userId, classId, initialGroupIdFromContext) => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const [sprints, setSprints] = useState([]);
    const [selectedSprintId, setSelectedSprintId] = useState(null);
    const [loadingSprints, setLoadingSprints] = useState(false);

    const [statData, setStatData] = useState({
        totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
        tasksLate: 0, totalCommits: 0, totalLOC: 0,
    });
    const [loadingStats, setLoadingStats] = useState(false);

    const [isMasterRefreshing, setIsMasterRefreshing] = useState(false);
    const [refreshNonce, setRefreshNonce] = useState(0);

    useEffect(() => {
        // Kiểm tra nếu các ID cần thiết không được cung cấp
        if (!userId || !classId) {
            setLoadingGroups(false);
            setGroups([]);
            setSelectedGroup(null);
            setCurrentUserRole(null);
            console.warn("[useDashboardCoreData] userId or classId is missing. Dashboard data might be incomplete.");
            // Không return ở đây nữa để cho phép component Dashboard xử lý việc thiếu ID nếu cần
            // Tuy nhiên, nếu thiếu thì API call sẽ thất bại hoặc không được gọi.
        }

        let isMounted = true;
        const fetchInitialData = async () => {
            // Chỉ fetch nếu có userId và classId
            if (!userId || !classId) {
                setLoadingGroups(false); // Đảm bảo loading kết thúc
                return;
            }

            if (!isMounted) return;
            setLoadingGroups(true);
            setGroups([]);
            setSelectedGroup(null);
            setCurrentUserRole(null);

            try {
                const response = await axios.get(`http://localhost:5000/api/groups?userId=${userId}&classId=${classId}`);
                if (!isMounted) return;

                const fetchedGroups = response.data.groups || [];
                const role = response.data.role;

                setGroups(fetchedGroups);
                setCurrentUserRole(role);

                if (fetchedGroups.length > 0) {
                    let groupToSelect = null;
                    if (initialGroupIdFromContext) {
                        groupToSelect = fetchedGroups.find(g => g.group_id === Number(initialGroupIdFromContext));
                        if (!groupToSelect) {
                            console.warn(`[useDashboardCoreData] Initial group ID ${initialGroupIdFromContext} not found in fetched groups. Selecting first available group.`);
                            console.warn(`[useDashboardCoreData] Instructor view: Initial group ID ${initialGroupIdFromContext} provided via URL was not found in the list of groups fetched for instructor ${userId} in class ${classId}. This might indicate a permission issue or incorrect group ID for this context.`);
                            groupToSelect = fetchedGroups[0];
                        }
                    } else if (fetchedGroups.length > 0) {
                        // groupToSelect = fetchedGroups[0];
                        console.log("[useDashboardCoreData] No initialGroupIdFromContext, selected first available group.");
                    }
                    setSelectedGroup(groupToSelect);
                } else {
                    console.warn(`[useDashboardCoreData] Instructor view: No groups fetched for instructor ${userId} in class ${classId}.`);
                    setSelectedGroup(null);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching groups:', error);
                    setGroups([]);
                    setSelectedGroup(null);
                    setCurrentUserRole(null);
                }
            } finally {
                if (isMounted) {
                    setLoadingGroups(false);
                }
            }
        };

        fetchInitialData();
        return () => { isMounted = false; };

    }, [userId, classId, initialGroupIdFromContext]);

    const currentGroupId = selectedGroup?.group_id;
    const currentProjectId = selectedGroup?.project_id;

    useEffect(() => {
        if (currentGroupId) {
            setLoadingSprints(true);
            axios.get(`http://localhost:5000/api/groups/${currentGroupId}/sprints`)
                .then(response => {
                    const fetchedSprints = response.data || [];
                    setSprints(fetchedSprints);
                })
                .catch(error => {
                    console.error('Error fetching sprints:', error);
                    setSprints([]);
                })
                .finally(() => setLoadingSprints(false));
        } else {
            setSprints([]);
            setLoadingSprints(false);
        }
    }, [currentGroupId]);

    const fetchStats = useCallback(async () => {
        if (currentGroupId && selectedSprintId !== undefined) {
            setLoadingStats(true);
            try {
                const sprintParam = selectedSprintId === null ? 'all' : selectedSprintId;
                // const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${selectedSprintId}`);
                // setStatData(response.data || {
                //     totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                //     tasksLate: 0, totalCommits: 0, totalLOC: 0,
                // });
                const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${sprintParam}`);
                setStatData(response.data || {
                    totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                    tasksLate: 0, totalCommits: 0, totalLOC: 0,
                });
            } catch (error) {
                console.error(`Error fetching stats for group ${currentGroupId} with sprint ${selectedSprintId}:`, error);
                setStatData({
                    totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                    tasksLate: 0, totalCommits: 0, totalLOC: 0,
                });
            } finally {
                setLoadingStats(false);
            }
        } else {
            setStatData({
                totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                tasksLate: 0, totalCommits: 0, totalLOC: 0,
            });
            setLoadingStats(false);
        }
    }, [currentGroupId, selectedSprintId]);

    useEffect(() => {
        if (selectedSprintId !== undefined && currentGroupId) {
             fetchStats();
        } else if (selectedSprintId === undefined && currentGroupId) {
        
        }
    }, [fetchStats, refreshNonce]);

    const handleMasterRefresh = useCallback(async () => {
        if (!currentProjectId) {
            console.warn("[useDashboardCoreData] No project selected, cannot refresh.");
            return;
        }
        if (isMasterRefreshing) return;
        setIsMasterRefreshing(true);
        try {
            console.log(`[useDashboardCoreData] Triggering master refresh for projectId: ${currentProjectId}`);
            await axios.post(`http://localhost:5000/api/projects/${currentProjectId}/commits/refresh`);
            console.log(`[useDashboardCoreData] Master refresh API call completed for projectId: ${currentProjectId}`);
            setRefreshNonce(prev => prev + 1);
        } catch (error) {
            console.error(`[useDashboardCoreData] Failed to trigger master refresh for projectId ${currentProjectId}:`, error);
            alert("Error refreshing data from source. Please check the console.");
        } finally {
            setIsMasterRefreshing(false);
        }
    }, [currentProjectId, isMasterRefreshing]);

    return {
        selectedGroup,
        groups,
        loadingGroups,
        currentUserRole,
        sprints,
        selectedSprintId,
        setSelectedSprintId,
        loadingSprints,
        statData,
        loadingStats,
        isMasterRefreshing,
        refreshNonce,
        handleMasterRefresh,
        currentProjectId,
        currentGroupId
    };
};

export default useDashboardCoreData;
// --- END OF FILE useDashboardCoreData.js ---