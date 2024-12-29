// app/alerts/page.tsx
import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, TrendingUp, TrendingDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AlertsPage() {
  // This would typically come from your backend
  const alerts = [
    {
      id: 1,
      type: "price_movement",
      title: "Price Alert",
      description: "AAPL up 5% in the last hour",
      icon: TrendingUp,
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      type: "news",
      title: "Breaking News",
      description: "Major acquisition announced in tech sector",
      icon: Bell,
      timestamp: new Date().toISOString(),
    },
    // Add more alerts as needed
  ]

  return (
    <MainNav>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Market Alerts</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const Icon = alert.icon
                    return (
                      <Alert key={alert.id}>
                        <Icon className="h-4 w-4" />
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>
                          {alert.description}
                        </AlertDescription>
                      </Alert>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Alert Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add alert settings here */}
                <p className="text-muted-foreground">
                  Configure your alert preferences and thresholds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainNav>
  )
}