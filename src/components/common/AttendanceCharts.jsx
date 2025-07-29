import { Grid, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { colors } from "@theme";
import GlassCard from "./GlassCard";

const AttendanceCharts = ({ stats, userRole }) => {
  const cardStyle = {
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0,172,193,0.15)",
    },
  };

  if (userRole === "teacher") {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <GlassCard sx={cardStyle}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Today&apos;s Attendance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.todayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {stats.todayPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} students`, name]}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="recharts-text"
                  fontSize="14"
                  fontWeight="600"
                  fill="#666"
                >
                  Today&apos;s
                </text>
                <text
                  x="50%"
                  y="50%"
                  dy="16"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="recharts-text"
                  fontSize="12"
                  fill="#999"
                >
                  Attendance
                </text>
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <GlassCard sx={cardStyle}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Today&apos;s Attendance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.todayPieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {stats.todayPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} students`, name]}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="recharts-text"
                fontSize="14"
                fontWeight="600"
                fill="#666"
              >
                Today&apos;s
              </text>
              <text
                x="50%"
                y="50%"
                dy="16"
                textAnchor="middle"
                dominantBaseline="middle"
                className="recharts-text"
                fontSize="12"
                fill="#999"
              >
                Attendance
              </text>
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <GlassCard sx={cardStyle}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Class-wise Attendance Today
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.classWiseToday}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="present"
                stackId="a"
                fill={colors.accent}
                name="Present"
              />
              <Bar
                dataKey="absent"
                stackId="a"
                fill={colors.highlight}
                name="Absent"
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </Grid>
    </Grid>
  );
};

export default AttendanceCharts;
