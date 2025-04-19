

import Box from '@mui/joy/Box';
import EmailLists from './email';
import Messages from './messages';

const EmailLayout = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, height: '100vh', borderTop:"1px solid" ,borderColor:'divider' }}>
      <Box sx={{ width: 500,borderRight:'solid 1px', borderColor:'divider'}}>
        <EmailLists />
      </Box>

      <Box sx={{ flex:1 , padding:'20px 10px'}}>
      <Messages/>
      </Box>
    </Box>
  );
};

export default EmailLayout;

