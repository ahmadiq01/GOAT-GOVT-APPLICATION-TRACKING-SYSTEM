import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';

// project imports
import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid
            item
            xs={12} sm={6} md={4} lg={4} // Ensure they take up space on smaller screens as well
            style={{ flex: 1 }}
          >
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid
            item
            xs={12} sm={6} md={4} lg={4} // Same as EarningCard for consistency
            style={{ flex: 1 }}
          >
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          {/* Use Grid to take up the rest of the space and make cards fill the row */}
          <Grid item xs />
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8} style={{ flex: 1 }}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
