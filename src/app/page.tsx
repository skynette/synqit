import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <>
      Hello World
      <Button
        variant="outline"
        size="lg"
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Click me
      </Button>
    </>
  );
}
