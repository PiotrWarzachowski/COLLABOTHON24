// components/ui/toggle-group.tsx

"use client"

import * as RadixToggleGroup from '@radix-ui/react-toggle-group'

export function ToggleGroup({ children, ...props }) {
  return (
    <RadixToggleGroup.Root {...props}>
      {children}
    </RadixToggleGroup.Root>
  )
}

export function ToggleGroupItem({ children, ...props }) {
  return (
    <RadixToggleGroup.Item {...props}>
      {children}
    </RadixToggleGroup.Item>
  )
}
