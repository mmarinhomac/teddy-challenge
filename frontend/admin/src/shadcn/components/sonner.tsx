import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          title: "!text-lg !leading-6 !text-gray-600",
          toast: "w-full md:!w-[400px] !shadow-xl",
          closeButton: "!bg-white !hover:bg-white",

          info: "!text-blue-500",
          success: "!text-green-500",
          error: "!text-red-500",
          warning: "!text-amber-500",
        },
        closeButton: true,
      }}
      position="top-right"
      {...props}
    />
  );
};

export { Toaster };
