import { UIBuilderOptions } from "../interfaces/UIBuilderOptions";
import { defaults } from "./defaults";
import { mapProps } from "../utils";

interface UIStructure {
  header: HTMLDivElement,
  body: HTMLDivElement,
  footer: HTMLDivElement
}

class Builder {
  private rootElement: HTMLElement;
  private options: UIBuilderOptions;

  constructor(
    rootElement: HTMLElement,
    options: UIBuilderOptions = defaults
  ) {
    this.rootElement = rootElement;
    this.options = { ...options };
    mapProps(this.options as Record<string, any>, defaults as Record<string, any>);
  }

  private createHeader(): HTMLDivElement {
    const node = document.createElement('div');
    node.classList.add(this.options.classLists?.header ?? '');
    return node;
  }

  private createBody(): HTMLDivElement {
    const node = document.createElement('div');
    node.classList.add(this.options.classLists?.body ?? '');
    return node;
  }

  private createFooter(): HTMLDivElement {
    const node = document.createElement('div');
    node.classList.add(this.options.classLists?.footer ?? '');
    return node;
  }

  private build(): UIStructure {
    return {
      header: this.createHeader(),
      body: this.createBody(),
      footer: this.createFooter()
    };
  }

  mount(): void {
    const nodes: UIStructure = this.build();
    this.rootElement.appendChild(nodes.header);
    this.rootElement.appendChild(nodes.body);
    this.rootElement.appendChild(nodes.footer);
  }
}

export { Builder };
