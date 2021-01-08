import {el, mount} from "../web_modules/redom.js";
export class SampleSelect {
  constructor(handler) {
    this.handler = handler;
    this.el = el(`div.sampleSelect`);
    this.handleClick = this.handleClick.bind(this);
    this.elements = [];
    this.selectedIndex = -1;
  }
  handleClick(index) {
    if (index === this.selectedIndex)
      return;
    if (this.selectedIndex > -1)
      this.elements[this.selectedIndex].classList.remove(`selected`);
    this.elements[index].classList.add(`selected`);
    this.handler.onSampleSelected(index, this.selectedIndex > -1 ? this.selectedIndex : void 0);
    this.selectedIndex = index;
  }
  add(index, label) {
    const item = el(`div.sampleItem`, label);
    item.addEventListener(`click`, (event) => {
      event.preventDefault();
      this.handleClick(index);
    });
    this.elements.push(item);
    mount(this.el, item);
  }
}
