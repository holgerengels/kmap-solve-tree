import {html, css, LitElement, property, PropertyValues, internalProperty} from 'lit-element';
import {katexStyles} from "./katex-css.js";

export class KmapSolveTree extends LitElement {
  static styles = [css`
    :host {
      display: flex;
      flex-flow: column;
      width: 400px;
      color: var(--kmap-solve-tree-text-color, #000);
    }
    step, label, comment {
        display: none;
        flex: 1 0 calc(100% - 18px);
        margin: 4px;
    }
    action:not([current]) > step, action:not([current]) > label {
        cursor: pointer;
    }
    action {
        display: none;
        border-radius: 4px;
    }
    action[done] {
        display: contents;
    }
    action[done] > step {
        display: inline-block;
    }
    action[done] > label {
        display: none;
    }
    action[current] {
        display: flex;
        flex-flow: row wrap;
    }
    action[current] > action > label {
        display: inline-block;
        flex: 0 1 auto;
        padding: 4px;
        border: 1px solid var(--kmap-solve-tree-border-color, gray);
        border-radius: 4px;
        background-color: var(--kmap-solve-tree-background-color, lightgray);
    }
    action[current] > step, action[current] > comment {
        display: inline-block;
    }
    action[current] > action {
        display: contents;
    }

    action[gain=finish] {
      background-color: #b9f6ca;
    }
    action[gain=negative] {
      background-color: #ffff8d;
    }
    action[gain=negative] {
      background-color: #ffd180;
    }
    action[gain=wrong], action[gain='dead end'] {
      background-color: #ff8a80;
    }

    action[faded] {
      opacity: 0;
    }
    action:not([faded]) {
      transition: opacity 0.7s ease-in-out;
    }
  `, katexStyles];

  declare shadowRoot: ShadowRoot;

  private _startAction!: HTMLElement;

  @internalProperty()
  private _currentAction!: HTMLElement;

  @property()
  public valid?: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._click);
  }
  disconnectedCallback() {
    this.removeEventListener('click', this._click);
    super.disconnectedCallback();
  }

  protected async firstUpdated(_changedProperties: PropertyValues) {
    // @ts-ignore
    this.shadowRoot.append(...this.childNodes);
    console.log(this.shadowRoot.childNodes);
    for (let i = 0; i < this.shadowRoot.childNodes.length; i++) {
      if (this.shadowRoot.childNodes[i].nodeName === 'ACTION') {
        this._startAction = this.shadowRoot.childNodes[i] as HTMLElement;
        this._currentAction = this.shadowRoot.childNodes[i] as HTMLElement;
        this._currentAction.setAttribute('current', 'true');
        break;
      }
    }
    console.log(this._startAction);
  }

  protected async update(_changedProperties: PropertyValues) {
    if (_changedProperties.has('_currentAction')) {
      const oldAction: HTMLElement = _changedProperties.get('_currentAction') as HTMLElement;
      if (oldAction)
        oldAction.removeAttribute('current');
      const newAction: HTMLElement = this._currentAction;
      newAction.setAttribute('current', 'true');
      newAction.setAttribute('faded', 'true');
      setTimeout(function () {
        newAction.removeAttribute("faded");
      });

      this.valid = newAction.getAttribute("gain") === "finish";

      this.shadowRoot.querySelectorAll('action').forEach(a => {
        if ((a as HTMLElement).contains(this._currentAction) && a !== this._currentAction)
          a.setAttribute('done', 'true');
        else
          a.removeAttribute('done');
      });
    }
    super.update(_changedProperties);
  }

  render() {
    return html`
        <slot></slot>
    `;
  }

  _click(e: MouseEvent) {
    console.log(e);
    const target = (e.composedPath() as Element[]).filter(p => p.tagName === 'LABEL' || p.tagName === `STEP`)[0];

    console.log(target);

    if (target instanceof HTMLElement && (target.tagName === 'LABEL' || target.tagName === 'STEP')) {
      // @ts-ignore
      this._currentAction = target.parentElement as HTMLElement;
      console.log(this._currentAction);
    }
  }

  public bark() {
    if (!this._currentAction) return;

    const current = this._currentAction;
    current.setAttribute('faded', 'true');
    setTimeout(function () {
      current.removeAttribute("faded");
    });
  }

  public showAnswer() {
    const finish = this.shadowRoot.querySelectorAll('action[gain=finish]')[0];
    if (!finish) return;

    this._currentAction = finish as HTMLElement;
  }
}
