"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  renderVals() {
    return {};
  }
}

const defaults = {};

export default function PanelMenuAbierto(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"body{margin:0;background:#E9E9E7}"}</style>
    <DesignImport name={"Dashboard"} menuAbierto={true} />
    </Fragment>
  )} />;
}
