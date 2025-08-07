import { Box, CircularProgress } from "@mui/material";


const Loading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
        }}>
        <CircularProgress sx={{ margin: 'auto' }} size={100} />
        </Box>
    );
};
export default Loading