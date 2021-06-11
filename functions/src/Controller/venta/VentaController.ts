import * as admin from 'firebase-admin';
import { EventContext } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export class VentaAdmin {
  async newVenta(data: QueryDocumentSnapshot, context: EventContext): Promise<void> {
    const venta = data.data();
    const lstProd: [] = venta.productos;
    console.log(`empresa/${context.params.idEmrpresa}/productos/${venta.productos[0].id}`);
    //await this.getPagoVenta(context.params.idEmrpresa);
    lstProd.forEach(async (prod: Producto) => {
      const url = `empresa/${context.params.idEmrpresa}/productos/${prod.id}`;
      console.log(`VENTA SUCURSAL => ${venta.numeroSucursal}`);
      try {
        switch(venta.numeroSucursal){
          case 1: 
            console.log(`SUCURSAL 1=> ${prod.cantidad}`);
            await admin.firestore().doc(url).set({
            sucursal1: admin.firestore.FieldValue.increment(-(prod.cantidad)),
            operacion: 'update',
          }, { merge: true }); break;

          case 2: 
            console.log(`SUCURSAL 2=> ${prod.cantidad}`);
            await admin.firestore().doc(url).set({
            sucursal2: admin.firestore.FieldValue.increment(-(prod.cantidad)),
            operacion: 'update',
          }, { merge: true }); break;

          case 3: 
            console.log(`SUCURSAL 3=> ${prod.cantidad}`);
            await admin.firestore().doc(url).set({
            sucursal3: admin.firestore.FieldValue.increment(-(prod.cantidad)),
            operacion: 'update',
          }, { merge: true }); break;
        }

        if(!venta.numeroSucursal){
          console.log(`SUCURSAL NA=> ${prod.cantidad}`);
          await admin.firestore().doc(url).set({
            cantidad: admin.firestore.FieldValue.increment(-(prod.cantidad)),
            operacion: 'update',
          }, { merge: true });
        }
        console.log(`Se actualizo la cantidad correctamente`);
      } catch (error) {
        console.error(`Error al guardar la venta => ${error}`);
      }
    });
  }

  async obtenerFolio(idEmpresa: string): Promise<any> {
    const url = `empresa/${idEmpresa}/folio/venta`;
    console.log(`Obtenre  Folio => ${url}`);
    const folio = admin.firestore().doc(url).get();
      console.log(`Aumentar Folio => ${url}`);
      try {
        await admin.firestore().doc(url).set({
          folioVenta: admin.firestore.FieldValue.increment(+1),
          operacion: 'update',
        }, { merge: true });
        console.log(`Se actualizo el folio correctamente`);
      } catch (error) {
        console.error(`Error al guardar la venta => ${error}`);
      }

      return folio;
  }
  

  async newVentaPagos(data: QueryDocumentSnapshot, context: EventContext): Promise<void> {
    const venta = data.data();
    const url = `empresa/${context.params.idEmrpresa}/ventasPago/${data.id}/pagos`;
    console.log(`Create ventaPago => ${url}`);
    try {
      await admin.firestore().collection(url).add({
        'fecha' : venta.fecha,
        'pago' : venta.pagoInicial,
      });
       console.log(`Se ingreso el primer pago de la venta`);
     } catch (error) {
       console.error(`Error al guardar el pago de la venta => ${error}`);
     }
  }

  async newPagos(data: QueryDocumentSnapshot, context: EventContext): Promise<void> {
    const pago = data.data();
    const url = `empresa/${context.params.idEmrpresa}/ventasPago/${context.params.idVentaPago}`;
    console.log(`Create actualizarDeuda => ${url}`);
    try {
      await admin.firestore().doc(url).set({
        deuda: admin.firestore.FieldValue.increment(-(pago.pago)),
        operacion: 'update',
      }, { merge: true });
       console.log(`Realizo el descuento a la deuda de ${pago.pago}`);
     } catch (error) {
       console.error(`Error al guardar el pago de la venta => ${error}`);
     }
  }

  async deleteVenta(data: QueryDocumentSnapshot, context: EventContext): Promise<void> {
    const venta = data.data();
    const lstProd: [] = venta.productos;
    console.log(`empresa/${context.params.idEmrpresa}/productos/${venta.productos[0].id}`);
    lstProd.forEach(async (prod: Producto) => {
      const url = `empresa/${context.params.idEmrpresa}/productos/${prod.id}`;
      console.log(`VENTA SUCURSAL => ${venta.numeroSucursal}`);
      try {
        switch(venta.numeroSucursal){
          case 1: await admin.firestore().doc(url).set({
            sucursal1: admin.firestore.FieldValue.increment(+(prod.cantidad)),
            operacion: 'update',
          }, { merge: true }); break;

          case 2: await admin.firestore().doc(url).set({
            sucursal2: admin.firestore.FieldValue.increment(+(prod.cantidad)),
            operacion: 'update',
          }, { merge: true }); break;

          case 3: await admin.firestore().doc(url).set({
            sucursal3: admin.firestore.FieldValue.increment(+(prod.cantidad)),
            operacion: 'update',
          }, { merge: true }); break;
        }

        if(!venta.numeroSucursal){
          await admin.firestore().doc(url).set({
            cantidad: admin.firestore.FieldValue.increment(+(prod.cantidad)),
            operacion: 'update',
          }, { merge: true });
        }
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
