import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from '@mui/material';

interface InputWithLoaderProps {
  isLoading: boolean;
  inputProps: OutlinedInputProps;
  inputLabel: string;
  helperText?: {
    text: string;
    loading: boolean;
  };
  endAdornmentContent?: string;
}

const InputWithLoader = ({
  isLoading,
  inputProps,
  inputLabel,
  helperText,
  endAdornmentContent,
}: InputWithLoaderProps) => {
  return (
    <FormControl variant="outlined">
      <InputLabel>{inputLabel}</InputLabel>
      <OutlinedInput
        {...inputProps}
        endAdornment={
          <InputAdornment position="end">{endAdornmentContent}</InputAdornment>
        }
        inputProps={{ 'aria-label': 'amountIn' }}
      />
      <FormHelperText sx={{ fontSize: '0.875rem' }}>
        {helperText?.loading ? (
          <CircularProgress size={16} />
        ) : (
          helperText?.text
        )}
      </FormHelperText>
      {isLoading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderRadius: 1,
            pointerEvents: 'none',
            height: 'calc(100% - 27px)',
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </FormControl>
  );
};

export default InputWithLoader;
