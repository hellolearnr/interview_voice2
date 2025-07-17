import { Button } from "@/components/ui/button";
import Image from "next/image";

/*export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h2>page is loading</h2>  </div>
  );
}
  */

export default function TestPage() {
  return <div className="bg-red-500 text-white p-8">
    <h2>Tailwind Test</h2>
    <Button>Submit</Button>
    </div>
}