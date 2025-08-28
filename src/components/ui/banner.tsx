import React, { useState } from 'react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Image as ImageIcon, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';

interface BannerProps {
  imageUrl?: string;
  className?: string;
  editable?: boolean;
}

export function Banner({ imageUrl, className = "", editable = true }: BannerProps) {
  const [showInfo, setShowInfo] = useState(false);

  const defaultBanner = (
    <div className="relative w-full aspect-[1920/512] bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10" />
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              Banner Promocional
            </h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-md">
              Adicione aqui seu banner promocional para destacar ofertas e produtos
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const bannerContent = imageUrl ? (
    <div className="relative w-full aspect-[1920/512] rounded-none overflow-hidden">
      <img
        src={imageUrl}
        alt="Banner promocional"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  ) : defaultBanner;

  // Se não for editável, apenas retorna o banner
  if (!editable) {
    return (
      <div className={`w-full ${className}`}>
        {bannerContent}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Banner Display sem clique ou drag & drop */}
        <div className="relative transition-all duration-300">
          {bannerContent}
        </div>

        {/* Painel de informações */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 z-50 mt-2"
            >
              <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      Especificações do Banner
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowInfo(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <Badge variant="outline" className="mb-1">Desktop</Badge>
                        <span className="font-medium text-primary">1920 × 512px</span>
                        <span className="text-xs text-muted-foreground mt-1">Recomendado</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <Badge variant="outline" className="mb-1">Tablet</Badge>
                        <span className="font-medium text-primary">1024 × 384px</span>
                        <span className="text-xs text-muted-foreground mt-1">Mínimo</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <Badge variant="outline" className="mb-1">Mobile</Badge>
                        <span className="font-medium text-primary">768 × 256px</span>
                        <span className="text-xs text-muted-foreground mt-1">Mínimo</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground">
                        <strong>Dica:</strong> Use uma proporção de 16:9 ou 3.75:1 para melhor resultado em todos os dispositivos.
                        Formatos aceitos: JPG, PNG, WebP (máx. 5MB)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
