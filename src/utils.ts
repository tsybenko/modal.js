export const isFunc = (v: any): boolean =>
    typeof v === 'function';
export const isPromise = (v: any): boolean =>
    typeof v === 'object' && v.__proto__.hasOwnProperty('then');

export const mapProps = (target: object, reference: object) => {
  for (let prop in reference) {
    if (!target.hasOwnProperty(prop)) {
      target[prop] = reference[prop];
      if (typeof reference[prop] === 'object') {
        mapProps(target[prop], reference[prop]);
      }
    }
  }
};