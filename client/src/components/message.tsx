import { cn } from "@/lib/utils";

export type MessageData = {
  user: {
    name: string;
  };
  message: string;
};

export default function Message({
  message: { message, user },
  isFromMe,
}: {
  message: MessageData;
  isFromMe: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-4 whitespace-pre-wrap",
        isFromMe ? "items-end" : "items-start"
      )}
    >
      <span className="text-xs font-semibold px-3 text-muted-foreground">
        {user.name}
      </span>
      <span
        className={cn(
          "bg-accent p-3 rounded-md max-w-xs flex flex-col",
          isFromMe ? "bg-primary" : "bg-accent",
          isFromMe && "text-slate-50"
        )}
      >
        {message}
      </span>
    </div>
  );
}
