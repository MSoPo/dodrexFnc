import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { VentaAdmin } from './Controller/venta/VentaController';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as admin from 'firebase-admin';
import { ProductoAdmin } from './Controller/producto/ProductoController';
import { EmpresaAdmin } from './Controller/empresa/EmpresaController';

admin.initializeApp();
exports.addVenta = functions.firestore.document('empresa/{idEmrpresa}/ventas/{id}')
  .onCreate((dataSnapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
    console.log('Funcion de nueva venta');
    return new VentaAdmin().newVenta(dataSnapshot, context);
});

exports.addVentaPagos = functions.firestore.document('empresa/{idEmrpresa}/ventasPago/{id}')
  .onCreate((dataSnapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
    console.log('Funcion de nueva vanta a pagos');
    return new VentaAdmin().newVentaPagos(dataSnapshot, context);
});


exports.addPago = functions.firestore.document('empresa/{idEmrpresa}/ventasPago/{idVentaPago}/pagos/{id}')
  .onCreate((dataSnapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
    console.log('Funcion de nueva vanta a pagos');
    return new VentaAdmin().newPagos(dataSnapshot, context);
});


exports.deleteVenta = functions.firestore.document('empresa/{idEmrpresa}/ventas/{id}')
.onDelete((dataSnapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
  console.log('Funcion de nueva venta');
  return new VentaAdmin().deleteVenta(dataSnapshot, context);
})

exports.cargarProductos = functions.firestore.document('empresa/{idEmrpresa}/cargas/{id}')
  .onCreate((dataSnapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
    console.log('Funcion carga');
    return new ProductoAdmin().newCarga(dataSnapshot, context);
  });

exports.addEmpresa = functions.firestore.document('empresa/{idEmrpresa}')
.onCreate((dataSnapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
  console.log('Funcion crear folios');
  return new EmpresaAdmin().newEmpresa(dataSnapshot, context);
});

//EXPRESS
import * as express from 'express';
import * as cors from 'cors';
import { UserController } from './Controller/usuario/UserController';

const app = express();
app.use(cors());

app.post('/V1', (req, resp, next) => {
  new VentaAdmin().obtenerFolio(req.body.data.idEmpresa).then(r => {
    console.log(r.data());
    return resp.status(200).json({
      folioVenta: r.data().folioVenta,
    });
  }
  ).catch(err => {
    console.log(err);
    return resp.status(500).json({
      responseError: err.toString(),
    })
  });
});

const appInicial = express();
appInicial.use(cors());
appInicial.post('/V1', (req, resp, next) => {
  new UserController().cargarUsuario(req.body.data.idUsuario).then(r => {
    console.log(r);
    return resp.status(200).json(r);
  }
  ).catch(err => {
    console.log(err);
    return resp.status(500).json({
      responseError: err.toString(),
    })
  });
});

exports.numVenta = functions.https.onRequest(app);
exports.cargaInicial = functions.https.onRequest(appInicial);