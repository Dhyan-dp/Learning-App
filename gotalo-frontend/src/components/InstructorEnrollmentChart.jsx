import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
  } from 'recharts';
  
  const InstructorEnrollmentChart = ({ data }) => {
    return (
      <div className="w-full h-96 bg-white shadow-md rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Course-wise Enrollment</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default InstructorEnrollmentChart;
  