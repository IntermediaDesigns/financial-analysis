import { MainNav } from "@/components/main-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";

export default function WatchlistPage() {
  // This would typically come from your backend
  const watchlistItems = [
    {
      id: 1,
      symbol: "AAPL",
      name: "Apple Inc.",
      price: "170.50",
      change: "+2.5",
      volume: "62.3M",
    },
    {
      id: 2,
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: "325.20",
      change: "-1.2",
      volume: "45.1M",
    },
    // Add more stocks as needed
  ];

  return (
    <MainNav>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Watchlist</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search symbols..." className="pl-8 w-64" />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Symbol
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Watchlist</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change %</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlistItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.symbol}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell
                      className={
                        item.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {item.change}%
                    </TableCell>
                    <TableCell>{item.volume}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainNav>
  );
}
