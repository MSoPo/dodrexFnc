import * as admin from 'firebase-admin';
import { EventContext } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export class ProductoAdmin {
  async newCarga(data: QueryDocumentSnapshot, context: EventContext): Promise<void> {
    const carga = data.data();
    console.log(carga.id);
    const lstProd: [] = carga.productos;
    lstProd.forEach(async (prod: Producto) => {
      const url = `empresa/${context.params.idEmrpresa}/productos/${prod.id}`;
      console.log(`create carga => ${url} => ++ ${prod.cantidad}`);
      try {
        await admin.firestore().doc(url).set({
          cantidad: admin.firestore.FieldValue.increment(+(prod.cantidad)),
          operacion: 'update',
        }, { merge: true });
        console.log(`Se actualizo la cantidad correctamente`);
      } catch (error) {
        console.error(`Error al guardar la venta => ${error}`);
      }
    });
  }

  async deleteVenta(data: QueryDocumentSnapshot, context: EventContext): Promise<void> {
    const venta = data.data();
    const lstProd: [] = venta.productos;
    console.log(`empresa/${context.params.idEmrpresa}/productos/${venta.productos[0].id}`);
    lstProd.forEach(async (prod: Producto) => {
      const url = `empresa/${context.params.idEmrpresa}/productos/${prod.id}`;
      console.log(`Prueba create venta => ${url}`);
      try {
        await admin.firestore().doc(url).set({
          cantidad: admin.firestore.FieldValue.increment(+(prod.cantidad)),
          operacion: 'update',
        }, { merge: true });
        console.log(`Se actualizo la cantidad correctamente`);
      } catch (error) {
        console.error(`Error al guardar la venta => ${error}`);
      }
    });

    const ulrVentaCancelada = `empresa/${context.params.idEmrpresa}/ventaCancelada`;
    await admin.firestore().collection(ulrVentaCancelada).add({...venta, fecha_cancelacion: new Date()});

  }

}

interface Producto {
    id: string;
    cantidad: number;
};
