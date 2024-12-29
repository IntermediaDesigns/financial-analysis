"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, TrendingUp, BookMarked, Search } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 border-r p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Market Watch</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <BookMarked className="mr-2 h-4 w-4" />
              Watchlist
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial News</h1>
            <p className="text-muted-foreground">Stay updated with market movements</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search news..." className="pl-8 w-64" />
            </div>
            <Button>Refresh</Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Example Article Card */}
              <ArticleCard
                title="Market Analysis: Tech Stocks Surge"
                description="Technology sector leads market gains as AI companies report strong earnings"
                sentiment="positive"
                category="Technology"
                timestamp="2h ago"
                source="Financial Times"
              />
              {/* Add more ArticleCards here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Alerts Sidebar */}
      <div className="hidden xl:block w-72 border-l p-6">
        <h3 className="font-semibold mb-4">Market Alerts</h3>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-4">
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertTitle>Market Movement</AlertTitle>
              <AlertDescription>
                S&P 500 up 1.2% in early trading
              </AlertDescription>
            </Alert>
            {/* Add more alerts here */}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const ArticleCard = ({ title, description, sentiment, category, timestamp, source }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={sentiment === "positive" ? "success" : "destructive"}>
            {sentiment}
          </Badge>
        </div>
        <CardDescription>{source} • {timestamp}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant="outline">{category}</Badge>
        <Button variant="ghost" size="sm">Read More</Button>
      </CardFooter>
    </Card>
  );
};

export default Dashboard;