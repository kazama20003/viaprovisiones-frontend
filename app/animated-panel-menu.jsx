'use client';
import {useEffect,useRef,useState} from 'react';
import {DesignImport} from './native-view';

export default function AnimatedPanelMenu({active,onClose}){
 const [closing,setClosing]=useState(false),timer=useRef(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 const close=()=>{if(timer.current)return;setClosing(true);const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;timer.current=setTimeout(()=>onClose(),reduced?0:420)};
 return <div className={'via-popup-backdrop'+(closing?' is-closing':'')} onClick={e=>{if(e.target===e.currentTarget)close()}}><div className="via-popup-panel"><DesignImport name="MenuPanel" mode="pop" active={active} onClose={close}/></div></div>;
}
