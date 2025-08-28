import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from './ProductCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface Product {
  itempai: string;
  precomin: number;
  precomax: number;
  title: string;
  descricao: string;
  contentkey: string;
  produto_disponivel: string;
  imagem_url: string;
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onViewDetails: (itempai: string) => void;
}

export default function ProductGrid({ products, isLoading, onViewDetails }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-2 px-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-muted-foreground max-w-md">
          Não encontramos produtos que correspondam aos seus filtros. 
          Tente ajustar os critérios de busca.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.itempai}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ProductCard 
              product={product} 
              onViewDetails={onViewDetails}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}