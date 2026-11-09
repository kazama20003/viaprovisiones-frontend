'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { rutaProducto } from './producto-url.mjs';

export function EscanerCodigo({ onDetectar, onCerrar }) {
  const video = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    let controls;
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('La cámara necesita HTTPS o localhost y un navegador compatible.');
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        const reader = new BrowserMultiFormatReader();
        controls = await reader.decodeFromVideoDevice(undefined, video.current, result => {
          if (!result || cancelled) return;
          const value = result.getText().trim();
          if (!value || value.length > 80) return;
          cancelled = true; controls?.stop(); onDetectar(value);
        });
        if (cancelled) controls.stop();
      } catch (err) { if (!cancelled) setError(err?.name === 'NotAllowedError' ? 'Permite el acceso a la cámara para escanear.' : (err?.message || 'No se pudo iniciar la cámara.')); }
    })();
    return () => { cancelled = true; controls?.stop(); };
  }, [onDetectar]);
  return <div role="dialog" aria-label="Escanear código" style={{ background:'#f4f4f2',padding:16,borderRadius:18,marginTop:12 }}><strong>Escanear código de barras o QR</strong><p style={{ fontSize:12,color:'#666' }}>Apunta la cámara al código. También puedes escribirlo o usar un lector USB.</p><video ref={video} muted playsInline style={{ width:'100%',maxWidth:440,borderRadius:12,background:'#111' }}/>{error && <p role="alert" style={{ color:'#8e1c14' }}>{error}</p>}<button type="button" onClick={onCerrar} style={{ display:'block',border:0,borderRadius:999,padding:'10px 18px',marginTop:10,cursor:'pointer' }}>Cerrar cámara</button></div>;
}

const subscribeOrigin = () => () => {};
const getOrigin = () => (process.env.NEXT_PUBLIC_STOREFRONT_URL || window.location.origin).replace(/\/$/, '');

export function QrProducto({ id, nombre, sku, publicado, visible }) {
  const origen = useSyncExternalStore(subscribeOrigin, getOrigin, () => '');
  const svg = useRef(null);
  if (!id || !origen) return null;
  const url = `${origen}${rutaProducto(nombre,id,sku)}`;
  const local = /^(localhost|127(?:\.\d+){3}|\[::1\])$/i.test(new URL(origen).hostname);
  const descargar = () => {
    const data = new XMLSerializer().serializeToString(svg.current);
    const objectUrl = URL.createObjectURL(new Blob([data], { type:'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a'); link.href = objectUrl; link.download = `producto-${id}.svg`; link.click(); URL.revokeObjectURL(objectUrl);
  };
  return <section className="pe-code-card" aria-label="QR del producto"><div className="pe-code-preview pe-qr-preview"><QRCodeSVG ref={svg} value={url} size={116} marginSize={3}/></div><div className="pe-code-copy"><strong>QR del producto</strong><p>Abre la ficha en la tienda.</p><p className="pe-code-value">{url}</p>{local && <p role="status" className="pe-code-notice">Esta dirección es local y no funcionará en otros dispositivos. Configura la dirección pública de la tienda para compartir el QR.</p>}{(!publicado || !visible) && <p className="pe-code-notice">La ficha pública estará disponible cuando el producto esté publicado y visible en la tienda.</p>}<button type="button" className="pe-code-button" onClick={descargar}>Descargar QR</button></div></section>;
}

export function CodigoBarras({ valor }) {
  const svg = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let activo = true;
    if (!valor) return;
    import('jsbarcode').then(({ default: JsBarcode }) => {
      if (!activo || !svg.current) return;
      try { JsBarcode(svg.current, valor, { format:'CODE128', displayValue:true, width:2, height:60, margin:10 }); setError(''); }
      catch { setError('Este código no se puede representar en formato Code 128.'); }
    }).catch(() => { if (activo) setError('No se pudo generar el código de barras.'); });
    return () => { activo = false; };
  }, [valor]);
  if (!valor) return null;
  const descargar = () => {
    const objectUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg.current)], { type:'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a'); link.href = objectUrl; link.download = 'codigo-barras.svg'; link.click(); URL.revokeObjectURL(objectUrl);
  };
  return <section className="pe-code-card" aria-label="Código de barras"><div className="pe-code-copy"><strong>Código de barras interno</strong><p>Formato Code 128 · contiene el SKU asignado</p><div className="pe-barcode-preview"><svg ref={svg} role="img" aria-label={`Código de barras ${valor}`} /></div>{error && <p role="alert">{error}</p>}<button type="button" className="pe-code-button" disabled={!!error} onClick={descargar}>Descargar código</button></div></section>;
}
