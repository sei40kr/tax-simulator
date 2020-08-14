import {
  AppBar,
  Box,
  Container,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import Form from './components/calculationInput/Form';
import CalculationResult from './components/calculationResult/CalculationResult';

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">個人事業 控除シミュレーター</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={6}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Form />
            </Grid>
            <Grid item xs={6}>
              <CalculationResult />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default App;
