import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
import Image from '../components/Image';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

export default function Logo({ disabledLink = false, sx }: Props) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR
  // const logo = '/logo/logo_single.svg';

  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <Image visibleByDefault disabledEffect src="/logo/logofinal.png" alt="login" />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
