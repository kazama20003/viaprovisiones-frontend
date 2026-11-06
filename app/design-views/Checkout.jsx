'use client';
import Link from 'next/link';
import {DesignImport} from '../native-view';
export default function Checkout(){return <div style={{minHeight:'100vh',background:'#fff',fontFamily:'Roboto,system-ui'}}><DesignImport name="Header" accent="#FF914C" cart={0} active=""/><main style={{maxWidth:900,margin:'auto',padding:'48px 24px'}}><h1>Finalizar compra</h1><p>La compra en línea aún se está preparando. El pedido y el pago todavía no están habilitados.</p><p>No se ha realizado ningún cobro ni se ha reservado inventario.</p><Link href="/carrito">← Volver al carrito</Link></main></div>}
