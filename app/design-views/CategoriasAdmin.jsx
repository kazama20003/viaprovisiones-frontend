"use client";

import { useState } from "react";
import Link from "next/link";
import { DesignImport } from "../native-view";
import { nivelCategoria, opcionesCategoria, rutaCategoria } from '../categoria-jerarquia';

export default function CategoriasAdmin({ categorias = [], estado, error, guardarCategoria, pendiente, reintentar }) {
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [padre, setPadre] = useState('');
  const [message, setMessage] = useState('');
  const [failure, setFailure] = useState('');
  const [filter, setFilter] = useState('');
  const reset = () => { setEditing(null); setNombre(''); setDescripcion(''); setPadre(''); setFailure(''); };
  const submit = async (event) => {
    event.preventDefault();
    if (!nombre.trim()) { setFailure('Escribe el nombre de la categoría.'); return; }
    setFailure(''); setMessage('');
    try { await guardarCategoria(editing, { nombre: nombre.trim(), descripcion: descripcion.trim(), categoriaPadreId: padre || null }); setMessage(editing ? 'Categoría actualizada.' : 'Categoría creada.'); reset(); }
    catch (err) { setFailure(err.message || 'No se pudo guardar la categoría.'); }
  };
  const toggle = async (categoria) => {
    setFailure(''); setMessage('');
    try { await guardarCategoria(categoria.id, { activa: !categoria.activa }); setMessage(categoria.activa ? 'Categoría desactivada.' : 'Categoría activada.'); }
    catch (err) { setFailure(err.message || 'No se pudo cambiar el estado.'); }
  };
  const pin = () => { const next = localStorage.getItem('via-menu-pinned') !== '1'; localStorage.setItem('via-menu-pinned', next ? '1' : '0'); window.dispatchEvent(new CustomEvent('via-menu-pin-change', { detail: next })); setMenu(false); };
  const rows = opcionesCategoria(categorias).filter(c => rutaCategoria(categorias, c.id).toLocaleLowerCase('es').includes(filter.trim().toLocaleLowerCase('es')));
  return <div className="ca-page">
    <style>{`
      .ca-page{min-height:100vh;background:#f4f4f2;border-radius:40px;color:#111;font-family:Manrope,system-ui,sans-serif;overflow:hidden;position:relative}
      .ca-header{padding:28px 32px 30px;display:flex;flex-wrap:wrap;align-items:center;gap:14px}
      .ca-circle{width:52px;height:52px;border:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#fff;color:#111;cursor:pointer;text-decoration:none;flex:none}
      .ca-title{display:flex;flex-direction:column;line-height:1.2}.ca-content{padding:0 20px 24px;display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,360px);gap:16px;align-items:start}
      .ca-card{background:#fff;border-radius:30px;padding:24px}.ca-button{border:0;border-radius:999px;background:#111;color:#fff;min-height:44px;padding:0 20px;font:700 13px Manrope,system-ui;cursor:pointer}
      .ca-button:disabled{opacity:.55;cursor:wait}.ca-secondary{background:#f4f4f2;color:#111}.ca-input{width:100%;min-height:46px;border:1px solid #e4e4e0;border-radius:14px;padding:10px 14px;font:14px Manrope,system-ui;color:#111;background:#fff}.ca-input:focus-visible,.ca-button:focus-visible,.ca-circle:focus-visible{outline:2px solid #e8701f;outline-offset:2px}
      .ca-list{margin-top:18px}.ca-row{display:flex;align-items:center;gap:12px;padding:15px 0 15px min(calc(var(--nivel) * 32px), 128px);border-top:1px solid #efefec;flex-wrap:wrap}.ca-row-copy{flex:1;min-width:150px}.ca-row-icon{width:40px;height:40px;flex:none;border-radius:14px;background:#fff1e6;display:grid;place-items:center;color:#c2410c;font-weight:800}.ca-row-child .ca-row-icon{background:#f5f4f1;color:#e8701f}.ca-branch{width:20px;height:30px;flex:none;border-left:2px solid #e5ded6;border-bottom:2px solid #e5ded6;border-radius:0 0 0 8px;margin-top:-18px}.ca-level{display:inline-block;margin-top:5px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#b85a19}.ca-row-meta{display:block;margin-top:4px;font-size:12px;line-height:1.5;color:#777;overflow-wrap:anywhere}.ca-label{display:block;font-size:12px;font-weight:700;color:#444;margin:16px 0 6px}
      .ca-overlay{position:absolute;inset:0;z-index:20;background:rgba(17,17,17,.3);padding:96px 24px 24px}.ca-overlay-inner{max-width:1100px;margin:auto}
      @media(max-width:800px){.ca-content{grid-template-columns:1fr}.ca-header{padding:24px 20px}.ca-card{padding:20px}.ca-form{grid-row:1}.ca-row{padding-left:min(calc(var(--nivel) * 16px), 48px);gap:8px}.ca-branch{width:14px}.ca-row-copy{min-width:130px}.ca-row .ca-button{min-height:38px;padding:0 14px}}
    `}</style>
    <header className="ca-header">
      <button className="ca-circle" onClick={() => setMenu(true)} aria-label="Abrir menú"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 8h16M4 16h10" /></svg></button>
      <Link className="ca-circle" href="/dashboard" aria-label="Ir al panel" style={{ background: '#111', color: '#fff' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 5 5.5 15l6.5-2.5 6.5 2.5L12 5Z"/></svg></Link>
      <span className="ca-title"><strong>Categorías</strong><span style={{ color:'#8c8c8c' }}>Organización del catálogo</span></span>
      <span style={{ flex: 1 }} />
      <Link className="ca-button" href="/producto/editar" style={{ display:'inline-flex',alignItems:'center',textDecoration:'none' }}>+ Crear producto</Link>
    </header>
    <div style={{ padding:'0 32px 24px' }}><h1 style={{ margin:'0 0 6px',fontSize:38,letterSpacing:'-.02em',fontWeight:600 }}>Categorías</h1><span style={{ color:'#8c8c8c',fontSize:16 }}>Crea y organiza las categorías de tus productos.</span></div>
    <div className="ca-content">
      <section className="ca-card" aria-label="Lista de categorías">
        <div style={{ display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:18 }}><strong style={{ flex:1 }}>Categorías del catálogo</strong><span style={{ color:'#8c8c8c',fontSize:12 }}>{categorias.length} categorías</span></div>
        <input className="ca-input" type="search" aria-label="Buscar categoría" placeholder="Buscar categoría..." value={filter} onChange={e => setFilter(e.target.value)} />
        {estado === 'pending' && <p role="status">Cargando categorías…</p>}
        {estado === 'error' && <p role="alert">{error || 'No se pudieron cargar las categorías.'} <button className="ca-button ca-secondary" onClick={reintentar}>Reintentar</button></p>}
        {estado === 'success' && rows.length === 0 && <p style={{ color:'#6b6b6b',fontSize:14 }}>{filter ? 'No hay categorías que coincidan.' : 'Aún no hay categorías. Crea la primera para organizar tus productos.'}</p>}
        <div className="ca-list">{rows.map(c => { const nivel = nivelCategoria(categorias, c.id); const ruta = rutaCategoria(categorias, c.id); return <div className={'ca-row' + (nivel ? ' ca-row-child' : '')} key={c.id} style={{ '--nivel': nivel }}>
          {nivel > 0 && <span className="ca-branch" aria-hidden="true" />}
          <span className="ca-row-icon" aria-hidden="true">{nivel ? '↳' : '#'}</span>
          <span className="ca-row-copy"><strong style={{ display:'block',fontSize:14,overflowWrap:'anywhere' }}>{c.nombre}</strong><span className="ca-level">{nivel ? `Subcategoría · nivel ${nivel + 1}` : 'Categoría principal'}</span>{nivel > 0 && <span className="ca-row-meta">{ruta}</span>}<span className="ca-row-meta">{c.descripcion || 'Sin descripción'} · {c._count.productos} productos</span></span>
          <span style={{ borderRadius:999,padding:'5px 10px',fontSize:11,fontWeight:700,background:c.activa?'#e4f4e7':'#efefec',color:c.activa?'#1b5e20':'#6b6b6b' }}>{c.activa ? 'Activa' : 'Inactiva'}</span>
          <button className="ca-button ca-secondary" disabled={pendiente} onClick={() => { setEditing(c.id); setNombre(c.nombre); setDescripcion(c.descripcion || ''); setPadre(c.categoriaPadreId || ''); setFailure(''); setMessage(''); }}>Editar</button>
          <button className="ca-button ca-secondary" disabled={pendiente} onClick={() => toggle(c)}>{c.activa ? 'Desactivar' : 'Activar'}</button>
        </div>; })}</div>
      </section>
      <section className="ca-card ca-form" aria-label={editing ? 'Editar categoría' : 'Nueva categoría'}>
        <strong>{editing ? 'Editar categoría' : 'Nueva categoría'}</strong>
        <p style={{ fontSize:13,color:'#8c8c8c',lineHeight:1.5 }}>Las categorías activas aparecen al crear o editar productos.</p>
        {message && <p role="status" style={{ color:'#1b5e20',fontSize:13 }}>{message}</p>}
        {failure && <p role="alert" style={{ color:'#8e1c14',fontSize:13 }}>{failure}</p>}
        <form onSubmit={submit}>
          <label className="ca-label" htmlFor="ca-nombre">Nombre</label><input id="ca-nombre" className="ca-input" maxLength={120} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej.: Iluminación" required />
          <label className="ca-label" htmlFor="ca-padre">Categoría superior (opcional)</label><select id="ca-padre" className="ca-input" value={padre} onChange={e => setPadre(e.target.value)}><option value="">Ninguna — categoría principal</option>{opcionesCategoria(categorias).filter(c => c.activa && c.id !== editing).map(c => <option key={c.id} value={c.id}>{rutaCategoria(categorias, c.id)}</option>)}</select>
          <label className="ca-label" htmlFor="ca-descripcion">Descripción (opcional)</label><textarea id="ca-descripcion" className="ca-input" maxLength={300} rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Describe esta categoría" />
          <div style={{ display:'flex',gap:8,marginTop:18,flexWrap:'wrap' }}><button className="ca-button" disabled={pendiente} type="submit" style={{ background:'#e8701f' }}>{pendiente ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear categoría'}</button>{editing && <button className="ca-button ca-secondary" type="button" onClick={reset}>Cancelar</button>}</div>
        </form>
      </section>
    </div>
    {menu && <div className="ca-overlay"><div className="ca-overlay-inner"><DesignImport name="MenuPanel" mode="pop" active="CategoriasAdmin" onClose={() => setMenu(false)} onPin={pin} /></div></div>}
  </div>;
}
