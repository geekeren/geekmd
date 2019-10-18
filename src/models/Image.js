export default class MdImage {
  constructor(props) {
    this.id = props.id;
    this.alt = props.alt;
    this.data = props.data;
  }

  set id(value) {
    this.id = value;
  }
}
