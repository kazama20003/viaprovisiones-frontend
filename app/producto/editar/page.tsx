import {Suspense} from 'react';
import NativeView from '../../native-view';
export default function EditarProductoPage(){return <Suspense fallback={<main className="design-frame-shell" aria-busy="true"/>}><NativeView name="ProductoEditar"/></Suspense>}
