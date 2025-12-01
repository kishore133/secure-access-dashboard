import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ApplyLeaveModal from "@/components/ApplyLeaveModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleOpenModal = (leaveType?: string) => {
    setSelectedLeaveType(leaveType || "");
    setModalOpen(true);
  };

  // Sample data
  const departmentData = [
    { name: "Engineering", value: 89 },
    { name: "Marketing", value: 42 },
    { name: "Sales", value: 68 },
    { name: "HR", value: 28 },
    { name: "Finance", value: 35 },
    { name: "Operations", value: 52 },
  ];

  const leaveTypeData = [
    { name: "Annual Leave", value: 50, color: "#3B82F6" },
    { name: "Sick Leave", value: 27, color: "#10B981" },
    { name: "Personal Leave", value: 15, color: "#F59E0B" },
    { name: "Maternity/Paternity", value: 8, color: "#EF4444" },
  ];

  const monthlyTrendData = [
    { month: "Jan", value: 46 },
    { month: "Feb", value: 39 },
    { month: "Mar", value: 52 },
    { month: "Apr", value: 61 },
    { month: "May", value: 49 },
    { month: "Jun", value: 55 },
  ];

  const recentRequests = [
    {
      employee: "Emily Rodriguez",
      leaveType: "Annual",
      startDate: "2025-11-29",
      endDate: "2025-11-30",
      days: 2,
      status: "Pending",
      applied: "29/11/2025, 02:10:37",
    },
    {
      employee: "—",
      leaveType: "Annual",
      startDate: "2025-11-28",
      endDate: "2025-11-29",
      days: 2,
      status: "Pending",
      applied: "28/11/2025, 12:47:24",
    },
    {
      employee: "Sarah Johnson",
      leaveType: "Personal",
      startDate: "2025-11-27",
      endDate: "2025-11-29",
      days: 3,
      status: "Pending",
      applied: "28/11/2025, 12:25:19",
    },
    {
      employee: "Emily Rodriguez",
      leaveType: "Annual",
      startDate: "2025-11-28",
      endDate: "2025-11-30",
      days: 3,
      status: "Pending",
      applied: "28/11/2025, 12:24:00",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leave Management Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive overview of employee leave statistics and trends
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
            <h2 className="text-3xl font-bold">248</h2>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
            <h2 className="text-3xl font-bold">12</h2>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Approved This Month</p>
            <h2 className="text-3xl font-bold">45</h2>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Days/Employee</p>
            <h2 className="text-3xl font-bold">18.5</h2>
          </Card>

          <Card className="p-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Apply Leave</p>
            <Button onClick={() => handleOpenModal()}>Apply</Button>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Apply Leave Card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Apply Leave</h3>
              <RadioGroup 
                value={selectedLeaveType} 
                onValueChange={(value) => {
                  setSelectedLeaveType(value);
                  handleOpenModal(value);
                }}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="Annual" id="annual" />
                  <Label htmlFor="annual" className="cursor-pointer">Annual Leave</Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="Sick" id="sick" />
                  <Label htmlFor="sick" className="cursor-pointer">Sick Leave</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Personal" id="personal" />
                  <Label htmlFor="personal" className="cursor-pointer">Personal Leave</Label>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Bar Chart */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-6">Leave Requests by Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Pie Chart */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-6">Leave Types Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leaveTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leaveTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Monthly Trends & Recent Requests - Full Width */}
        <div className="space-y-6">
          {/* Line Chart - Monthly Leave Trends */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-6">Monthly Leave Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Leave Requests Table */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Recent Leave Requests</h3>
              <p className="text-sm text-muted-foreground">
                Complete overview of all leave requests and their status
              </p>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{request.employee}</TableCell>
                      <TableCell className="text-muted-foreground">{request.leaveType}</TableCell>
                      <TableCell className="text-muted-foreground">{request.startDate}</TableCell>
                      <TableCell className="text-muted-foreground">{request.endDate}</TableCell>
                      <TableCell className="text-muted-foreground">{request.days}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{request.applied}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      <ApplyLeaveModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialLeaveType={selectedLeaveType}
      />
    </div>
  );
}
