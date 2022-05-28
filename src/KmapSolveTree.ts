import {html, css, LitElement, PropertyValues} from 'lit';
import {property, state} from 'lit/decorators.js';
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
        padding: 4px 8px;
        border-radius: 4px;
    }
    action:not([current]) > step, action:not([current]) > label {
        cursor: pointer;
    }
    action:not([current]) > step:hover, action:not([current]) > label:hover {
        background-color: #F5F8FB;
    }
    action:not([current]) > label {
        margin: 4px;
    }
    action {
        display: none;
        border-radius: 4px;
        padding: 4px;
    }
    action[done] {
        display: contents;
    }
    action[done] > step {
        display: inline-block;
        padding: 4px 12px;
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
        padding: 4px 8px;
        color: #005b9f;
        border: 1px solid var(--kmap-solve-tree-border-color, #005b9f);
        border-radius: 4px;
        background-color: var(--kmap-solve-tree-background-color, transparent);
    }
    action[current] > step, action[current] > comment {
        display: inline-block;
    }
    action[current] > action {
        display: contents;
    }

    action[gain=finish] {
      background-color: #e8f5e9;
    }
    action[gain=positive] {
      background-color: #e3f2fd;
    }
    action[gain=negative] {
      background-color: #fff3e0;
    }
    action[gain=wrong], action[gain='dead end'] {
      background-color: #ffebee;
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

  @state()
  private _currentAction!: HTMLElement;

  @property()
  public valid: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._click);
  }
  disconnectedCallback() {
    this.removeEventListener('click', this._click);
    super.disconnectedCallback();
  }

  protected async firstUpdated() {
    // @ts-ignore
    this.shadowRoot.append(...this.childNodes);
    for (let i = 0; i < this.shadowRoot.childNodes.length; i++) {
      if (this.shadowRoot.childNodes[i].nodeName === 'ACTION') {
        this._startAction = this.shadowRoot.childNodes[i] as HTMLElement;
        this._currentAction = this.shadowRoot.childNodes[i] as HTMLElement;
        this._currentAction.setAttribute('current', 'true');
        break;
      }
    }
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
    const target = (e.composedPath() as Element[]).filter(p => p.tagName === 'LABEL' || p.tagName === `STEP`)[0];

    if (target instanceof HTMLElement && (target.tagName === 'LABEL' || target.tagName === 'STEP')) {
      // @ts-ignore
      this._currentAction = target.parentElement as HTMLElement;
    }
  }

  public init() {
    this._currentAction = this._startAction;
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
    let finish = this.shadowRoot.querySelectorAll('action[best]')[0];
    if (!finish)
      finish = this.shadowRoot.querySelectorAll('action[gain=finish]')[0];

    if (!finish) return;

    this._currentAction = finish as HTMLElement;
  }

  public isValid(): boolean {
    return this.valid;
  }
}
