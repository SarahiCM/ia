import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Cliente HTTP de Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Funciones de acceso a datos
const datosFunciones = {
  obtenerTodosLosClientes: async () => {
    try {
      const clientes = await convex.query(api.datos.obtenerTodosLosClientes);
      return {
        success: true,
        data: clientes,
        count: clientes.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

   obtenerClientePorNombre: async (nombreCliente: string) => {
    try {
      const cliente = await convex.query(api.datos.obtenerClientePorNombre, {
        nombreCliente,
      });
      return { success: true, data: cliente };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

  obtenerTodasLasVentas: async () => {
    try {
      const ventas = await convex.query(api.datos.obtenerTodasLasVentas);
      const totalMonto = ventas.reduce((sum, v) => sum + v.monto, 0);
      const promedio = ventas.length > 0 ? totalMonto / ventas.length : 0;
      return {
        success: true,
        data: ventas,
        stats: {
          total: ventas.length,
          totalMonto,
          promedio,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

  obtenerVentasPorCliente: async (nombreCliente: string) => {
    try {
      const ventas = await convex.query(api.datos.obtenerVentasPorCliente, {
        nombreCliente,
      });
      const totalMonto = ventas.reduce((sum, v) => sum + v.monto, 0);
      return {
        success: true,
        data: ventas,
        stats: {
          total: ventas.length,
          totalMonto,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

  obtenerVentasPorProducto: async (producto: string) => {
    try {
      const ventas = await convex.query(api.datos.obtenerVentasPorProducto, {
        producto,
      });
      const totalCantidad = ventas.reduce((sum, v) => sum + v.cantidad, 0);
      const totalMonto = ventas.reduce((sum, v) => sum + v.monto, 0);
      return {
        success: true,
        data: ventas,
        stats: {
          totalCantidad,
          totalMonto,
          transacciones: ventas.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

  obtenerTodasLasQuejas: async () => {
    try {
      const quejas = await convex.query(api.datos.obtenerTodasLasQuejas);
      return {
        success: true,
        data: quejas,
        count: quejas.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

  obtenerQuejasPorCliente: async (nombreCliente: string) => {
    try {
      const quejas = await convex.query(api.datos.obtenerQuejasPorCliente, {
        nombreCliente,
      });
      return {
        success: true,
        data: quejas,
        count: quejas.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

  obtenerTodosLosProductos: async () => {
    try {
      const productos = await convex.query(api.datos.obtenerTodosLosProductos);
      const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
      return {
        success: true,
        data: productos,
        stats: {
          count: productos.length,
          totalStock,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

  obtenerProductoPorNombre: async (nombreProducto: string) => {
    try {
      const producto = await convex.query(api.datos.obtenerProductoPorNombre, {
        nombreProducto,
      });
      return { success: true, data: producto };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },

  obtenerResumenDatos: async () => {
    try {
      const resumen = await convex.query(api.datos.obtenerResumenDatos);
      return { success: true, data: resumen };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error",
      };
    }
  },
};

// Endpoint POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Listar todas las funciones disponibles
    if (action === "list-funciones") {
      const funcionesList = Object.keys(datosFunciones).map((name) => ({
        name,
        description: `Función para obtener datos de ${name}`,
      }));

      return NextResponse.json({
        success: true,
        funciones: funcionesList,
        totalFunciones: funcionesList.length,
      });
    }

    return NextResponse.json(
      { success: false, error: "Acción no reconocida" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error en Datos Tools:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Exportar funciones para usar en otros endpoints
export { datosFunciones };