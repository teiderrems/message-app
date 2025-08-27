import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { NavLink, useNavigate } from "react-router";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import useLocalStorage from "@/hooks/use-local-storage";

const registerFormSchema = z.object({
  email: z.email().max(50).nonempty("Email is required"),
  password: z.string().min(8).max(100).nonempty("Password is required"),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, mutateAsync, error } = useMutation(
    trpc.user.addUser.mutationOptions()
  );

  const navigate = useNavigate();

  const { setValue } = useLocalStorage();
  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      const res = await mutateAsync(values);
      if (res && res.email) {
        toast("Event has been created." + res?.email, {
          description: "Please check your inbox for a confirmation email.",
          duration: 5000,
          position: "top-right",
          closeButton: true,
        });
        setValue("user", res);
        navigate("/chats");
      }
      form.reset();
    } catch {
      console.error(error);
      toast(error?.message, {
        description: "Please try again.",
        duration: 5000,
        position: "top-right",
        closeButton: true,
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome</h1>
                  <p className="text-muted-foreground text-balance">
                    Create your Messenger account
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel className="text-lg">Email</FormLabel>
                      <FormControl className="h-12">
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel className="text-lg">Password</FormLabel>
                      <FormControl className="h-12">
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 text-gray-900 hover:text-gray-600/90 active:text-gray-900/90"
                >
                  Sign up
                </Button>
                <div className="text-center text-sm">
                  You have an account?{" "}
                  <NavLink to="/login" className="underline underline-offset-4">
                    Sign in
                  </NavLink>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/login.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <NavLink to="#">Terms of Service</NavLink> and{" "}
        <NavLink to="#">Privacy Policy</NavLink>.
      </div>
    </div>
  );
}
