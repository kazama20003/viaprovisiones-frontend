'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DesignImport } from '../native-view';

export default function MarcasAdmin({ marcas = [], marcasEstado, marcasError, reintentarMarcas, guardarMarca, marcaPendiente }) {
  const [menu, setMenu] = useState(false);
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [buscar, setBuscar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const guardar = async e => {
    e.preventDefault(); setError(''); setMensaje('');
    try { await guardarMarca(id, { nombre: nombre.trim() }); setMensaje(id ? 'Marca actualizada.' : 'Marca creada.'); setId(null); setNombre(''); }
    catch (err) { setError(err.message || 'No se pudo guardar la marca.'); }
  };
  const toggle = async marca => { setError(''); setMensaje(''); try { await guardarMarca(marca.id, { activa: !marca.activa }); setMensaje(marca.activa ? 'Marca desactivada.' : 'Marca activada.'); } catch (err) { setError(err.message || 'No se pudo actualizar la marca.'); } };
  return <div className="ma-page"><style>{`
    .ma-page{min-height:100vh;background:#f4f4f2;border-radius:40px;overflow:hidden;color:#111;font-family:Manrope,system-ui,sans-serif;position:relative}.ma-head{padding:28px 32px 30px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}.ma-circle{width:52px;height:52px;border:0;border-radius:50%;display:grid;place-items:center;background:#fff;cursor:pointer;text-decoration:none;color:#111}.ma-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,360px);gap:16px;padding:0 20px 24px}.ma-card{background:#fff;border-radius:30px;padding:24px}.ma-input{width:100%;min-height:46px;border:1px solid #e4e4e0;border-radius:14px;padding:10px 14px;font:14px Manrope,system-ui}.ma-btn{border:0;border-radius:999px;background:#111;color:#fff;min-height:42px;padding:0 20px;font:700 13px Manrope,system-ui;cursor:pointer}.ma-btn:disabled{opacity:.5}.ma-sub{background:#f4f4f2;color:#111}.ma-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-top:1px solid #efefec;padding:16px 0}.ma-overlay{position:absolute;inset:0;z-index:20;background:rgba(17,17,17,.3);padding:96px 24px 24px}.ma-overlay-inner{max-width:1100px;margin:auto}@media(max-width:800px){.ma-grid{grid-template-columns:1fr}.ma-form{grid-row:1}.ma-head{padding:24px 20px}.ma-card{padding:20px}}
  `}</style><header className="ma-head"><button className="ma-circle" onClick={() => setMenu(true)} aria-label="Abrir menú">☰</button><Link className="ma-circle" href="/dashboard" aria-label="Ir al panel" style={{ background:'#111',color:'#fff' }}>◉</Link><span><strong>Marcas</strong><br/><span style={{ color:'#8c8c8c' }}>Organización del catálogo</span></span><span style={{ flex:1 }}/><Link href="/producto/editar" className="ma-btn" style={{ display:'inline-flex',alignItems:'center',textDecoration:'none' }}>+ Crear producto</Link></header>
  <div style={{ padding:'0 32px 24px' }}><h1 style={{ margin:'0 0 6px',fontSize:38,fontWeight:600 }}>Marcas</h1><span style={{ color:'#8c8c8c' }}>Crea y organiza las marcas de tus productos.</span></div>
  <div className="ma-grid"><section className="ma-card"><strong>Marcas del catálogo</strong><input className="ma-input" style={{ margin:'18px 0' }} aria-label="Buscar marca" placeholder="Buscar marca..." value={buscar} onChange={e => setBuscar(e.target.value)}/>
    {marcasEstado === 'pending' && <p role="status">Cargando marcas…</p>}{marcasEstado === 'error' && <p role="alert">{marcasError || 'No se pudieron cargar las marcas.'} <button className="ma-btn ma-sub" onClick={reintentarMarcas}>Reintentar</button></p>}
    {marcasEstado === 'success' && !marcas.length && <p>Aún no hay marcas. Crea una para asignarla a tus productos.</p>}
    {marcas.filter(m => m.nombre.toLocaleLowerCase('es').includes(buscar.trim().toLocaleLowerCase('es'))).map(m => <div className="ma-row" key={m.id}><strong style={{ flex:1,minWidth:130 }}>{m.nombre}</strong><span style={{ fontSize:12,color:m.activa?'#1b5e20':'#777' }}>{m.activa?'Activa':'Inactiva'}</span><button className="ma-btn ma-sub" disabled={marcaPendiente} onClick={() => { setId(m.id); setNombre(m.nombre); setError(''); }}>Editar</button><button className="ma-btn ma-sub" disabled={marcaPendiente} onClick={() => toggle(m)}>{m.activa?'Desactivar':'Activar'}</button></div>)}
  </section><section className="ma-card ma-form"><strong>{id ? 'Editar marca' : 'Nueva marca'}</strong><p style={{ fontSize:13,color:'#8c8c8c' }}>Las marcas activas aparecen al crear productos.</p>{mensaje && <p role="status" style={{ color:'#1b5e20' }}>{mensaje}</p>}{error && <p role="alert" style={{ color:'#8e1c14' }}>{error}</p>}<form onSubmit={guardar}><label htmlFor="ma-nombre" style={{ display:'block',fontWeight:700,fontSize:12,margin:'16px 0 6px' }}>Nombre</label><input id="ma-nombre" className="ma-input" maxLength={100} required value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej.: Philips"/><div style={{ display:'flex',gap:8,marginTop:18 }}><button className="ma-btn" style={{ background:'#e8701f' }} disabled={marcaPendiente}>{marcaPendiente?'Guardando…':id?'Guardar cambios':'Crear marca'}</button>{id && <button className="ma-btn ma-sub" type="button" onClick={() => { setId(null); setNombre(''); setError(''); }}>Cancelar</button>}</div></form></section></div>
  {menu && <div className="ma-overlay"><div className="ma-overlay-inner"><DesignImport name="MenuPanel" mode="pop" active="MarcasAdmin" onClose={() => setMenu(false)}/></div></div>}</div>;
}
