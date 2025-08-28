import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { RefreshCw, Package2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import bannerLimpo from '@/assets/banner-limpo.jpg';

import ProductFilters from '../components/catalog/ProductFilters';
import ProductGrid from '../components/catalog/ProductGrid';
import ProductDetails from '../components/catalog/ProductDetails';
import LoadingSpinner from '../components/catalog/LoadingSpinner';

const API_BASE = import.meta.env.VITE_API_URL; /* REDIRECT DO IP */
const DEFAULT_LIMIT = 160;

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

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [bannerImage, setBannerImage] = useState<string | null>(bannerLimpo);

  const loadProducts = useCallback(async (filters: { referencias?: string[], mostrar_sem_estoque?: boolean } = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.referencias && filters.referencias.length > 0) {
        params.append('itempai', filters.referencias.join(','));
      }
      
      if (filters.mostrar_sem_estoque !== undefined) {
        params.append('mostrar_sem_estoque', filters.mostrar_sem_estoque.toString());
      }
      
      params.append('limit', limit.toString());

      const response = await fetch(`${API_BASE}/produtos?${params}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Sort by itempai as requested
        const sortedProducts = (data.produtos || []).sort((a: Product, b: Product) => 
          a.itempai.localeCompare(b.itempai)
        );
        setProducts(sortedProducts);
        setTotal(data.total || 0);
      } else if (response.status === 500) {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        setError('Erro ao carregar produtos. Verifique sua conexão.');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    }

    setIsLoading(false);
  }, [limit]);

  useEffect(() => {
    loadProducts({
      referencias: selectedReferences,
      mostrar_sem_estoque: showOutOfStock
    });
  }, [loadProducts, selectedReferences, showOutOfStock]);

  const handleFiltersChange = (filters: { referencias?: string[], mostrar_sem_estoque?: boolean }) => {
    setSelectedReferences(filters.referencias || []);
    setShowOutOfStock(filters.mostrar_sem_estoque || false);
  };

  const handleViewDetails = (productRef: string) => {
    setSelectedProduct(productRef);
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
  };

  const handleRefresh = () => {
    loadProducts({
      referencias: selectedReferences,
      mostrar_sem_estoque: showOutOfStock
    });
  };

  const loadMore = () => {
    setLimit(prev => prev + DEFAULT_LIMIT);
  };

  const handleBannerImageChange = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setBannerImage(imageUrl);
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-catalog-gradient-start via-background to-catalog-gradient-end p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ProductDetails 
            productRef={selectedProduct}
            onBack={handleBackToCatalog}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-catalog-gradient-start via-background to-catalog-gradient-end overflow-x-hidden">
      {/* Banner - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 w-full"
      >
        <Banner
          imageUrl={bannerImage}
          onImageChange={handleBannerImageChange}
          editable={true}
        />
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">


        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            showOutOfStock={showOutOfStock}
            selectedReferences={selectedReferences}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-8 text-center"
          >
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package2 className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Ops! Algo deu errado
            </h3>
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </Button>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
          />
        </motion.div>

        {/* Load More */}
        {!isLoading && products.length > 0 && products.length < total && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Button
              onClick={loadMore}
              variant="outline"
              size="lg"
              className="px-8 py-3 rounded-xl"
            >
              Carregar Mais Produtos
              <Badge className="ml-2 bg-muted text-muted-foreground">
                {products.length} de {total}
              </Badge>
            </Button>
          </motion.div>
        )}

        {/* Loading More */}
        {isLoading && products.length > 0 && (
          <div className="mt-8">
            <LoadingSpinner message="Carregando mais produtos..." />
          </div>
        )}
      </div>
    </div>
  );
}
