"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username is required" }).max(20),
  roomId: z.string().min(2, { message: "Room ID is required" }).max(20),
});

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      roomId: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("username", data.username.trim());
    newSearchParams.set("roomId", data.roomId.trim());

    router.push(`/chat?${newSearchParams.toString()}`);
  });

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl text-center mb-4">Join room</h1>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 min-w-52"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input type="text" placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input type="text" placeholder="Room" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="min-w-32">
              Join
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
