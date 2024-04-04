import React, { FC, useEffect, useState } from 'react';
import { DataGrid, GridFilterModel, GridLogicOperator } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Divider, FormControl, FormLabel, Input, InputLabel, MenuItem, Select } from '@mui/material';



type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'userId', headerName: 'User ID', width: 150 },
  { field: 'title', headerName: 'Title', width: 400 },
  { field: 'body', headerName: 'Body', width: 800 },
];

const App: FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [usersForFilter, setUsersForFilter] = useState<number[]>([]);

  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>(undefined);


  const [filterInputUserId, setFilterInputUserId] = useState<number | null>(null);
  const [filterInputTitle, setFilterInputTitle] = useState<string | null>('');

  const handleFilterInputChange = (
    inputName: string,
    inputValue: string | number | null
  ) => {

    const newFilterModel: GridFilterModel = {
      items: [],
      logicOperator: GridLogicOperator.Or,
    };

    if (inputName === 'userId') {
      setFilterInputUserId(inputValue as number);
      newFilterModel.items.push({
        field: 'userId',
        operator: 'equals',
        value: inputValue,
      });
    } else if (inputName === 'title') {
      setFilterInputTitle(inputValue as string);
      newFilterModel.items.push({
        field: 'title',
        operator: 'contains',
        value: inputValue,
      });
    }

    setFilterModel(newFilterModel);
  }


  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const json = await response.json();
    setData(json);
    const _tmpUsersForFilter: number[] = [];

    json.forEach((post: Post) => {
      if (!_tmpUsersForFilter.includes(post.userId)) {
        _tmpUsersForFilter.push(post.userId);
      }
    });

    setUsersForFilter(_tmpUsersForFilter);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{
      margin: 'auto',
      width: '80%',

    }}>
      <h1>Data Grid Posts</h1>

      <Button onClick={handleOpen}>Filter</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-filter-title"
        aria-describedby="modal-filter-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-filter-title" variant="h6" component="h2">
            Filter
          </Typography>
          <Box id="modal-filter-description" sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>User ID</InputLabel>
              <Select placeholder="User ID"
                value={filterInputUserId === null ? '' : filterInputUserId}
                onChange={(event) => handleFilterInputChange('userId', event.target.value)}
              >
                {Object.keys(usersForFilter).map((userId) => {
                  return <MenuItem key={userId} value={userId}>{userId}</MenuItem>

                })}
              </Select>
            </FormControl>

            <Divider sx={{ mt: 5 }} />

            <FormControl fullWidth>
              <InputLabel>Title</InputLabel>
              <Input value={filterInputTitle} placeholder="Title" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleFilterInputChange('title', event.target.value)
              }} />
            </FormControl>

          </Box>

          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>

      <div style={{ height: '90vh', width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          filterModel={filterModel}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
        />
      </div>
    </div>
  );

}

export default App;