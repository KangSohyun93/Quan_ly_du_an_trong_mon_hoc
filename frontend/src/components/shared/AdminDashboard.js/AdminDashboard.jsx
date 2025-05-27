import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert 
} from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
  const [configs, setConfigs] = useState([]);
  const [editConfig, setEditConfig] = useState(null);
  const [notification, setNotification] = useState({ message: '', severity: '' });
  const [search, setSearch] = useState('');

  const configTypes = ['github', 'db', 'api', 'notification', 'permission'];

  // Lấy danh sách cấu hình
  const fetchConfigs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/configurations');
      setConfigs(response.data);
    } catch (error) {
      setNotification({ message: 'Error fetching configurations', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  // Lưu hoặc cập nhật cấu hình
  const saveConfig = async () => {
    const configKey = document.getElementById('config-type').value;
    const configValue = document.getElementById('config-value').value;

    // Kiểm tra hợp lệ
    if (!configValue.includes('"') || !configValue.includes(':')) {
      setNotification({ message: 'Invalid configuration value format', severity: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/configurations', {
        config_id: editConfig?.config_id,
        config_key: configKey,
        config_value: configValue,
        updated_by: 34 // Giả định admin hiện tại có user_id = 34 (Admin1)
      });
      setNotification({ message: 'Configuration saved successfully', severity: 'success' });
      setEditConfig(null);
      fetchConfigs();
    } catch (error) {
      setNotification({ message: 'Error saving configuration', severity: 'error' });
    }
  };

  // Tìm kiếm
  const filteredConfigs = configs.filter(config => 
    config.config_key.toLowerCase().includes(search.toLowerCase()) ||
    config.config_value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar được giả định là component riêng */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Cấu hình hệ thống</Typography>
        
        {/* Tìm kiếm và hành động */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            label="Tìm kiếm cấu hình"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={fetchConfigs}>Làm mới</Button>
          <Button variant="contained" onClick={() => setEditConfig({})}>Thêm cấu hình mới</Button>
        </Box>

        {/* Thông báo */}
        {notification.message && (
          <Alert severity={notification.severity} sx={{ mb: 2 }}>
            {notification.message}
          </Alert>
        )}

        {/* Danh sách cấu hình */}
        {!editConfig && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loại cấu hình</TableCell>
                  <TableCell>Giá trị cấu hình</TableCell>
                  <TableCell>Người thay đổi</TableCell>
                  <TableCell>Thời gian thay đổi</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredConfigs.map(config => (
                  <TableRow key={config.config_id}>
                    <TableCell>{config.config_key}</TableCell>
                    <TableCell>{config.config_value}</TableCell>
                    <TableCell>{config.updated_by}</TableCell>
                    <TableCell>{new Date(config.updated_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button onClick={() => setEditConfig(config)}>Chỉnh sửa</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Form cập nhật/thêm cấu hình */}
        {editConfig && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h6">
              {editConfig.config_id ? `Cập nhật cấu hình - ${editConfig.config_key}` : 'Thêm cấu hình mới'}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Loại cấu hình</InputLabel>
              <Select
                id="config-type"
                defaultValue={editConfig.config_key || 'github'}
              >
                {configTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="config-value"
              label="Giá trị cấu hình"
              multiline
              rows={3}
              defaultValue={editConfig.config_value || ''}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Người thay đổi"
              value="Admin1"
              fullWidth
              sx={{ mt: 2 }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Thời gian"
              value={new Date().toLocaleString()}
              fullWidth
              sx={{ mt: 2 }}
              InputProps={{ readOnly: true }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={saveConfig}>Lưu</Button>
              <Button variant="outlined" onClick={() => setEditConfig(null)}>Hủy</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;