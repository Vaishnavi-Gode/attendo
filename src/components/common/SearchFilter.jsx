import { Grid, TextField, Autocomplete } from '@mui/material';

const SearchFilter = ({ 
  searchColumn, 
  setSearchColumn, 
  searchTerm, 
  setSearchTerm, 
  searchOptions, 
  columnOptions 
}) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    <Grid item xs={12} md={4}>
      <TextField
        select
        fullWidth
        label="Search Column"
        value={searchColumn}
        onChange={(e) => { setSearchColumn(e.target.value); setSearchTerm(''); }}
        SelectProps={{ native: true }}
      >
        {columnOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
    </Grid>
    <Grid item xs={12} md={8}>
      <Autocomplete
        freeSolo
        options={[...new Set(searchOptions)]}
        value={searchTerm}
        onInputChange={(event, newValue) => setSearchTerm(newValue || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`Search by ${searchColumn === 'all' ? 'any column' : searchColumn}...`}
            fullWidth
          />
        )}
      />
    </Grid>
  </Grid>
);

export default SearchFilter;