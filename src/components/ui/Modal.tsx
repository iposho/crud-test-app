import { Link as RouterLink } from 'react-router-dom';

import {
  Box, Typography, Modal as MUIModal, Link,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import Button from './Button';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  bgcolor: 'background.paper',
  border: '1px solid #444',
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  open: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onDeleteButtonClick?: () => void;
  message?: string;
  id: number | null;
  isButtonsHide?: boolean;
}

export default function Modal(
  {
    onClose,
    open,
    message,
    id,
    isButtonsHide,
    isDeleting,
    onDelete,
    onDeleteButtonClick,
  }:ModalProps,
) {
  return (
    <MUIModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{
            mt: 2,
            textAlign: 'center',
          }}
        >
          {
            (!isButtonsHide && isDeleting) && 'Are you sure you want to delete this record?'
          }
          {
            !isDeleting
            && (
              <Link
                component={RouterLink}
                to="/"
                state={{
                  id,
                }}
              >
                ← Return to records list
              </Link>
            )
          }
        </Typography>
        {
          (!isButtonsHide && isDeleting)
          && (
            <Box
              sx={{
                justifyContent: 'space-around',
                display: 'flex',
                marginTop: '1.5rem',
              }}
            >
              <Button
                onClick={onClose}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={onDeleteButtonClick || onDelete}
                color="error"
              >
                Delete
              </Button>
            </Box>
          )
        }
        <IconButton
          sx={{
            position: 'absolute',
            right: '0.5rem',
            top: '0.5rem',
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </MUIModal>
  );
}
