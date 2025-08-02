import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { 
  Package, 
  PackageX, 
  AlertTriangle, 
  ImageOff, 
  Tag,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { get } from '~/services/apiService';
import { useAuthStore } from '~/store/auth-store';
import { useNavigate } from 'react-router';

interface IData {
  activeProducts: number
  disabledProducts : number
  lowStockProducts: number
  productsWithoutImages : number
  productsWithDiscount : number
}

export function meta(){
  return [
    {title: "Inicio"}
  ]
}

const Home = () => {
  const token = useAuthStore(s => s.token);
  const [stats, setStats] = useState<IData>({
    activeProducts: 0,
    disabledProducts: 0,
    lowStockProducts: 0,
    productsWithoutImages: 0,
    productsWithDiscount: 0
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await get<IData>({path : "home", token})
          
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Productos Activos",
      value: stats.activeProducts,
      description: "Productos disponibles para venta",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
      // trend: "+2.5%"
    },
    {
      title: "Productos Deshabilitados",
      value: stats.disabledProducts,
      description: "Productos fuera de catálogo",
      icon: PackageX,
      color: "text-red-600",
      bgColor: "bg-red-50",
      // trend: "-1.2%"
    },
    {
      title: "Stock Bajo",
      value: stats.lowStockProducts,
      description: "Productos con stock crítico",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      // trend: "0%"
    },
    {
      title: "Sin Imágenes",
      value: stats.productsWithoutImages,
      description: "Productos sin imagen asignada",
      icon: ImageOff,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      // trend: "0%"
    },
    {
      title: "Con Descuento",
      value: stats.productsWithDiscount,
      description: "Productos en promoción",
      icon: Tag,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      // trend: "+5.8%"
    }
  ];

  const StatCard = ({ title, value, description, icon: Icon, color, bgColor } : any) => (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-full ${bgColor}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? (
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                value
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          {/* <div className="text-right">
            <Badge 
              variant={trend.startsWith('+') ? 'default' : trend.startsWith('-') ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {trend}
            </Badge>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Inicio</h1>
          </div>
          <p className="text-gray-600">Resumen general de tu inventario de productos</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              {/* <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumen de Ventas
              </CardTitle> */}
              <CardDescription className="text-blue-100">
                Estadísticas de rendimiento general
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {loading ? (
                  <div className="h-8 w-24 bg-blue-400 rounded animate-pulse"></div>
                ) : (
                  `${stats.activeProducts + stats.productsWithDiscount} productos`
                )}
              </div>
              <p className="text-blue-100">Total de productos en catálogo activo</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado del Inventario
              </CardTitle>
              <CardDescription className="text-green-100">
                Salud general del inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {loading ? (
                  <div className="h-8 w-16 bg-green-400 rounded animate-pulse"></div>
                ) : (
                  stats.lowStockProducts === 0 ? "✓ Óptimo" : "⚠ Revisar"
                )}
              </div>
              <p className="text-green-100">
                {stats.lowStockProducts === 0 
                  ? "Todos los productos tienen stock adecuado"
                  : `${stats.lowStockProducts} productos requieren reposición`
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tu inventario de forma eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" onClick={() => navigate("/admin/products/add")}>
                <Package className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Añadir Producto</div>
                  <div className="text-sm text-gray-600">Agregar nuevo producto al inventario</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors" onClick={() => navigate("/admin/products")}>
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Revisar Stock</div>
                  <div className="text-sm text-gray-600">Verificar productos con stock bajo</div>
                </div>
              </button>
              
              {/* <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Tag className="h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Gestionar Descuentos</div>
                  <div className="text-sm text-gray-600">Crear y administrar promociones</div>
                </div>
              </button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;