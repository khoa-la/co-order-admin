// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from '../../_mock';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets';
import { useQuery } from 'react-query';
import reportApi from 'apis/report';
import request from 'utils/axios';

// ----------------------------------------------------------------------

export default function ReportPage() {
  const { data: monthReport } = useQuery('reports', async () =>
    request.get('/admin/reports/overview?time-filter=MONTH').then((res) => res?.data?.items)
  );
  console.log(monthReport);
  const { user } = useAuth();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName}`}
              description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={<Button variant="contained">Go Now</Button>}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title={monthReport ? monthReport[0]?.name : ''}
              percent={monthReport ? monthReport[0]?.percent : 0}
              total={monthReport ? monthReport[0]?.total : 0}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title={monthReport ? monthReport[1]?.name : ''}
              percent={monthReport ? monthReport[1]?.percent : 0}
              total={monthReport ? monthReport[1]?.total : 0}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title={monthReport ? monthReport[2]?.name : ''}
              percent={monthReport ? monthReport[2]?.percent : 0}
              total={monthReport ? monthReport[2]?.total : 0}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <AppWidgetSummary
              title={monthReport ? monthReport[3]?.name : ''}
              percent={monthReport ? monthReport[3]?.percent : 0}
              total={monthReport ? monthReport[3]?.total : 0}
              chartColor={theme.palette.chart.red[3]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
