'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'w-full rounded-md bg-muted text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Enhanced Tab Components with additional variants

interface TabsListVariantProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: 'default' | 'pills' | 'underline' | 'buttons';
  size?: 'sm' | 'md' | 'lg';
}

const TabsListVariant = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListVariantProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const variants = {
    default:
      'inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
    pills:
      'inline-flex items-center justify-center rounded-full bg-muted p-1 text-muted-foreground',
    underline:
      'inline-flex items-center justify-center border-b border-border bg-transparent text-muted-foreground',
    buttons:
      'inline-flex items-center justify-center gap-2 bg-transparent text-muted-foreground',
  };

  const sizes = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
TabsListVariant.displayName = 'TabsListVariant';

interface TabsTriggerVariantProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: 'default' | 'pills' | 'underline' | 'buttons';
  size?: 'sm' | 'md' | 'lg';
}

const TabsTriggerVariant = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerVariantProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const variants = {
    default:
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
    pills:
      'inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
    underline:
      'inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground',
    buttons:
      'inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
TabsTriggerVariant.displayName = 'TabsTriggerVariant';

// Icon Tab Components
interface IconTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const IconTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  IconTabsTriggerProps
>(({ className, icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  >
    {icon && <span className="w-4 h-4">{icon}</span>}
    {children}
  </TabsPrimitive.Trigger>
));
IconTabsTrigger.displayName = 'IconTabsTrigger';

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsListVariant,
  TabsTriggerVariant,
  IconTabsTrigger,
};
