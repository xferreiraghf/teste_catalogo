import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, ZoomIn, X } from "lucide-react";
import { motion } from "framer-motion";
import { formatDescription } from "@/lib/utils";

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

interface ProductCardProps {
  product: Product;
  onViewDetails: (itempai: string) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const isAvailable = product.produto_disponivel === 'SIM';

  const formatPrice = (price: number) => {
    return price?.toFixed(2).replace('.', ',');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group h-full overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-0 bg-card">
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-muted relative">
            {product.imagem_url ? (
              <>
                <img
                  src={product.imagem_url}
                  alt={product.itempai}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) nextElement.style.display = 'flex';
                  }}
                />
                {/* Zoom Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomOpen(true);
                  }}
                  size="sm"
                  variant="secondary"
                  className="absolute top-3 left-3 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/80 backdrop-blur-sm hover:bg-background/90 border shadow-lg z-10"
                >
                  <ZoomIn className="w-3 h-3" />
                </Button>
              </>
            ) : null}
            <div 
              className="absolute inset-0 flex items-center justify-center text-muted-foreground"
              style={{ display: product.imagem_url ? 'none' : 'flex' }}
            >
              <div className="text-center">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sem imagem</p>
              </div>
            </div>
          </div>

          {/* Overlay with action button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <Button
              onClick={() => onViewDetails(product.itempai)}
              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-background text-foreground hover:bg-muted shadow-lg"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>

          {/* Availability badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              className={`${
                isAvailable 
                  ? 'bg-success/20 text-success border-success/30 hover:bg-success/20 hover:text-success' 
                  : 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/20 hover:text-destructive'
              } border shadow-sm`}
            >
              {isAvailable ? 'Grade completa' : 'Grade quebrada'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            {/* Reference */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-mono bg-muted/50">
                {product.itempai}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem] leading-6">
              {formatDescription(product.descricao)}
            </h3>

            {/* Price */}
            <div className="pt-2 min-h-[3rem]">
              {product.precomax > product.precomin && (
                <p className="text-sm text-price-original line-through">
                  De R$ {formatPrice(product.precomax)}
                </p>
              )}
              <p className="text-2xl font-bold text-price-sale">
                Por R$ {formatPrice(product.precomin)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Zoom Modal */}
      {isZoomOpen && product.imagem_url && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
          >
            {/* Close Button */}
            <Button
              onClick={() => setIsZoomOpen(false)}
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 z-10 w-10 h-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 border shadow-lg"
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Zoomed Image */}
            <img
              src={product.imagem_url}
              alt={product.itempai}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-background/10 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
        </motion.div>,
        document.body
      )}
    </motion.div>
  );
}
