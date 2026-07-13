import { BarChart2, TrendingUp, Users, Activity } from "lucide-react";

const stats = [
  { label: "Total Applications", value: "1,248", change: "+12%", icon: BarChart2, trend: "up" },
  { label: "Active Schemes", value: "42", change: "+4%", icon: Activity, trend: "up" },
  { label: "Citizens Reached", value: "89.2k", change: "+18%", icon: Users, trend: "up" },
  { label: "Resolution Rate", value: "94%", change: "+2%", icon: TrendingUp, trend: "up" },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-muted-foreground text-lg">
          Insights and metrics for the Civic AI ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-center">
        <BarChart2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Detailed Reports Coming Soon</h2>
        <p className="text-muted-foreground max-w-md">
          We are currently aggregating data across multiple civic departments. 
          Advanced visualizations and predictive models will be available here shortly.
        </p>
      </div>
    </div>
  );
}
