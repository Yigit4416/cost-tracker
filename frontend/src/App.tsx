import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    async function fetchTotal() {
      const res = await fetch("/api/expenses/total-spent");
      const data = await res.json();
      setTotalSpent(data.totalSpent);
    }

    fetchTotal();
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl justify-center px-4 pt-10 md:pt-14">
        <Card className="w-full max-w-md border-border bg-card shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Total Spent</CardTitle>
            <CardDescription className="text-muted-foreground">
              The total amount you spent...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-4xl font-semibold tracking-tight">
            ${totalSpent}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default App;
