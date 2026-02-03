import { Button } from "@/components/ui/button";
import { FileQuestion, MoveLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotFoundPageProps {
  id?: string | number;
  entityName?: string;
  backUrl?: string;
}

const NotFoundPage = ({
  id,
  entityName = "Item",
  backUrl,
}: NotFoundPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 text-center animate-in fade-in duration-500">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 border border-border shadow-sm">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      <div className="space-y-2 max-w-md px-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {entityName} Not Found
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Sorry, we couldn't find the {entityName.toLowerCase()} you are looking
          for.
          {id && (
            <span className="block mt-1 font-mono text-xs bg-muted py-1 px-2 rounded-md w-fit mx-auto border border-border/50">
              ID: {id}
            </span>
          )}
        </p>
        <p className="text-muted-foreground text-sm">
          It might have been deleted, moved, or the link is incorrect.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2 min-w-35"
        >
          <MoveLeft className="h-4 w-4" />
          Go Back
        </Button>

        <Button
          variant="default"
          onClick={() => navigate(backUrl || "/dashboard")}
          className="gap-2 min-w-35 text-foreground"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
