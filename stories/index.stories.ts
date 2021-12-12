import { html, TemplateResult } from 'lit-html';
import '../src/kmap-solve-tree.js';

export default {
  title: 'KmapSolveTree',
  component: 'kmap-solve-tree',
  argTypes: {
    textColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    borderColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({
  textColor,
  backgroundColor,
  borderColor,
  slot,
}: ArgTypes) => html`
  <kmap-solve-tree
    style="--kmap-solve-tree-text-color: ${textColor || 'black'} --kmap-solve-tree-background-color: ${backgroundColor || 'black'} --kmap-solve-tree-border-color: ${borderColor || 'black'}"
  >
    ${slot}
    <action gain="start">
      <step>\`(x-2)^2 = 0\`</step>
      <action gain="negative">
        <label>Ausmultiplizieren (Binom)</label>
        <step>\`x^2 - 4x + 4 = 0\`</step>
        <action gain="negative">
          <label>Auf beiden Seiten 4 subtrahieren</label>
          <step>\`x^2 - 4x = -4\`</step>
          <action gain="wrong">
            <label>Durch \`x\` teilen</label>
            <step>\`x - 4 = -4/x\`</step>
            <comment>Fehler: Teilen durch \`x\` ist keine Äquivalenzumformung</comment>
          </action>
        </action>
        <action gain="finish">
          <label>Mitternachtsformel</label>
          <step>\`x_(1,2) = 2\`</step>
        </action>
      </action>
      <action gain="finish">
        <label>Satz vom Nullprodukt</label>
        <step>\`x - 2 = 0 => x = 2\`</step>
        <comment>Schnellster Lösungsweg</comment>
      </action>
    </action>
  </kmap-solve-tree>
`;

export const Regular = Template.bind({});

export const SlottedContent = Template.bind({});
SlottedContent.args = {
  slot: html`
    <action gain="start" done>
      <step>\`(x-2)^2=0\`</step>
      <action gain="negative" done>
        <label>Ausmultiplizieren</label>
        <step>\`x^2 - 4x + 4 = 0\`</step>
        <action gain="finish" done>
          <label>Mitternachtsformel</label>
          <step>\`x_(1,2) = 2\`</step>
        </action>
      </action>
      <action gain="finish">
        <label>Satz vom Nullprodukt</label>
        <step>\`x - 2 = 0 => x = 2\`</step>
      </action>
    </action>
  `,
};
SlottedContent.argTypes = {
  slot: { table: { disable: true } },
};
