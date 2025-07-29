import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const DataTable = ({ columns, data, onEdit, onDelete }) => (
  <TableContainer
    sx={{
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255,255,255,0.4)",
      borderRadius: "20px",
      "& .MuiTableHead-root": {
        "& .MuiTableCell-root": {
          background: "rgba(0,96,100,0.8)",
          fontWeight: 600,
          borderBottom: "2px solid rgba(0,96,100,0.2)",
        },
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          "&:nth-of-type(even)": {
            background: "rgba(255,255,255,0.3)",
          },
          "&:hover": {
            background: "rgba(0,172,193,0.1)",
          },
        },
      },
    }}
  >
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.key} sx={{ fontWeight: 600 }}>
              {column.label}
            </TableCell>
          ))}
          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                sx={{ fontWeight: column.bold ? 500 : "normal" }}
              >
                {column.render ? column.render(row) : row[column.key]}
              </TableCell>
            ))}
            <TableCell>
              <IconButton
                onClick={() => onEdit(row)}
                sx={{
                  color: "#00ACC1",
                  "&:hover": { background: "rgba(0,172,193,0.1)" },
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => onDelete(row)}
                sx={{
                  color: "#f44336",
                  "&:hover": { background: "rgba(244,67,54,0.1)" },
                }}
              >
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DataTable;
