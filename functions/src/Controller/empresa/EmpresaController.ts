import * as admin from 'firebase-admin';
import { EventContext } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export class EmpresaAdmin {
  async newEmpresa(data: QueryDocumentSnapshot, context: EventContext): Promise<void> {
    const url = `empresa/${context.params.idEmrpresa}/folio/venta`;
    console.log(url);
    try {
      await admin.firestore().doc(url).set({
        folioVenta: 1,
        operacion: 'create',
    }, { merge: true });
      console.log(`Se creo el folio`);
    } catch (error) {
      console.error(`Error al crear el folio => ${error}`);
    }
  }

}

