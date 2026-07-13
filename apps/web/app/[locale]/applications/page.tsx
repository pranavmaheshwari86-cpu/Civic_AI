import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const applications = [
  { id: "RC-2026-8942", title: "Ration Card Renewal", status: "In Progress", color: "blue", submitted: "Oct 12, 2026", action: "View Details", Icon: "Clock" },
  { id: "DC-2026-1105", title: "Domicile Certificate", status: "Approved", color: "green", submitted: "Sep 28, 2026", action: "Download", Icon: "CheckCircle2" },
  { id: "TL-2026-4431", title: "Trade License Registration", status: "Action Required", color: "red", submitted: "Oct 14, 2026", action: "Upload Documents", Icon: "AlertCircle" },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-500" },
  green: { bg: "bg-green-500/10", text: "text-green-500" },
  red: { bg: "bg-red-500/10", text: "text-red-500" },
};

const IconMap = { Clock, CheckCircle2, AlertCircle };

export default function ApplicationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground text-lg">
          Track and manage your government service applications and requests.
        </p>
      </div>
      <div className="grid gap-6">
        {applications.map((app) => {
          const Icon = IconMap[app.Icon as keyof typeof IconMap];
          const c = colorMap[app.color];
          return (
            <div key={app.id} className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}>
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{app.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">Application ID: {app.id}</p>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className={`flex items-center gap-1.5 ${c.text}`}>
                    <Icon className="w-4 h-4" />
                    {app.status}
                  </span>
                  <span className="text-muted-foreground">Submitted: {app.submitted}</span>
                </div>
              </div>
              <button type="button" className="w-full sm:w-auto px-6 py-2.5 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors">
                {app.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}