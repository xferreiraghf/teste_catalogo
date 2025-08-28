import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search, Filter, X, Grid3X3 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductFiltersProps {
  onFiltersChange: (filters: { referencias?: string[], mostrar_sem_estoque?: boolean }) => void;
  showOutOfStock: boolean;
  selectedReferences: string[];
  isLoading: boolean;
}

export default function ProductFilters({
  onFiltersChange,
  showOutOfStock,
  selectedReferences,
  isLoading
}: ProductFiltersProps) {
  const [references, setReferences] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loadingReferences, setLoadingReferences] = useState(false);

  // Obter URL da API das variáveis de ambiente
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadReferences();
  }, [showOutOfStock]);

  const loadReferences = async () => {
    setLoadingReferences(true);
    try {
      // Buscar todas as referências
      const referencesResponse = await fetch(`${API_URL}/produtos/filtros/referencias`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (!referencesResponse.ok) {
        console.error('Erro na resposta da API:', referencesResponse.status, referencesResponse.statusText);
        setLoadingReferences(false);
        return;
      }

      const referencesData = await referencesResponse.json();
      let availableReferences = referencesData.referencias || [];

      // Se não deve mostrar produtos indisponíveis, filtrar apenas os disponíveis
      if (!showOutOfStock) {
        // Buscar produtos disponíveis para filtrar as referências
        const productsResponse = await fetch(`${API_URL}/produtos?mostrar_sem_estoque=false&limit=1000`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const availableProductRefs = new Set(
            (productsData.produtos || [])
              .filter(product => product.produto_disponivel === 'SIM')
              .map(product => product.itempai)
          );
          availableReferences = availableReferences.filter(ref => availableProductRefs.has(ref));
          console.log('Referências filtradas (apenas disponíveis):', availableReferences.length);
        }
      }

      console.log('Referências finais:', availableReferences.length);
      setReferences(availableReferences);
    } catch (error) {
      console.error('Erro ao carregar referências:', error);
    }
    setLoadingReferences(false);
  };

  const handleReferenceSelect = (reference: string) => {
    const newReferences = selectedReferences.includes(reference)
      ? selectedReferences.filter(ref => ref !== reference)
      : [...selectedReferences, reference];
    
    onFiltersChange({
      referencias: newReferences,
      mostrar_sem_estoque: showOutOfStock
    });
    setIsOpen(false);
  };

  const handleRemoveReference = (reference: string) => {
    const newReferences = selectedReferences.filter(ref => ref !== reference);
    onFiltersChange({
      referencias: newReferences,
      mostrar_sem_estoque: showOutOfStock
    });
  };

  const handleStockToggle = (checked: boolean) => {
    onFiltersChange({
      referencias: selectedReferences,
      mostrar_sem_estoque: checked
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      referencias: [],
      mostrar_sem_estoque: false
    });
  };

  const filteredReferences = references.filter(ref =>
    ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
        {(selectedReferences.length > 0 || showOutOfStock) && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Reference Search */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Filtrar por Referência
          </label>
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-12 px-4"
                disabled={loadingReferences}
              >
                <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                {loadingReferences ? 'Carregando...' : 'Buscar referências...'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Digite para buscar..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>Nenhuma referência encontrada.</CommandEmpty>
                  <CommandGroup>
                    {filteredReferences.map((reference) => (
                      <CommandItem
                        key={reference}
                        onSelect={() => handleReferenceSelect(reference)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <Checkbox
                            checked={selectedReferences.includes(reference)}
                            className="mr-2"
                          />
                          <span className="flex-1">{reference}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Selected References */}
          {selectedReferences.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedReferences.map((reference) => (
                <Badge
                  key={reference}
                  variant="secondary"
                  className="bg-primary/10 text-primary border border-primary/20 px-3 py-1"
                >
                  {reference}
                  <button
                    onClick={() => handleRemoveReference(reference)}
                    className="ml-2 hover:text-primary/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Stock Toggle */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <label
                  htmlFor="show-complete-grid"
                  className="text-sm font-semibold text-foreground cursor-pointer block"
                >
                  Mostrar todas as grades
                </label>
              </div>
            </div>
            <Switch
              id="show-complete-grid"
              checked={showOutOfStock}
              onCheckedChange={handleStockToggle}
              disabled={isLoading}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
