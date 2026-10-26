"use client";

import { Component } from "react";

export class DesignLogic {
  constructor(props) { this.props = props; this.state = {}; this.notify = null; }
  setState(update) {
    const patch = typeof update === "function" ? update(this.state, this.props) : update;
    this.state = { ...this.state, ...patch };
    if (this.notify) this.notify();
  }
}

export class DesignHost extends Component {
  constructor(props) {
    super(props);
    this.logic = new props.Logic({ ...props.defaults, ...props.componentProps });
    this.logic.notify = () => this.forceUpdate();
  }
  componentDidMount() {
    this.logic.notify = () => this.forceUpdate();
    if (this.logic.componentDidMount) this.logic.componentDidMount();
  }
  componentWillUnmount() {
    if (this.logic.componentWillUnmount) this.logic.componentWillUnmount();
    this.logic.notify = null;
    if (this.logic.closeTimer) clearTimeout(this.logic.closeTimer);
  }
  render() {
    this.logic.props = { ...this.props.defaults, ...this.props.componentProps };
    return this.props.render(this.logic.renderVals());
  }
}

export function lookup(root, path) {
  if (!path) return root;
  return path.split(".").reduce((value, key) => value == null ? undefined : value[key], root);
}
export function truthy(value) { return value !== "false" && Boolean(value); }
export function assetSrc(value) {
  if (typeof value !== "string") return value;
  return value.startsWith("img/") ? `/storefront/${value}` : value;
}
