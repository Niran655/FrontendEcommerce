import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import * as React from 'react';

function Media(props) {
  const { loading = false } = props;

  return (
    <Grid container wrap="nowrap">
      {Array.from(new Array(3)).map((_, index) => (
        <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
          <Skeleton variant="rectangular" width={210} height={118} />
           <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
        </Box>
      ))}
    </Grid>
  );
}
Media.propTypes = {
  loading: PropTypes.bool,
};
export default function YouTube() {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Media loading />
      <Media />
    </Box>
  );
}