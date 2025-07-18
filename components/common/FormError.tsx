import { Typography } from '@mui/material';

const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <Typography color="error" variant="subtitle1">
      {message}
    </Typography>
  );
};

export default FormError;
