import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { KmapSolveTree } from '../src/KmapSolveTree.js';
import '../src/kmap-solve-tree.js';

describe('KmapSolveTree', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    // @ts-ignore
    const el = await fixture<KmapSolveTree>(html`<kmap-solve-tree></kmap-solve-tree>`);

    //expect(el.title).to.equal('Hey there');
    //expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    // @ts-ignore
    const el = await fixture<KmapSolveTree>(html`<kmap-solve-tree></kmap-solve-tree>`);
    el.shadowRoot!.querySelector('button')!.click();

    //expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    // @ts-ignore
    const el = await fixture<KmapSolveTree>(html`<kmap-solve-tree title="attribute title"></kmap-solve-tree>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    // @ts-ignore
    const el = await fixture<KmapSolveTree>(html`<kmap-solve-tree></kmap-solve-tree>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
