import * as admin from 'firebase-admin';

export interface CargaInicial {
    usuario?: any;
    empresa?: any;
    productos?: any;
    clientes?: any;
    folio?: number;
    sucursales?: any;
}

export class UserController {

    async cargarUsuario(idUsuario: string): Promise<any> {
        let respuesta: CargaInicial = {};
        const urlUsario = `user/${idUsuario}`;

        await admin.firestore().doc(urlUsario).get().then(u => {
            const usuario = u.data();
            respuesta.usuario = usuario;
        }).catch(er => respuesta.usuario = undefined );

        const idEmpresa = respuesta.usuario.id_empresa;
        const urlEmpresa = `empresa/${idEmpresa}`;
        const urlProductos = `empresa/${idEmpresa}/productos`;
        const urlClientes = `empresa/${idEmpresa}/clientes`;
        const urlFolio = `empresa/${idEmpresa}/folio/venta`;
        const urlSucursales = `empresa/${idEmpresa}/sucursales`;
        await admin.firestore().doc(urlEmpresa).get().then(e => {
            const empresa = e.data();
            respuesta.empresa = empresa;
        }).catch(er => respuesta.empresa = undefined );

        await admin.firestore().collection(urlProductos).get().then(p => {
            const productos: any[] = [];
            p.forEach((e: any) => {
              const pro = e.data();
              productos.push(pro);
            });
            respuesta.productos = productos;
        });

        await admin.firestore().collection(urlClientes).get().then(c => {
            const clientes: any[] = [];
            c.forEach((e: any) => {
              const cli = e.data();
              clientes.push(cli);
            });
            respuesta.clientes = clientes;
        });

       
        await admin.firestore().doc(urlFolio).get().then(f => {
            const folio = f.data();
            respuesta.folio = folio ? folio.folioVenta : 0;
        });

        await admin.firestore().collection(urlSucursales).get().then(c => {
            const sucursales: any[] = [];
            c.forEach((e: any) => {
              const suc = e.data();
              suc.clave = e.id;
              sucursales.push(suc);
            });
            respuesta.sucursales = sucursales;
        });

        const promise = new Promise((resolve) => {
            resolve(respuesta);
        });

        return promise;
    }
}
