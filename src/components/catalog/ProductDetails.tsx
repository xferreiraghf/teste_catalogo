import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, Hash, ZoomIn, X } from "lucide-react";
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

interface ProductDetailsProps {
  productRef: string;
  onBack: () => void;
}

export default function ProductDetails({ productRef, onBack }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    if (productRef) {
      loadProductDetails(productRef);
    }
  }, [productRef]);

  const formatPrice = (price: number) => {
    return price?.toFixed(2).replace('.', ',');
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const loadProductDetails = async (ref: string) => {
    setIsLoading(true);
    setError(null);
    
	try {
		const response = await fetch(`${API_URL}/produtos/${ref}`);  /* REDIRECT DO IP */  
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else if (response.status === 404) {
        setError('Produto não encontrado');
      } else {
        setError('Erro ao carregar detalhes do produto');
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      setError('Erro de conexão com o servidor');
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-center py-20"
      >
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{error}</h3>
        <p className="text-muted-foreground mb-6">
          Não foi possível carregar os detalhes deste produto.
        </p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Catálogo
        </Button>
      </motion.div>
    );
  }

  const isAvailable = product?.produto_disponivel === 'SIM';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Detalhes do Produto</h1>
          <p className="text-muted-foreground">Informações completas</p>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-0 shadow-lg relative group">
            <div className="aspect-square bg-muted relative">
              {product?.imagem_url ? (
                <>
                  <img
                    src={product.imagem_url}
                    alt={product.itempai}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) nextElement.style.display = 'flex';
                    }}
                  />
                  {/* Zoom Button */}
                  <Button
                    onClick={() => setIsZoomOpen(true)}
                    size="sm"
                    variant="secondary"
                    className="absolute top-4 right-4 w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/80 backdrop-blur-sm hover:bg-background/90 border shadow-lg"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </>
              ) : null}
              <div 
                className="absolute inset-0 flex items-center justify-center text-muted-foreground"
                style={{ display: product?.imagem_url ? 'none' : 'flex' }}
              >
                <div className="text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Imagem não disponível</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            {formatDescription(product?.descricao || '')}
          </h2>

          {/* Reference and Availability */}
          <div className="flex items-center gap-3">
             <Badge 
                variant="outline" 
                className="font-mono text-lg bg-muted/50 px-4 py-2"
              >
                <Hash className="w-4 h-4 mr-2" />
                {product?.itempai}
              </Badge>
              <Badge 
                className={`${
                  isAvailable 
                    ? 'bg-success/10 text-success border-success/20 hover:bg-success/10 hover:text-success' 
                    : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive'
                } border px-4 py-2 text-base`}
              >
                {isAvailable ? 'Grade completa' : 'Grade quebrada'}
              </Badge>
          </div>
            
          {/* Price */}
          <Card className="bg-muted/50 border-muted">
            <CardContent className="p-6">
                <div className="space-y-2">
                    {product && product.precomax > product.precomin && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg text-price-original line-through">
                                De R$ {formatPrice(product.precomax)}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-price-sale">Por</span>
                        <span className="text-3xl font-bold text-price-sale">
                            R$ {product && formatPrice(product.precomin)}
                        </span>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Informações Adicionais
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Referência</p>
                  <p className="font-mono font-medium">{product?.itempai}</p>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {isAvailable ? 'Grade completa' : 'Grade quebrada'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomOpen && product?.imagem_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
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
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
