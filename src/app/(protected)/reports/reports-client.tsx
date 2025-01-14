"use client";

import { memo, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { labels } from "@/config/labels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle,
  BarChart3,
  Box,
  Users,
  Activity
} from "lucide-react";

interface ReportsClientProps {
  data: {
    transactions: any[];
    products: any[];
    categories: any[];
    suppliers: any[];
  };
}

const ReportsClient = memo(function ReportsClient({ data }: ReportsClientProps) {
  const stats = useMemo(() => {
    const totalProducts = data.products.length;
    const totalCategories = data.categories.length;
    const totalSuppliers = data.suppliers.length;
    const lowStockProducts = data.products.filter(p => p.quantity <= p.minQuantity);
    
    const stockValue = data.products.reduce((acc, product) => {
      return acc + (product.price * product.quantity);
    }, 0);

    const transactionStats = data.transactions.reduce((acc, transaction) => {
      const total = transaction.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (transaction.type === "STOCK_IN") {
        acc.stockIn += total;
      } else if (transaction.type === "STOCK_OUT") {
        acc.stockOut += total;
      }
      
      return acc;
    }, { stockIn: 0, stockOut: 0 });

    return {
      totalProducts,
      totalCategories,
      totalSuppliers,
      lowStockProducts: lowStockProducts.length,
      stockValue,
      ...transactionStats,
    };
  }, [data]);

  const topProducts = useMemo(() => {
    return [...data.products]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [data.products]);

  const topCategories = useMemo(() => {
    return [...data.categories]
      .sort((a, b) => b._count.products - a._count.products)
      .slice(0, 5);
  }, [data.categories]);

  const statusStats = useMemo(() => {
    return data.products.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [data.products]);

  const categoryStats = useMemo(() => {
    return data.categories.reduce((acc, category) => {
      const products = data.products.filter(p => p.categoryId === category.id);
      const value = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      
      acc[category.name] = {
        count: category._count.products,
        value
      };
      
      return acc;
    }, {} as Record<string, { count: number; value: number }>);
  }, [data.categories, data.products]);

  const supplierStats = useMemo(() => {
    return data.suppliers.reduce((acc, supplier) => {
      const products = data.products.filter(p => p.supplierId === supplier.id);
      const value = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      
      acc[supplier.name] = {
        count: supplier._count.products,
        value
      };
      
      return acc;
    }, {} as Record<string, { count: number; value: number }>);
  }, [data.suppliers, data.products]);

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total em Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.stockValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalProducts} produtos em stock
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Entradas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.stockIn)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor total das entradas
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Saídas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.stockOut)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor total das saídas
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Baixo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Produtos com stock baixo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status and Top Products */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Estado dos Produtos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusStats).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'GOOD' ? 'bg-green-500' :
                      status === 'REASONABLE' ? 'bg-yellow-500' :
                      status === 'POOR' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <p className="font-medium">{labels.products.statuses[status as keyof typeof labels.products.statuses]}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{count} produtos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Top 5 Produtos em Stock</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.quantity} unidades</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.price * product.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories and Suppliers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Estatísticas por Categoria</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([name, stats]) => (
                <div key={name} className="flex items-center justify-between group">
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.count} produtos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(stats.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Estatísticas por Fornecedor</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(supplierStats).map(([name, stats]) => (
                <div key={name} className="flex items-center justify-between group">
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.count} produtos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(stats.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export { ReportsClient }; 