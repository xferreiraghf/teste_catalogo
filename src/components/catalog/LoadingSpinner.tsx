import React from 'react';
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Carregando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}