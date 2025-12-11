import { ListItemIcon, MenuItem } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';






const DeleteAction = ({ handleDelete, row }) => {
  return (
    <MenuItem onClick={() => handleDelete([row.original._id])}>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
};

export default DeleteAction;

